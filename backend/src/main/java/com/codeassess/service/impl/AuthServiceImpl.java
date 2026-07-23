package com.codeassess.service.impl;

import com.codeassess.config.security.JwtTokenProvider;
import com.codeassess.config.security.UserPrincipal;
import com.codeassess.dto.auth.*;
import com.codeassess.entity.Role;
import com.codeassess.entity.User;
import com.codeassess.enums.RoleName;
import com.codeassess.exception.BadRequestException;
import com.codeassess.exception.ResourceNotFoundException;
import com.codeassess.repository.RoleRepository;
import com.codeassess.repository.UserRepository;
import com.codeassess.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Override
    public JwtResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email address or password"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email address or password");
        }

        UserPrincipal userDetails = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.generateToken(authentication);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        return JwtResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .profilePictureUrl(user.getProfilePictureUrl())
                .roles(roles)
                .build();
    }

    @Override
    @Transactional
    public String register(RegisterRequest registerRequest) {
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new BadRequestException("Password and Confirm Password do not match");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email Address is already in use");
        }

        if (userRepository.existsByMobileNumber(registerRequest.getMobileNumber())) {
            throw new BadRequestException("Mobile Number is already registered");
        }

        Role studentRole = roleRepository.findByName(RoleName.ROLE_STUDENT)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", RoleName.ROLE_STUDENT));

        HashSet<Role> roles = new HashSet<>();
        roles.add(studentRole);

        User user = User.builder()
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .email(registerRequest.getEmail())
                .mobileNumber(registerRequest.getMobileNumber())
                .subjectPreference(registerRequest.getSubjectPreference())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .roles(roles)
                .isOAuth2User(false)
                .build();

        userRepository.save(user);
        return "User registered successfully!";
    }

    @Override
    @Transactional
    public String forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        String token = UUID.randomUUID().toString();
        user.setResetPasswordToken(token);
        user.setResetPasswordTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        // Simulated email sending with token returned
        return "Password reset token generated: " + token + " (Valid for 1 hour)";
    }

    @Override
    @Transactional
    public String resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new BadRequestException("New Password and Confirm Password do not match");
        }

        User user = userRepository.findByResetPasswordToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid or expired password reset token"));

        if (user.getResetPasswordTokenExpiry() == null || user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Password reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepository.save(user);

        return "Password reset successful! You can now log in with your new password.";
    }

    @Override
    @Transactional
    public JwtResponse googleLogin(GoogleLoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseGet(() -> {
            Role studentRole = roleRepository.findByName(RoleName.ROLE_STUDENT).orElseThrow();
            HashSet<Role> roles = new HashSet<>();
            roles.add(studentRole);

            return userRepository.save(User.builder()
                    .firstName(request.getFirstName() != null ? request.getFirstName() : "Google")
                    .lastName(request.getLastName() != null ? request.getLastName() : "User")
                    .email(request.getEmail())
                    .mobileNumber("0000000000")
                    .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .roles(roles)
                    .isOAuth2User(true)
                    .profilePictureUrl(request.getProfilePictureUrl())
                    .build());
        });

        UserPrincipal principal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.generateToken(authentication);

        return JwtResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .profilePictureUrl(user.getProfilePictureUrl())
                .roles(List.of("ROLE_STUDENT"))
                .build();
    }
}
