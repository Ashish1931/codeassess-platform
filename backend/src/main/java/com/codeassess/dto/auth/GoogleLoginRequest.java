package com.codeassess.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GoogleLoginRequest {

    @NotBlank(message = "Google ID Token is required")
    private String idToken;

    @NotBlank(message = "Email is required")
    @Email
    private String email;

    private String firstName;
    private String lastName;
    private String profilePictureUrl;
}
