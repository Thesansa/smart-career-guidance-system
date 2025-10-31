package com.smartcareer.careerguidancebackend.controller;

import com.smartcareer.careerguidancebackend.model.StudentProfile;
import com.smartcareer.careerguidancebackend.model.User;
import com.smartcareer.careerguidancebackend.service.StudentProfileService;
import com.smartcareer.careerguidancebackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/student-profiles")
@CrossOrigin(origins = "*")
public class StudentProfileController {

    @Autowired
    private StudentProfileService studentProfileService;

    @Autowired
    private UserRepository userRepository;

    // ✅ Create or update a profile (only STUDENT themselves or ADMIN)
    @PostMapping("/add")
    public ResponseEntity<?> addProfile(@RequestBody StudentProfile profile) {
        User currentUser = getCurrentUser();
        if (!canModifyProfile(currentUser, profile.getUser().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        StudentProfile savedProfile = studentProfileService.saveProfile(profile);
        return ResponseEntity.ok(savedProfile);
    }

    // ✅ Get all profiles (only ADMIN)
    @GetMapping("/all")
    public ResponseEntity<?> getAllProfiles() {
        User currentUser = getCurrentUser();
        if (currentUser == null || !isAdmin(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        List<StudentProfile> profiles = studentProfileService.getAllProfiles();
        return ResponseEntity.ok(profiles);
    }

    // ✅ Get profile by ID (ADMIN or the STUDENT themselves)
    @GetMapping("/{id}")
    public ResponseEntity<?> getProfileById(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        Optional<StudentProfile> profileOpt = studentProfileService.getProfileById(id);

        if (profileOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile not found");
        }

        StudentProfile profile = profileOpt.get();
        if (!canViewProfile(currentUser, profile.getUser().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        return ResponseEntity.ok(profile);
    }

    // ✅ Get profile by User ID (ADMIN or the STUDENT themselves)
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getProfileByUserId(@PathVariable Integer userId) {
        User currentUser = getCurrentUser();
        Optional<StudentProfile> profileOpt = studentProfileService.getProfileByUserId(userId.longValue());

        if (profileOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile not found");
        }

        if (!canViewProfile(currentUser, userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        return ResponseEntity.ok(profileOpt.get());
    }

    // ✅ Delete profile (only ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProfile(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        if (!isAdmin(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        studentProfileService.deleteProfile(id);
        return ResponseEntity.ok("Profile deleted successfully");
    }

    // 🔑 Helper: get current logged-in user from JWT
    private User getCurrentUser() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            return userRepository.findByUsername(username).orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    // 🔑 Helper: check if user is ADMIN
    private boolean isAdmin(User user) {
        return user != null && "ADMIN".equals(user.getRole().getName());
    }

    // 🔑 Helper: check if user can modify a profile (ADMIN or owner)
    private boolean canModifyProfile(User user, Integer targetUserId) {
        return user != null && (isAdmin(user) || user.getId().equals(targetUserId));
    }

    // 🔑 Helper: check if user can view a profile (same as modify logic)
    private boolean canViewProfile(User user, Integer targetUserId) {
        return canModifyProfile(user, targetUserId);
    }
}
