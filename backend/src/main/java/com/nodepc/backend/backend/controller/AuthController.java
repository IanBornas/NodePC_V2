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
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> registerData) {
        Map<String, Object> response = new HashMap<>();
        try {
            String email = registerData.get("email");
            String password = registerData.get("password");
            String firstName = registerData.get("firstName");
            String lastName = registerData.get("lastName");

            if (email == null || password == null) {
                return bad(response, "Email and password are required!");
            }

            // Validate email domain
            if (!isValidEmailDomain(email)) {
                return bad(response, "Email must be from gmail.com, yahoo.com, outlook.com, or hotmail.com!");
            }

            String username = email; // Use email as username

            if (userRepository.findByUsername(username).isPresent()) {
                return bad(response, "Email already in use!");
            }

            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole("ROLE_USER");

            userRepository.save(user);
            response.put("message", "✅ User registered successfully!");
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("firstName", firstName);
            response.put("lastName", lastName);
            response.put("role", user.getRole());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return internal(response, e);
        }
    }

    // ✅ Login with email + password
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginData) {
        Map<String, Object> response = new HashMap<>();
        try {
            String email = loginData.get("email");
            String password = loginData.get("password");

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found!"));

            String token = jwtUtil.generateToken(user.getUsername());

            response.put("message", "✅ Login successful!");
            response.put("token", token);
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return unauthorized(response, "Invalid email or password");
        } catch (Exception e) {
            return internal(response, e);
        }
    }

    // ✅ Register admin
    @PostMapping("/register-admin")
    public ResponseEntity<Map<String, Object>> registerAdmin(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Validate email domain for admin registration too
            if (!isValidEmailDomain(user.getEmail())) {
                return bad(response, "Email must be from gmail.com, yahoo.com, outlook.com, or hotmail.com!");
            }

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
    private boolean isValidEmailDomain(String email) {
        if (email == null) return false;
        String lowerEmail = email.toLowerCase();
        return lowerEmail.endsWith("@gmail.com") ||
               lowerEmail.endsWith("@yahoo.com") ||
               lowerEmail.endsWith("@outlook.com") ||
               lowerEmail.endsWith("@hotmail.com");
    }

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
