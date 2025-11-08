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

import java.util.List;

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

        List<CareerRecommendation> recommendations =
                careerRecommendationService.generateRecommendations(studentProfile.getId());

        return ResponseEntity.ok(recommendations);
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
}
