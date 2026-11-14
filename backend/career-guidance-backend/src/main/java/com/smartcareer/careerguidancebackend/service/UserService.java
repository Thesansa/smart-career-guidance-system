package com.smartcareer.careerguidancebackend.service;

import com.smartcareer.careerguidancebackend.model.User;
import com.smartcareer.careerguidancebackend.model.Role;

import com.smartcareer.careerguidancebackend.repository.UserRepository;
import com.smartcareer.careerguidancebackend.repository.RoleRepository;

import com.smartcareer.careerguidancebackend.config.JwtService;

import com.smartcareer.careerguidancebackend.exceptions.*;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private static final Logger logger =
            LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;


    // =========================================================
    // USER REGISTRATION
    // =========================================================

    public User saveUser(User user) {

        logger.info("Registration attempt for username: {}",
                user.getUsername());

        // 1. Validate required registration fields.
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            throw new IllegalArgumentException("Username is required.");
        }

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required.");
        }

        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required.");
        }


        // 2. Check whether the username already exists.
        Optional<User> existingByUsername =
                userRepository.findByUsername(user.getUsername());

        if (existingByUsername.isPresent()) {
            throw new DuplicateResourceException(
                    "Username already exists."
            );
        }


        // 3. Check whether the email already exists.
        Optional<User> existingByEmail =
                userRepository.findByEmail(user.getEmail());

        if (existingByEmail.isPresent()) {
            throw new DuplicateResourceException(
                    "Email already exists."
            );
        }


        // 4. Retrieve the STUDENT role directly from the database.
        // Never trust role information supplied by the client.
        Role studentRole = roleRepository.findByName("STUDENT")
                .orElseThrow(() ->
                        new RoleNotFoundException(
                                "Required STUDENT role is not configured."
                        )
                );


        // 5. Assign the trusted database role to the user.
        user.setRole(studentRole);


        // 6. Hash the password before storing it.
        // Never store or log the original plaintext password.
        String encodedPassword =
                passwordEncoder.encode(user.getPassword());

        user.setPassword(encodedPassword);


        // 7. Persist the user.
        User savedUser = userRepository.save(user);

        logger.info("User registration successful. User ID: {}",
                savedUser.getId());

        return savedUser;
    }


    // =========================================================
    // USER LOGIN
    // =========================================================

    public String loginUserAndGenerateToken(String email, String password) {

        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isEmpty()) {
            throw new RuntimeException("Invalid email or password.");
        }

        User user = existingUser.get();

        // Compare the supplied password against the stored BCrypt hash.
        boolean passwordMatches =
                passwordEncoder.matches(password, user.getPassword());

        if (!passwordMatches) {
            throw new RuntimeException("Invalid email or password.");
        }

        // Generate JWT after successful authentication.
        String token = jwtService.generateToken(user);

        // Do not log passwords, password hashes or JWT tokens.
        logger.info("Login successful for user: {}", user.getUsername());

        return token;
    }


    // =========================================================
    // EXISTING USER OPERATIONS
    // =========================================================

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    public void deleteUser(Integer targetUserId, String requesterUsername) {

        // 1. Find the authenticated requester in the database.
        User requester = userRepository.findByUsername(requesterUsername)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Requesting user not found."
                        )
                );

        // 2. Find the account that is going to be deleted.
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."
                        )
                );

        // 3. Get the requester's actual role from the database.
        String requesterRole = requester.getRole().getName();

        // 4. ADMIN can delete any user, including another ADMIN.
        if ("ADMIN".equalsIgnoreCase(requesterRole)) {
            userRepository.delete(targetUser);
            return;
        }

        // 5. STUDENT can only delete their own STUDENT account.
        if ("STUDENT".equalsIgnoreCase(requesterRole)) {

            boolean deletingOwnAccount =
                    requester.getId().equals(targetUser.getId());

            boolean targetIsStudent =
                    targetUser.getRole() != null
                            && "STUDENT".equalsIgnoreCase(
                            targetUser.getRole().getName()
                    );

            if (deletingOwnAccount && targetIsStudent) {
                userRepository.delete(targetUser);
                return;
            }
        }

        // 6. COUNSELOR and all other unauthorized cases are rejected.
        throw new ForbiddenOperationException(
                "You are not authorized to delete this user."
        );
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found: " + username));
    }


    public User getUserByIdForRequester(
            Integer targetUserId,
            String requesterUsername) {

        // 1. Find the authenticated requester.
        User requester = userRepository.findByUsername(requesterUsername)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Requesting user not found."
                        )
                );

        // 2. Determine the requester's current role from the database.
        String requesterRole = requester.getRole().getName();

        // 3. ADMIN can view any user's details.
        boolean isAdmin =
                "ADMIN".equalsIgnoreCase(requesterRole);

        // 4. Non-admin users can only view their own account.
        boolean requestingOwnAccount =
                requester.getId().equals(targetUserId);

        if (!isAdmin && !requestingOwnAccount) {
            throw new ForbiddenOperationException(
                    "You are not authorized to view this user's details."
            );
        }

        // 5. Retrieve the requested account.
        return userRepository.findById(targetUserId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."
                        )
                );
    }


}