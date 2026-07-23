package com.codeassess.service;

import com.codeassess.dto.auth.*;

public interface AuthService {
    JwtResponse login(LoginRequest loginRequest);
    String register(RegisterRequest registerRequest);
    String forgotPassword(ForgotPasswordRequest request);
    String resetPassword(ResetPasswordRequest request);
    JwtResponse googleLogin(GoogleLoginRequest request);
}
