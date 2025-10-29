package com.smartcareer.careerguidancebackend.service;

import com.smartcareer.careerguidancebackend.model.User;
import com.smartcareer.careerguidancebackend.repository.UserRepository;
import com.smartcareer.careerguidancebackend.config.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User saveUser(User user) {
        System.out.println("=== REGISTRATION ATTEMPT ===");
        System.out.println("Username: " + user.getUsername());
        System.out.println("Email: " + user.getEmail());
        System.out.println("Password (before encryption): " + user.getPassword());
        System.out.println("Role: " + user.getRole().getName());

        // Check for duplicate username
        Optional<User> existingByUsername = userRepository.findByUsername(user.getUsername());
        if (existingByUsername.isPresent()) {
            throw new RuntimeException("Username '" + user.getUsername() + "' already exists.");
        }

        // Check for duplicate email
        Optional<User> existingByEmail = userRepository.findByEmail(user.getEmail());
        if (existingByEmail.isPresent()) {
            throw new RuntimeException("Email '" + user.getEmail() + "' already exists.");
        }

        // ✅ ENCRYPT THE PASSWORD BEFORE SAVING
        String encryptedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPassword);
        System.out.println("Password (after encryption): " + user.getPassword());

        User savedUser = userRepository.save(user);
        System.out.println("✅ User saved with ID: " + savedUser.getId());
        return savedUser;
    }

    public String loginUserAndGenerateToken(String email, String password) {
        System.out.println("=== LOGIN ATTEMPT ===");
        System.out.println("Email: " + email);

        Optional<User> existingUser = userRepository.findByEmail(email);
        System.out.println("User found: " + existingUser.isPresent());

        if (existingUser.isEmpty()) {
            System.out.println("❌ ERROR: User not found for email: " + email);
            throw new RuntimeException("Invalid email or password.");
        }

        User user = existingUser.get();
        System.out.println("Username: " + user.getUsername());
        System.out.println("Stored encrypted password: " + user.getPassword());
        System.out.println("Input password: " + password);

        // ✅ CHECK IF PASSWORD MATCHES (encrypted vs plain text)
        boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());
        System.out.println("Password matches: " + passwordMatches);

        if (!passwordMatches) {
            System.out.println("❌ ERROR: Password mismatch");
            throw new RuntimeException("Invalid email or password.");
        }

        System.out.println("✅ LOGIN SUCCESSFUL for: " + user.getUsername());
        String token = jwtService.generateToken(user);
        System.out.println("JWT Token generated: " + token);
        return token;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }
}