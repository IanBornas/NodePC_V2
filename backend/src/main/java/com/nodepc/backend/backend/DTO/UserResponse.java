package com.nodepc.backend.backend.DTO;

public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String role;

    public UserResponse() {}
    public UserResponse(Long id, String username, String email, String role) {
        this.id = id; this.username = username; this.email = email; this.role = role;
    }
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getRole() { return role; }

    public void setId(Long id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(String role) { this.role = role; }
}
