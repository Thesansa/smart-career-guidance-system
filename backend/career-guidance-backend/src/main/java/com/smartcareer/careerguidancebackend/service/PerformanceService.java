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

    // Skill Assessment Methods
    public SkillAssessment addSkillAssessment(SkillAssessment skillAssessment) {
        if (skillAssessment.getStudent() == null || skillAssessment.getStudent().getId() == null) {
            throw new RuntimeException("Student ID is required");
        }

        StudentProfile student = studentRepo.findById(skillAssessment.getStudent().getId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        skillAssessment.setStudent(student);
        skillAssessment.setAssessmentDate(LocalDate.now());

        return skillRepo.save(skillAssessment);
    }

    public SkillAssessment updateSkillAssessment(Long id, SkillAssessment updatedSkill) {
        SkillAssessment existingSkill = skillRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill assessment not found"));

        existingSkill.setSkillName(updatedSkill.getSkillName());
        existingSkill.setScore(updatedSkill.getScore());
        existingSkill.setAssessmentDate(LocalDate.now());

        return skillRepo.save(existingSkill);
    }

    public void deleteSkillAssessment(Long id) {
        if (!skillRepo.existsById(id)) {
            throw new RuntimeException("Skill assessment not found");
        }
        skillRepo.deleteById(id);
    }

    // Academic Performance Methods
    public List<AcademicPerformance> getAcademicPerformanceByStudent(Long studentId) {
        StudentProfile student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return academicRepo.findByStudent(student);
    }

    public AcademicPerformance addAcademicPerformance(AcademicPerformance academicPerformance) {
        if (academicPerformance.getStudent() == null || academicPerformance.getStudent().getId() == null) {
            throw new RuntimeException("Student ID is required");
        }

        StudentProfile student = studentRepo.findById(academicPerformance.getStudent().getId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        academicPerformance.setStudent(student);
        return academicRepo.save(academicPerformance);
    }

    public List<AcademicPerformance> addSampleAcademicData(Long studentId) {
        StudentProfile student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Clear existing academic records for this student
        List<AcademicPerformance> existingRecords = academicRepo.findByStudent(student);
        academicRepo.deleteAll(existingRecords);

        // Add sample data
        List<AcademicPerformance> sampleData = Arrays.asList(
                new AcademicPerformance(null, student, "Mathematics", "A", 2024),
                new AcademicPerformance(null, student, "Computer Science", "A+", 2024),
                new AcademicPerformance(null, student, "Physics", "B+", 2024),
                new AcademicPerformance(null, student, "English", "A", 2024),
                new AcademicPerformance(null, student, "Data Structures", "A", 2023),
                new AcademicPerformance(null, student, "Algorithms", "B+", 2023)
        );

        return academicRepo.saveAll(sampleData);
    }

    // Skill Assessment Methods
    public List<SkillAssessment> getSkillAssessmentsByStudent(Long studentId) {
        StudentProfile student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return skillRepo.findByStudentOrderByAssessmentDateAsc(student);
    }

    // Performance Summary Method (ENHANCED VERSION - KEEP ONLY THIS ONE)
    public PerformanceSummary generatePerformanceSummary(Long studentId) {
        StudentProfile student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<AcademicPerformance> academics = academicRepo.findByStudent(student);
        List<SkillAssessment> skills = skillRepo.findByStudentOrderByAssessmentDateAsc(student);

        System.out.println("📊 Generating performance summary for student: " + studentId);
        System.out.println("📚 Academic records found: " + academics.size());
        System.out.println("🎯 Skills found: " + skills.size());

        // Debug: Print all skills
        skills.forEach(skill ->
                System.out.println("Skill: " + skill.getSkillName() + " - Score: " + skill.getScore())
        );

        double avgGrade = academics.stream()
                .mapToDouble(a -> gradeToNumeric(a.getGrade()))
                .average()
                .orElse(0.0);

        // Enhanced top skills processing
        String topSkills = "No skills added";
        if (!skills.isEmpty()) {
            topSkills = skills.stream()
                    .sorted(Comparator.comparingDouble(SkillAssessment::getScore).reversed())
                    .limit(3)
                    .map(skill -> skill.getSkillName() + " (" + skill.getScore() + "%)")
                    .collect(Collectors.joining(", "));

            System.out.println("🏆 Top skills calculated: " + topSkills);
        }

        PerformanceSummary summary = summaryRepo.findByStudent(student);
        if (summary == null) {
            summary = new PerformanceSummary();
            System.out.println("🆕 Creating new performance summary");
        } else {
            System.out.println("📝 Updating existing performance summary");
        }

        summary.setStudent(student);
        summary.setAverageGrade(avgGrade);
        summary.setTopSkills(topSkills);
        summary.setUpdatedOn(LocalDate.now());

        PerformanceSummary savedSummary = summaryRepo.save(summary);
        System.out.println("✅ Performance summary saved: " + savedSummary);

        return savedSummary;
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