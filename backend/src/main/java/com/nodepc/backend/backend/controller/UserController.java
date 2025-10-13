package com.nodepc.backend.backend.controller;

import com.nodepc.backend.backend.model.User;
import com.nodepc.backend.backend.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;
    public UserController(UserService userService) { this.userService = userService; }

    @GetMapping
    public ResponseEntity<List<User>> getAll() { return ResponseEntity.ok(userService.getAllUsers()); }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        return userService.getUserById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> create(@RequestBody User user) {
        // Input validation
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Sanitize input
        user.setUsername(user.getUsername().trim());
        user.setEmail(user.getEmail().trim());
        user.setPassword(user.getPassword().trim());
        if (user.getFirstName() != null) {
            user.setFirstName(user.getFirstName().trim());
        }
        if (user.getLastName() != null) {
            user.setLastName(user.getLastName().trim());
        }

        logger.info("[NodePC] Creating user: {}", user.getUsername());
        return ResponseEntity.status(201).body(userService.createUser(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User user) {
        // Input validation
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Sanitize input
        user.setUsername(user.getUsername().trim());
        user.setEmail(user.getEmail().trim());
        if (user.getFirstName() != null) {
            user.setFirstName(user.getFirstName().trim());
        }
        if (user.getLastName() != null) {
            user.setLastName(user.getLastName().trim());
        }

        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.deleteUser(id); return ResponseEntity.noContent().build();
    }
}
