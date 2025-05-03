package com.xenon.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.xenon.jobfind.UserRepository;
import com.xenon.model.User;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Signup Endpoint
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User user) {
        System.out.println("Attempting signup for: " + user.getEmail());

        try {
            Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
            if (existingUser.isPresent()) {
                System.out.println("Email already exists: " + user.getEmail());
                return ResponseEntity.badRequest().body("Email already registered.");
            }

            System.out.println("Creating new user: " + user.getEmail());
            userRepository.save(user);
            return ResponseEntity.ok("User registered successfully.");
        } catch (Exception e) {
            System.err.println("Error during signup: " + e.getMessage());
            return ResponseEntity.status(500).body("Error during signup: " + e.getMessage());
        }
    }

    // Login Endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(loginUser.getEmail());

            if (userOpt.isEmpty()) {
                System.out.println("User not found: " + loginUser.getEmail());
                return ResponseEntity.status(401).body("Invalid credentials. Email does not exist.");
            }

            User user = userOpt.get();
            if (!user.getPassword().equals(loginUser.getPassword())) {
                System.out.println("Incorrect password for user: " + loginUser.getEmail());
                return ResponseEntity.status(401).body("Invalid credentials. Incorrect password.");
            }

            System.out.println("User authenticated: " + user.getEmail());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            System.err.println("Error during login: " + e.getMessage());
            return ResponseEntity.status(500).body("Error during login: " + e.getMessage());
        }
    }
}
