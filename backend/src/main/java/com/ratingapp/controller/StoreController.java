package com.ratingapp.controller;

import com.ratingapp.model.Rating;
import com.ratingapp.model.Store;
import com.ratingapp.repository.RatingRepository;
import com.ratingapp.repository.StoreRepository;
import com.ratingapp.service.CurrentUserService;
import com.ratingapp.model.User;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stores")
public class StoreController {

    @Autowired private StoreRepository storeRepository;
    @Autowired private RatingRepository ratingRepository;
    @Autowired private CurrentUserService currentUserService;

    // Normal users: list/search stores by name & address, with their own submitted rating
    @GetMapping
    public ResponseEntity<?> listStores(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String address,
            @RequestParam(required = false, defaultValue = "name") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortDir,
            HttpServletRequest request) {

        User currentUser = currentUserService.getCurrentUser(request);

        List<Store> stores = storeRepository.findAll();
        stores = stores.stream()
                .filter(s -> name == null || s.getName().toLowerCase().contains(name.toLowerCase()))
                .filter(s -> address == null || (s.getAddress() != null && s.getAddress().toLowerCase().contains(address.toLowerCase())))
                .collect(Collectors.toList());

        Comparator<Store> comparator = "address".equals(sortBy)
                ? Comparator.comparing(s -> Optional.ofNullable(s.getAddress()).orElse(""), String.CASE_INSENSITIVE_ORDER)
                : Comparator.comparing(Store::getName, String.CASE_INSENSITIVE_ORDER);
        if (sortDir.equalsIgnoreCase("desc")) comparator = comparator.reversed();
        stores.sort(comparator);

        List<Map<String, Object>> result = stores.stream().map(s -> {
            List<Rating> ratings = ratingRepository.findByStoreId(s.getId());
            double avg = ratings.stream().mapToInt(Rating::getValue).average().orElse(0.0);
            Integer myRating = ratingRepository.findByUserIdAndStoreId(currentUser.getId(), s.getId())
                    .map(Rating::getValue).orElse(null);

            Map<String, Object> dto = new HashMap<>();
            dto.put("id", s.getId());
            dto.put("name", s.getName());
            dto.put("address", s.getAddress());
            dto.put("overallRating", Math.round(avg * 10.0) / 10.0);
            dto.put("myRating", myRating);
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
