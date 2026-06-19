package com.ratingapp.dto;

import com.ratingapp.model.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AddUserRequest {

    @NotBlank
    @Size(min = 20, max = 60, message = "Name must be between 20 and 60 characters")
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(max = 400)
    private String address;

    @NotBlank
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,16}$",
        message = "Password must be 8-16 characters, include one uppercase letter and one special character"
    )
    private String password;

    @NotNull
    private Role role; // ADMIN, USER, or STORE_OWNER
}
