package com.ratingapp.controller;

import com.ratingapp.dto.AddStoreRequest;
import com.ratingapp.dto.AddUserRequest;
import com.ratingapp.model.Rating;
import com.ratingapp.model.Role;
import com.ratingapp.model.Store;
import com.ratingapp.model.User;
import com.ratingapp.repository.RatingRepository;
import com.ratingapp.repository.StoreRepository;
import com.ratingapp.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private UserRepository userRepository;
    @Autowired private StoreRepository storeRepository;
    @Autowired private RatingRepository ratingRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    // ----- Dashboard -----
    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalStores", storeRepository.count());
        stats.put("totalRatings", ratingRepository.count());
        return ResponseEntity.ok(stats);
    }

    // ----- Add user (admin / normal user / store owner) -----
    @PostMapping("/users")
    public ResponseEntity<?> addUser(@Valid @RequestBody AddUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already registered"));
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setAddress(request.getAddress());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User created", "id", user.getId()));
    }

    // ----- List users (normal + admin + store owner) with optional filters -----
    @GetMapping("/users")
    public ResponseEntity<?> listUsers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String role,
            @RequestParam(required = false, defaultValue = "name") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortDir) {

        List<User> users = userRepository.findAll();

        users = users.stream()
                .filter(u -> name == null || u.getName().toLowerCase().contains(name.toLowerCase()))
                .filter(u -> email == null || u.getEmail().toLowerCase().contains(email.toLowerCase()))
                .filter(u -> address == null || (u.getAddress() != null && u.getAddress().toLowerCase().contains(address.toLowerCase())))
                .filter(u -> role == null || u.getRole().name().equalsIgnoreCase(role))
                .collect(Collectors.toList());

        Comparator<User> comparator = switch (sortBy) {
            case "email" -> Comparator.comparing(User::getEmail, String.CASE_INSENSITIVE_ORDER);
            case "address" -> Comparator.comparing(u -> Optional.ofNullable(u.getAddress()).orElse(""), String.CASE_INSENSITIVE_ORDER);
            case "role" -> Comparator.comparing(u -> u.getRole().name());
            default -> Comparator.comparing(User::getName, String.CASE_INSENSITIVE_ORDER);
        };
        if (sortDir.equalsIgnoreCase("desc")) comparator = comparator.reversed();
        users.sort(comparator);

        List<Map<String, Object>> result = users.stream().map(this::toUserDto).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // ----- View single user details (include rating if store owner) -----
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(toUserDto(user));
    }

    private Map<String, Object> toUserDto(User u) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", u.getId());
        dto.put("name", u.getName());
        dto.put("email", u.getEmail());
        dto.put("address", u.getAddress());
        dto.put("role", u.getRole().name());
        if (u.getRole() == Role.STORE_OWNER && u.getStoreId() != null) {
            List<Rating> ratings = ratingRepository.findByStoreId(u.getStoreId());
            double avg = ratings.stream().mapToInt(Rating::getValue).average().orElse(0.0);
            dto.put("rating", Math.round(avg * 10.0) / 10.0);
        }
        return dto;
    }

    // ----- Add store -----
    @PostMapping("/stores")
    public ResponseEntity<?> addStore(@Valid @RequestBody AddStoreRequest request) {
        Store store = new Store();
        store.setName(request.getName());
        store.setEmail(request.getEmail());
        store.setAddress(request.getAddress());
        store.setOwnerId(request.getOwnerId());
        Store savedStore = storeRepository.save(store);

        // link owner user to this store, if provided
        if (request.getOwnerId() != null) {
            userRepository.findById(request.getOwnerId()).ifPresent(owner -> {
                owner.setStoreId(savedStore.getId());
                userRepository.save(owner);
            });
        }
        return ResponseEntity.ok(Map.of("message", "Store created", "id", savedStore.getId()));
    }

    // ----- List stores with optional filters -----
    @GetMapping("/stores")
    public ResponseEntity<?> listStores(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String address,
            @RequestParam(required = false, defaultValue = "name") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortDir) {

        List<Store> stores = storeRepository.findAll();
        stores = stores.stream()
                .filter(s -> name == null || s.getName().toLowerCase().contains(name.toLowerCase()))
                .filter(s -> email == null || s.getEmail().toLowerCase().contains(email.toLowerCase()))
                .filter(s -> address == null || (s.getAddress() != null && s.getAddress().toLowerCase().contains(address.toLowerCase())))
                .collect(Collectors.toList());

        Comparator<Store> comparator = switch (sortBy) {
            case "email" -> Comparator.comparing(Store::getEmail, String.CASE_INSENSITIVE_ORDER);
            case "address" -> Comparator.comparing(s -> Optional.ofNullable(s.getAddress()).orElse(""), String.CASE_INSENSITIVE_ORDER);
            default -> Comparator.comparing(Store::getName, String.CASE_INSENSITIVE_ORDER);
        };
        if (sortDir.equalsIgnoreCase("desc")) comparator = comparator.reversed();
        stores.sort(comparator);

        List<Map<String, Object>> result = stores.stream().map(s -> {
            List<Rating> ratings = ratingRepository.findByStoreId(s.getId());
            double avg = ratings.stream().mapToInt(Rating::getValue).average().orElse(0.0);
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", s.getId());
            dto.put("name", s.getName());
            dto.put("email", s.getEmail());
            dto.put("address", s.getAddress());
            dto.put("rating", Math.round(avg * 10.0) / 10.0);
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
