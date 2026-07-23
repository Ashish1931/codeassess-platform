package com.codeassess.dto.auth;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "First Name is required")
    private String firstName;

    @NotBlank(message = "Last Name is required")
    private String lastName;

    @NotBlank(message = "Email Address is required")
    @Email(message = "Please enter a valid email address")
    private String email;

    @NotBlank(message = "Mobile Number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile Number must be exactly 10 digits")
    private String mobileNumber;

    private String subjectPreference;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$",
            message = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@#$%^&+=!)")
    private String password;

    @NotBlank(message = "Confirm Password is required")
    private String confirmPassword;

    @AssertTrue(message = "You must accept the Terms and Conditions to register")
    private Boolean termsAccepted;
}
