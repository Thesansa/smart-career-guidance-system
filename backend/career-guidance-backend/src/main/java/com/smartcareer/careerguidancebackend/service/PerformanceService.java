package com.smartcareer.careerguidancebackend.service;

import com.smartcareer.careerguidancebackend.model.*;
import com.smartcareer.careerguidancebackend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PerformanceService {

    @Autowired
    private AcademicPerformanceRepository academicRepo;

    @Autowired
    private SkillAssessmentRepository skillRepo;

    @Autowired
    private PerformanceSummaryRepository summaryRepo;

    @Autowired
    private StudentProfileRepository studentRepo;

    public List<AcademicPerformance> getAcademicPerformanceByStudent(Long studentId) {
        StudentProfile student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return academicRepo.findByStudent(student);
    }

    public List<SkillAssessment> getSkillAssessmentsByStudent(Long studentId) {
        StudentProfile student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return skillRepo.findByStudent(student);
    }

    public PerformanceSummary generatePerformanceSummary(Long studentId) {
        StudentProfile student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<AcademicPerformance> academics = academicRepo.findByStudent(student);
        List<SkillAssessment> skills = skillRepo.findByStudent(student);

        double avgGrade = academics.stream()
                .mapToDouble(a -> gradeToNumeric(a.getGrade()))
                .average()
                .orElse(0.0);

        String topSkills = skills.stream()
                .sorted(Comparator.comparingDouble(SkillAssessment::getScore).reversed())
                .limit(3)
                .map(SkillAssessment::getSkillName)
                .collect(Collectors.joining(", "));

        PerformanceSummary summary = summaryRepo.findByStudent(student);
        if (summary == null) summary = new PerformanceSummary();

        summary.setStudent(student);
        summary.setAverageGrade(avgGrade);
        summary.setTopSkills(topSkills);
        summary.setUpdatedOn(LocalDate.now());

        return summaryRepo.save(summary);
    }

    private double gradeToNumeric(String grade) {
        return switch (grade.toUpperCase()) {
            case "A+" -> 4.0;
            case "A" -> 3.8;
            case "B+" -> 3.5;
            case "B" -> 3.0;
            case "C" -> 2.5;
            case "D" -> 2.0;
            default -> 0.0;
        };
    }
}
