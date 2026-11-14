package com.smartcareer.careerguidancebackend.controller;

import com.smartcareer.careerguidancebackend.dto.request.UserRegistrationRequest;
import com.smartcareer.careerguidancebackend.dto.request.UserLoginRequest;

import com.smartcareer.careerguidancebackend.dto.response.UserResponse;
import com.smartcareer.careerguidancebackend.dto.response.JwtResponse;

import com.smartcareer.careerguidancebackend.model.User;
import com.smartcareer.careerguidancebackend.service.UserService;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.HttpStatus;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;


    // =========================================================
    // USER REGISTRATION
    // =========================================================

    @PostMapping("/add")
    public ResponseEntity<UserResponse> addUser(
            @Valid @RequestBody UserRegistrationRequest userRequest) {

        // Map only the permitted registration fields.
        User user = new User();

        user.setUsername(userRequest.getUsername());
        user.setEmail(userRequest.getEmail());
        user.setPassword(userRequest.getPassword());

        // The service independently assigns the STUDENT role.
        User savedUser = userService.saveUser(user);

        // Convert the entity into a safe response DTO.
        UserResponse response = new UserResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getRole().getName()
        );

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // USER LOGIN
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> loginUser(
            @RequestBody UserLoginRequest loginRequest) {

        String token = userService.loginUserAndGenerateToken(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        return ResponseEntity.ok(new JwtResponse(token));
    }


    // =========================================================
    // EXISTING USER OPERATIONS
    // =========================================================

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable Integer id) {
        return userService.getUserById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserDetails userDetails) {

        userService.deleteUser(id, userDetails.getUsername());

        return ResponseEntity.noContent().build();
    }

}