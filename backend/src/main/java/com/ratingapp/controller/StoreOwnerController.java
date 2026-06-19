package com.ratingapp.controller;

import com.ratingapp.model.Rating;
import com.ratingapp.model.User;
import com.ratingapp.repository.RatingRepository;
import com.ratingapp.repository.UserRepository;
import com.ratingapp.service.CurrentUserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/store-owner")
public class StoreOwnerController {

    @Autowired private RatingRepository ratingRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CurrentUserService currentUserService;

    // Dashboard: list of users who rated their store + average rating
    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard(HttpServletRequest request) {
        User owner = currentUserService.getCurrentUser(request);

        if (owner.getStoreId() == null) {
            return ResponseEntity.ok(Map.of(
                    "message", "No store linked to this account yet",
                    "averageRating", 0.0,
                    "raters", List.of()
            ));
        }

        List<Rating> ratings = ratingRepository.findByStoreId(owner.getStoreId());
        double avg = ratings.stream().mapToInt(Rating::getValue).average().orElse(0.0);

        List<Map<String, Object>> raters = ratings.stream().map(r -> {
            User u = userRepository.findById(r.getUserId()).orElse(null);
            Map<String, Object> dto = new HashMap<>();
            dto.put("name", u != null ? u.getName() : "Unknown");
            dto.put("email", u != null ? u.getEmail() : "Unknown");
            dto.put("rating", r.getValue());
            return dto;
        }).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("averageRating", Math.round(avg * 10.0) / 10.0);
        response.put("raters", raters);
        return ResponseEntity.ok(response);
    }
}
