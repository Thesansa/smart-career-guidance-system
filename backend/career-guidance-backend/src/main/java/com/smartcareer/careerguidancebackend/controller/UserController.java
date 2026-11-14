
package com.smartcareer.careerguidancebackend.controller;

import com.smartcareer.careerguidancebackend.dto.request.UserLoginRequest;
import com.smartcareer.careerguidancebackend.dto.request.UserRegistrationRequest;
import com.smartcareer.careerguidancebackend.dto.response.JwtResponse;
import com.smartcareer.careerguidancebackend.dto.response.UserResponse;
import com.smartcareer.careerguidancebackend.model.User;
import com.smartcareer.careerguidancebackend.service.UserService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

        User user = new User();

        user.setUsername(userRequest.getUsername());
        user.setEmail(userRequest.getEmail());
        user.setPassword(userRequest.getPassword());

        // The service independently assigns the STUDENT role.
        User savedUser = userService.saveUser(user);

        UserResponse response = convertToUserResponse(savedUser);

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
    // GET ALL USERS - ADMIN ONLY
    // =========================================================

    @GetMapping("/all")
    public ResponseEntity<List<UserResponse>> getAllUsers() {

        List<UserResponse> users = userService.getAllUsers()
                .stream()
                .map(this::convertToUserResponse)
                .toList();

        return ResponseEntity.ok(users);
    }

    // =========================================================
    // GET USER BY ID - ADMIN OR ACCOUNT OWNER
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.getUserByIdForRequester(
                id,
                userDetails.getUsername()
        );

        return ResponseEntity.ok(convertToUserResponse(user));
    }

    // =========================================================
    // DELETE USER
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserDetails userDetails) {

        userService.deleteUser(
                id,
                userDetails.getUsername()
        );

        return ResponseEntity.noContent().build();
    }

    // =========================================================
    // ENTITY TO RESPONSE DTO MAPPING
    // =========================================================

    private UserResponse convertToUserResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().getName()
        );
    }
}
