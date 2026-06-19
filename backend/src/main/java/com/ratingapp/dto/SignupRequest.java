package com.ratingapp.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class SignupRequest {

    @NotBlank
    @Size(min = 20, max = 60, message = "Name must be between 20 and 60 characters")
    private String name;

    @NotBlank
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank
    @Size(max = 400, message = "Address can be max 400 characters")
    private String address;

    @NotBlank
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,16}$",
        message = "Password must be 8-16 characters, include one uppercase letter and one special character"
    )
    private String password;
}
