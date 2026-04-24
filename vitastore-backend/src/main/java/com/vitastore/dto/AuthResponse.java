package com.vitastore.dto;

import com.vitastore.entity.User;

public record AuthResponse(String token, UserDto user) {
    public record UserDto(Long id, String fullName, String email, String role) {
    }

    public static AuthResponse from(String token, User user) {
        return new AuthResponse(
                token,
                new UserDto(user.getId(), user.getFullName(), user.getEmail(), user.getRole().name()));
    }
}
