package com.ratingapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdatePasswordRequest {

    @NotBlank
    private String oldPassword;

    @NotBlank
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,16}$",
        message = "Password must be 8-16 characters, include one uppercase letter and one special character"
    )
    private String newPassword;
}
