package com.smartcareer.careerguidancebackend.controller;

import com.smartcareer.careerguidancebackend.model.*;
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
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private StudentProfileRepository studentProfileRepository;


    // System Overview - Admin Dashboard

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/overview")
    public Map<String, Object> getSystemOverview() {
        return reportService.getSystemOverview();
    }


    // Student Performance Summary - Student dashboard

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/student/{studentId}/performance")
    public Optional<PerformanceSummary> getStudentPerformance(@PathVariable Integer studentId) {
        StudentProfile student = (StudentProfile) studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return reportService.getStudentPerformance(student);
    }


    // Student Career Recommendations - Student Dashboard

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/student/{studentId}/recommendations")
    public List<CareerRecommendation> getCareerRecommendations(@PathVariable Integer studentId) {
        StudentProfile student = studentProfileRepository.findById(Long.valueOf(studentId))
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return reportService.getCareerRecommendations(student);
    }


    // Counselor/Admin: View Popular Careers

    @PreAuthorize("hasAnyRole('COUNSELOR', 'ADMIN')")
    @GetMapping("/popular-careers")
    public Map<String, Long> getPopularCareers() {
        return reportService.getPopularCareers();
    }


    // Counselor Activity Logs - Admin

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/counselor-activity")
    public Map<String, Long> getCounselorActivity() {
        return reportService.getCounselorActivity();
    }


    // Average Grade (All Students) - Admin Analytics

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/average-grade")
    public Double getAverageGradeAllStudents() {
        return reportService.getAverageGradeAllStudents();
    }

// Student Skill Progress Chart - Student/Counselor Dashboard

    @PreAuthorize("hasAnyRole('STUDENT', 'COUNSELOR')")
    @GetMapping("/student/{studentId}/skill-progress")
    public Map<String, List<Map<String, Object>>> getStudentSkillProgress(@PathVariable Integer studentId) {
        return reportService.getStudentSkillProgress(studentId);
    }

// Counselor’s Assigned Students - Counselor/Admin Dashboard

    @PreAuthorize("hasAnyRole('COUNSELOR', 'ADMIN')")
    @GetMapping("/counselor/{counselorId}/students")
    public List<Map<String, Object>> getCounselorStudentsSummary(@PathVariable Integer counselorId) {
        return reportService.getAssignedStudentsSummary(counselorId);
    }

}

