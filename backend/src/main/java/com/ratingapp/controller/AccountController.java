package com.ratingapp.controller;

import com.ratingapp.dto.UpdatePasswordRequest;
import com.ratingapp.model.User;
import com.ratingapp.repository.UserRepository;
import com.ratingapp.service.CurrentUserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    @Autowired private UserRepository userRepository;
    @Autowired private CurrentUserService currentUserService;
    @Autowired private PasswordEncoder passwordEncoder;

    // Any logged-in user (USER, STORE_OWNER, ADMIN) can change their own password
    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@Valid @RequestBody UpdatePasswordRequest request, HttpServletRequest httpRequest) {
        User currentUser = currentUserService.getCurrentUser(httpRequest);

        if (!passwordEncoder.matches(request.getOldPassword(), currentUser.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Old password is incorrect"));
        }
        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(currentUser);
        return ResponseEntity.ok(Map.of("message", "Password updated"));
    }
}
