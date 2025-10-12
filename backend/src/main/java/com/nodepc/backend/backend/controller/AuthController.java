package com.nodepc.backend.backend.controller;

import com.nodepc.backend.backend.model.User;
import com.nodepc.backend.backend.repository.UserRepository;
import com.nodepc.backend.backend.security.jwt.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private AuthenticationManager authenticationManager;

    // ✅ Register new user
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (userRepository.findByUsername(user.getUsername()).isPresent()) {
                return bad(response, "Username already taken!");
            }
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                return bad(response, "Email already in use!");
            }

            user.setPassword(passwordEncoder.encode(user.getPassword()));
            if (user.getRole() == null || user.getRole().isEmpty()) {
                user.setRole("ROLE_USER");
            }

            userRepository.save(user);
            response.put("message", "✅ User registered successfully!");
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return internal(response, e);
        }
    }

    // ✅ Login with username + email + password
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginData) {
        Map<String, Object> response = new HashMap<>();
        try {
            String username = loginData.get("username");
            String email = loginData.get("email");
            String password = loginData.get("password");

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found!"));

            if (!user.getEmail().equals(email)) {
                return unauthorized(response, "Email does not match for this username!");
            }

            String token = jwtUtil.generateToken(username);

            response.put("message", "✅ Login successful!");
            response.put("token", token);
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return unauthorized(response, "Invalid username or password");
        } catch (Exception e) {
            return internal(response, e);
        }
    }

    // ✅ Register admin
    @PostMapping("/register-admin")
    public ResponseEntity<Map<String, Object>> registerAdmin(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (userRepository.findByUsername(user.getUsername()).isPresent()) {
                return bad(response, "Username already taken!");
            }
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                return bad(response, "Email already in use!");
            }

            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setRole("ROLE_ADMIN");
            userRepository.save(user);

            response.put("message", "✅ Admin registered successfully!");
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return internal(response, e);
        }
    }

    // Helpers
    private ResponseEntity<Map<String, Object>> bad(Map<String, Object> r, String m) {
        r.put("error", m);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(r);
    }

    private ResponseEntity<Map<String, Object>> unauthorized(Map<String, Object> r, String m) {
        r.put("error", m);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(r);
    }

    private ResponseEntity<Map<String, Object>> internal(Map<String, Object> r, Exception e) {
        r.put("error", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(r);
    }
}
