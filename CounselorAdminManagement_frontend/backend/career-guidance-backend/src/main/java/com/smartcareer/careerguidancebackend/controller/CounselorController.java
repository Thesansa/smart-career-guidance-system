package com.smartcareer.careerguidancebackend.controller;

import com.smartcareer.careerguidancebackend.model.CounselorProfile;
import com.smartcareer.careerguidancebackend.model.User;
import com.smartcareer.careerguidancebackend.service.CounselorService;
import com.smartcareer.careerguidancebackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/counselors")
@CrossOrigin(origins = "*")
public class CounselorController {

    @Autowired
    private CounselorService counselorService;

    @Autowired
    private UserRepository userRepository;

    // 🔑 Get currently logged-in user
    private User getCurrentUser() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            return userRepository.findByUsername(username).orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    private boolean isAdmin(User user) {
        return user != null && "ADMIN".equalsIgnoreCase(user.getRole().getName());
    }

    // 🟢 Create a new counselor profile (Admin only)
    @PostMapping("/add")
    public ResponseEntity<?> createCounselor(@RequestBody CounselorProfile profile) {
        User currentUser = getCurrentUser();
        if (!isAdmin(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins can create counselors.");
        }

        CounselorProfile saved = counselorService.createCounselorProfile(profile, currentUser.getUsername());
        return ResponseEntity.ok(saved);
    }

    // 🟢 Update existing counselor profile (Admin only)
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCounselor(@PathVariable Long id, @RequestBody CounselorProfile profile) {
        User currentUser = getCurrentUser();
        if (!isAdmin(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins can update counselors.");
        }

        CounselorProfile updated = counselorService.updateCounselorProfile(id, profile, currentUser.getUsername());
        return ResponseEntity.ok(updated);
    }

    // 🟢 Get all counselor profiles (Admin only)
    @GetMapping("/all")
    public ResponseEntity<?> getAllCounselors() {
        User currentUser = getCurrentUser();
        if (!isAdmin(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        List<CounselorProfile> counselors = counselorService.getAllCounselorProfiles();
        return ResponseEntity.ok(counselors);
    }

    // 🟢 Get a single counselor profile (Admin or the counselor themselves)
    @GetMapping("/{id}")
    public ResponseEntity<?> getCounselorById(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        Optional<CounselorProfile> counselorOpt = counselorService.getCounselorProfileById(id);

        if (counselorOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Counselor not found.");
        }

        CounselorProfile counselor = counselorOpt.get();
        if (!isAdmin(currentUser) && !counselor.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied.");
        }

        return ResponseEntity.ok(counselor);
    }

    // 🟢 Delete counselor (Admin only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCounselor(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        if (!isAdmin(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins can delete counselors.");
        }

        counselorService.deleteCounselorProfile(id, currentUser.getUsername());
        return ResponseEntity.ok("Counselor deleted successfully.");
    }
}
