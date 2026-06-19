package com.ratingapp.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AddStoreRequest {

    @NotBlank
    @Size(max = 60)
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(max = 400)
    private String address;

    // optional: link an existing STORE_OWNER user to this store
    private Long ownerId;
}
