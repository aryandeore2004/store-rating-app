package com.ratingapp.config;

import com.ratingapp.model.Role;
import com.ratingapp.model.User;
import com.ratingapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String adminEmail = "admin@ratingapp.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setName("Default System Administrator User"); // 20-60 chars
            admin.setEmail(adminEmail);
            admin.setAddress("Head Office");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Seeded default admin -> email: " + adminEmail + " password: Admin@123");
        }
    }
}
