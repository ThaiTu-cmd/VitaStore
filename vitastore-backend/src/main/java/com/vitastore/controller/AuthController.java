package com.vitastore.controller;

import com.vitastore.dto.AuthRequest;
import com.vitastore.dto.AuthResponse;
import com.vitastore.dto.RegisterRequest;
import com.vitastore.entity.User;
import com.vitastore.repository.UserRepository;
import com.vitastore.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/user/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            return ResponseEntity.badRequest()
                    .body(java.util.Map.of("message", "Email đã được sử dụng."));
        }
        User user = new User();
        user.setFullName(req.fullName());
        user.setEmail(req.email());
        user.setPassword(passwordEncoder.encode(req.password()));
        user.setRole(User.Role.USER);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(AuthResponse.from(token, user));
    }

    @PostMapping("/user/login")
    public ResponseEntity<?> loginUser(@RequestBody AuthRequest req) {
        return userRepository.findByEmail(req.email())
                .filter(u -> passwordEncoder.matches(req.password(), u.getPassword()))
                .map(u -> {
                    String token = jwtUtil.generateToken(u.getEmail(), u.getRole().name());
                    return ResponseEntity.ok(AuthResponse.from(token, u));
                })
                .orElse(ResponseEntity.status(401)
                        .body(null));
    }

    @PostMapping("/admin/login")
    public ResponseEntity<?> loginAdmin(@RequestBody AuthRequest req) {
        return userRepository.findByEmail(req.email())
                .filter(u -> u.getRole() == User.Role.ADMIN
                        && passwordEncoder.matches(req.password(), u.getPassword()))
                .map(u -> {
                    String token = jwtUtil.generateToken(u.getEmail(), u.getRole().name());
                    return ResponseEntity.ok(AuthResponse.from(token, u));
                })
                .orElse(ResponseEntity.status(401)
                        .body(null));
    }
}
