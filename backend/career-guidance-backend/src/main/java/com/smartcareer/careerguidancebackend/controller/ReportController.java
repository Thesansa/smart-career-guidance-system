package com.smartcareer.careerguidancebackend.controller;

import com.smartcareer.careerguidancebackend.model.CareerRecommendation;
import com.smartcareer.careerguidancebackend.model.PerformanceSummary;
import com.smartcareer.careerguidancebackend.model.StudentProfile;
import com.smartcareer.careerguidancebackend.service.ReportService;
import com.smartcareer.careerguidancebackend.repository.StudentProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private StudentProfileRepository studentProfileRepository;


    // ===================== SYSTEM OVERVIEW - ADMIN =====================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/overview")
    public Map<String, Object> getSystemOverview() {
        return reportService.getSystemOverview();
    }


    // ===================== STUDENT PERFORMANCE SUMMARY =====================

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/student/{studentId}/performance")
    public Optional<PerformanceSummary> getStudentPerformance(@PathVariable Long studentId) {
        StudentProfile student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return reportService.getStudentPerformance(student);
    }


    // ===================== STUDENT CAREER RECOMMENDATIONS =====================

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/student/{studentId}/recommendations")
    public List<CareerRecommendation> getCareerRecommendations(@PathVariable Long studentId) {
        StudentProfile student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return reportService.getCareerRecommendations(student);
    }


    // ===================== POPULAR CAREERS (ADMIN + COUNSELOR) =====================

    @PreAuthorize("hasAnyRole('COUNSELOR', 'ADMIN')")
    @GetMapping("/popular-careers")
    public Map<String, Long> getPopularCareers() {
        return reportService.getPopularCareers();
    }


    // ===================== COUNSELOR ACTIVITY LOGS - ADMIN =====================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/counselor-activity")
    public Map<String, Long> getCounselorActivity() {
        return reportService.getCounselorActivity();
    }


    // ===================== AVERAGE GRADE (ADMIN) =====================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/average-grade")
    public Double getAverageGradeAllStudents() {
        return reportService.getAverageGradeAllStudents();
    }


    // ===================== STUDENT SKILL GROWTH (STUDENT + COUNSELOR) =====================

    @PreAuthorize("hasAnyRole('STUDENT', 'COUNSELOR')")
    @GetMapping("/student/{studentId}/skill-progress")
    public Map<String, List<Map<String, Object>>> getStudentSkillProgress(@PathVariable Long studentId) {
        return reportService.getStudentSkillProgress(studentId);
    }


    // ===================== COUNSELOR ASSIGNED STUDENTS (COUNSELOR + ADMIN) =====================

    @PreAuthorize("hasAnyRole('COUNSELOR', 'ADMIN')")
    @GetMapping("/counselor/{counselorId}/students")
    public List<Map<String, Object>> getCounselorStudentsSummary(@PathVariable Long counselorId) {
        return reportService.getAssignedStudentsSummary(counselorId);
    }

}
