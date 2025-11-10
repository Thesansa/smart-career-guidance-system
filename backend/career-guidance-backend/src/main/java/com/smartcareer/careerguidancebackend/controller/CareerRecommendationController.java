package com.smartcareer.careerguidancebackend.controller;

import com.smartcareer.careerguidancebackend.model.CareerRecommendation;
import com.smartcareer.careerguidancebackend.model.User;
import com.smartcareer.careerguidancebackend.service.CareerRecommendationService;
import com.smartcareer.careerguidancebackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.smartcareer.careerguidancebackend.model.StudentProfile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*")
public class CareerRecommendationController {

    @Autowired
    private CareerRecommendationService careerRecommendationService;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            return userRepository.findByUsername(username).orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateRecommendation() {
        User currentUser = getCurrentUser();
        if (currentUser == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");

        if (!currentUser.getRole().getName().equals("STUDENT"))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only students can generate recommendations");

        var studentProfile = currentUser.getStudentProfile();
        if (studentProfile == null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Student profile not found");

        try {
            List<CareerRecommendation> recommendations =
                    careerRecommendationService.generateRecommendations(studentProfile.getId());

            if (recommendations.isEmpty()) {
                return ResponseEntity.ok("No career recommendations found. Please add more skills to get better matches.");
            }

            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating recommendations: " + e.getMessage());
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyRecommendations() {
        User currentUser = getCurrentUser();
        if (currentUser == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");

        if (!currentUser.getRole().getName().equals("STUDENT"))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");

        var studentProfile = currentUser.getStudentProfile();
        if (studentProfile == null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Student profile not found");

        List<CareerRecommendation> recs =
                careerRecommendationService.getRecommendationsByStudent(studentProfile.getId());

        return ResponseEntity.ok(recs);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getRecommendationsByStudentId(@PathVariable Long studentId) {
        User currentUser = getCurrentUser();
        if (currentUser == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");

        String role = currentUser.getRole().getName();
        if (!(role.equals("ADMIN") || role.equals("COUNSELOR")))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");

        List<CareerRecommendation> recs =
                careerRecommendationService.getRecommendationsByStudent(studentId);

        return ResponseEntity.ok(recs);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllRecommendations() {
        User currentUser = getCurrentUser();
        if (currentUser == null || !currentUser.getRole().getName().equals("ADMIN"))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");

        List<CareerRecommendation> recs = careerRecommendationService.getAllRecommendations();
        return ResponseEntity.ok(recs);
    }

    /**
     * New endpoint: Get detailed breakdown of recommendations (for analytics)
     */
    @GetMapping("/breakdown")
    public ResponseEntity<?> getRecommendationBreakdown() {
        User currentUser = getCurrentUser();
        if (currentUser == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");

        if (!currentUser.getRole().getName().equals("STUDENT"))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");

        var studentProfile = currentUser.getStudentProfile();
        if (studentProfile == null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Student profile not found");

        try {
            Map<String, Object> breakdown =
                    careerRecommendationService.getRecommendationBreakdown(studentProfile.getId());
            return ResponseEntity.ok(breakdown);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error getting recommendation breakdown: " + e.getMessage());
        }
    }
}