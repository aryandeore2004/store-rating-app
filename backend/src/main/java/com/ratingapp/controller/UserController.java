package com.ratingapp.controller;

import com.ratingapp.dto.RatingRequest;
import com.ratingapp.model.Rating;
import com.ratingapp.model.User;
import com.ratingapp.repository.RatingRepository;
import com.ratingapp.service.CurrentUserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired private RatingRepository ratingRepository;
    @Autowired private CurrentUserService currentUserService;

    // Submit or update a rating for a store
    @PostMapping("/ratings")
    public ResponseEntity<?> submitRating(@Valid @RequestBody RatingRequest request, HttpServletRequest httpRequest) {
        User currentUser = currentUserService.getCurrentUser(httpRequest);

        Rating rating = ratingRepository.findByUserIdAndStoreId(currentUser.getId(), request.getStoreId())
                .orElse(new Rating(null, currentUser.getId(), request.getStoreId(), request.getValue()));

        rating.setValue(request.getValue());
        rating.setUserId(currentUser.getId());
        rating.setStoreId(request.getStoreId());
        ratingRepository.save(rating);

        return ResponseEntity.ok(Map.of("message", "Rating saved"));
    }
}
