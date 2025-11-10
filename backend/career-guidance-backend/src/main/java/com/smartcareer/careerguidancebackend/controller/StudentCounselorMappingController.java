package com.smartcareer.careerguidancebackend.controller;

import com.smartcareer.careerguidancebackend.model.StudentCounselorMapping;
import com.smartcareer.careerguidancebackend.model.User;
import com.smartcareer.careerguidancebackend.repository.CounselorProfileRepository;
import com.smartcareer.careerguidancebackend.repository.UserRepository;
import com.smartcareer.careerguidancebackend.service.StudentCounselorMappingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.smartcareer.careerguidancebackend.model.CounselorProfile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.List;

@RestController
@RequestMapping("/api/mappings")
@CrossOrigin(origins = "*")
public class StudentCounselorMappingController {

    @Autowired
    private StudentCounselorMappingService mappingService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CounselorProfileRepository counselorProfileRepository;

    // 🔑 Get the currently logged-in user
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

    private boolean isCounselor(User user) {
        return user != null && "COUNSELOR".equalsIgnoreCase(user.getRole().getName());
    }

    // 🟢 Assign student → counselor (Admin only)
    @PostMapping("/assign/{studentId}/{counselorProfileId}")
    public ResponseEntity<?> assignStudent(@PathVariable Long studentId, @PathVariable Long counselorProfileId) {
        User currentUser = getCurrentUser();
        if (!isAdmin(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied. Only Admins can assign students.");
        }

        StudentCounselorMapping mapping = mappingService.assignStudentToCounselor(
                studentId,
                counselorProfileId,
                currentUser.getUsername()
        );

        return ResponseEntity.ok(mapping);
    }

    // 🟢 Counselor gives feedback
    @PostMapping("/feedback/{studentId}")
    public ResponseEntity<?> addFeedback(@PathVariable Long studentId, @RequestBody FeedbackRequest request) {
        User currentUser = getCurrentUser();
        if (!isCounselor(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied. Only Counselors can add feedback.");
        }

        var counselorProfile = counselorProfileRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Counselor profile not found for this user."));

        StudentCounselorMapping updated = mappingService.addOrUpdateFeedback(
                studentId,
                counselorProfile.getId(),
                request.getFeedback(),
                currentUser.getUsername()
        );

        return ResponseEntity.ok(updated);
    }

    // 🟢 Counselor views assigned students
    @GetMapping("/my-students")
    public ResponseEntity<?> getMyStudents() {
        User currentUser = getCurrentUser();
        if (!isCounselor(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied.");
        }

        var counselorProfile = counselorProfileRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Counselor profile not found."));

        List<StudentCounselorMapping> students = mappingService.getStudentsByCounselor(counselorProfile.getId());
        return ResponseEntity.ok(students);
    }

    // 🟢 Admin sees all mappings
    @GetMapping("/all")
    public ResponseEntity<?> getAllMappings() {
        User currentUser = getCurrentUser();
        if (!isAdmin(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied.");
        }

        return ResponseEntity.ok(mappingService.getAllMappings());
    }

    // 🟢 Admin removes mapping
    @DeleteMapping("/remove/{mappingId}")
    public ResponseEntity<?> removeMapping(@PathVariable Long mappingId) {
        User currentUser = getCurrentUser();
        if (!isAdmin(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied.");
        }

        mappingService.removeMapping(mappingId, currentUser.getUsername());
        return ResponseEntity.ok("Mapping removed successfully.");
    }

    // 🟢 Student views who their assigned counselor is
    @GetMapping("/my-counselor")
    public ResponseEntity<?> getMyCounselor() {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        var mappingOpt = mappingService.getMappingByStudentUserId(currentUser.getId());
        if (mappingOpt.isEmpty()) {
            return ResponseEntity.ok().body(null);
        }

        StudentCounselorMapping mapping = mappingOpt.get();
        CounselorProfile counselor = mapping.getCounselor();

        // ✅ Return counselor + feedback + lastUpdated
        return ResponseEntity.ok(new Object() {
            public final String fullName = counselor.getFullName();
            public final String department = counselor.getDepartment();
            public final Integer experienceYears = counselor.getExperienceYears();
            public final String contactNumber = counselor.getContactNumber();
            public final String feedback = mapping.getFeedback();
            public final String lastUpdated = mapping.getLastUpdated() != null ? mapping.getLastUpdated().toString() : null;
        });
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportMappingsPDF() {
        User currentUser = getCurrentUser();
        if (!isAdmin(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        byte[] pdfBytes = mappingService.generateMappingPDF();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "student_counselor_mappings.pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    // DTO
    public static class FeedbackRequest {
        private String feedback;
        public String getFeedback() { return feedback; }
        public void setFeedback(String feedback) { this.feedback = feedback; }
    }
}
