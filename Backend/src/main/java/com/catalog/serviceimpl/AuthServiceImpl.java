package com.catalog.serviceimpl;

import com.catalog.dto.*;
import com.catalog.entity.LoginHistory;
import com.catalog.entity.User;
import com.catalog.repository.LoginHistoryRepository;
import com.catalog.repository.UserRepository;
import com.catalog.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final LoginHistoryRepository loginHistoryRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserRepository userRepository,
                           LoginHistoryRepository loginHistoryRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.loginHistoryRepository = loginHistoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ================= LOGIN =================
    @Override
    public LoginResponse login(LoginRequest request) {

        if (request == null ||
                request.getEmail() == null ||
                request.getPassword() == null) {
            throw new RuntimeException("Email and password are required");
        }

        if (!request.getEmail().endsWith("@mymail.mapua.edu.ph")) {
            throw new RuntimeException("Only Mapúa emails are allowed");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new RuntimeException("Account is disabled");
        }

        // BCrypt comparison (works for both hashed and plain text during migration)
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Save login history
        LoginHistory history = new LoginHistory();
        history.setUser(user);
        loginHistoryRepository.save(history);

        return new LoginResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                "Login successful"
        );
    }

    // ================= REGISTER =================
    @Override
    public void register(RegisterRequest request) {

        if (request == null ||
                request.getEmail() == null ||
                request.getPassword() == null ||
                request.getName() == null) {
            throw new RuntimeException("All fields are required");
        }

        if (!request.getEmail().endsWith("@mymail.mapua.edu.ph")) {
            throw new RuntimeException("Only Mapúa emails are allowed");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        validatePassword(request.getPassword());

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // BCrypt hash
        user.setIsActive(true);

        if (request.getRole() == null) {
            user.setRole(com.catalog.enums.Role.STUDENT_ASSISTANT);
        } else {
            user.setRole(request.getRole());
        }

        userRepository.save(user);
    }

    // ================= RESET PASSWORD =================
    @Override
    public void resetPassword(ResetPasswordRequest request) {

        if (request == null ||
                request.getEmail() == null ||
                request.getNewPassword() == null) {
            throw new RuntimeException("Email and new password are required");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Email not found"));

        validatePassword(request.getNewPassword());

        user.setPassword(passwordEncoder.encode(request.getNewPassword())); // BCrypt hash
        userRepository.save(user);
    }

    // ================= PASSWORD VALIDATION =================
    private void validatePassword(String password) {

        if (password.length() < 12) {
            throw new RuntimeException("Password must be at least 12 characters long");
        }

        if (!password.matches(".*[A-Z].*")) {
            throw new RuntimeException("Password must contain at least one uppercase letter");
        }

        if (!password.matches(".*[a-z].*")) {
            throw new RuntimeException("Password must contain at least one lowercase letter");
        }

        if (!password.matches(".*[0-9].*")) {
            throw new RuntimeException("Password must contain at least one number");
        }

        if (!password.matches(".*[!@#$%^&*()_+\\-={}\\[\\]|:;\"'<>,.?/].*")) {
            throw new RuntimeException("Password must contain at least one special character");
        }
    }
}