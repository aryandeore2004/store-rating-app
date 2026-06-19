package com.ratingapp.repository;

import com.ratingapp.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByStoreId(Long storeId);
    Optional<Rating> findByUserIdAndStoreId(Long userId, Long storeId);
}
