package com.smartcareer.careerguidancebackend.service;

import com.smartcareer.careerguidancebackend.model.*;
import com.smartcareer.careerguidancebackend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CareerRecommendationService {

    @Autowired
    private CareerRecommendationRepository recommendationRepository;

    @Autowired
    private CareerPathRepository careerPathRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private SkillAssessmentRepository skillAssessmentRepository;

    /**
     * Generate career recommendations for a student with enhanced skill scoring
     */
    public List<CareerRecommendation> generateRecommendations(Long studentId) {
        System.out.println("🎯 Starting recommendation generation for student: " + studentId);

        StudentProfile student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));

        // ✅ Remove old recommendations
        List<CareerRecommendation> oldRecommendations = recommendationRepository.findByStudent(student);
        System.out.println("🗑️ Removing " + oldRecommendations.size() + " old recommendations");
        recommendationRepository.deleteAll(oldRecommendations);

        // ✅ Fetch student skills with scores
        List<SkillAssessment> skillAssessments = skillAssessmentRepository.findByStudentOrderByAssessmentDateAsc(student);
        System.out.println("📊 Found " + skillAssessments.size() + " skills for student");

        if (skillAssessments.isEmpty()) {
            System.out.println("❌ No skills found - cannot generate recommendations");
            throw new RuntimeException("No skills found. Please add skills first to generate recommendations.");
        }

        // Debug: Print all skills
        System.out.println("🎯 Student Skills:");
        skillAssessments.forEach(skill ->
                System.out.println("  - " + skill.getSkillName() + " (" + skill.getScore() + "%)")
        );

        List<CareerPath> allCareers = careerPathRepository.findAll();
        System.out.println("💼 Total career paths available: " + allCareers.size());

        // Debug: Print all career paths and their required skills
        System.out.println("💼 Career Paths:");
        allCareers.forEach(career ->
                System.out.println("  - " + career.getCareerName() + ": " + career.getRequiredSkills())
        );

        List<CareerRecommendation> recommendations = new ArrayList<>();

        for (CareerPath career : allCareers) {
            if (career.getRequiredSkills() == null || career.getRequiredSkills().trim().isEmpty()) {
                System.out.println("⚠️ Skipping career with no required skills: " + career.getCareerName());
                continue;
            }

            // Parse required skills (case-insensitive, trim spaces)
            List<String> requiredSkills = Arrays.stream(career.getRequiredSkills().split(","))
                    .map(skill -> skill.trim().toLowerCase())
                    .collect(Collectors.toList());

            System.out.println("🔍 Matching for career: " + career.getCareerName());
            System.out.println("   Required skills (normalized): " + requiredSkills);

            // Create a map of student skills (case-insensitive)
            Map<String, Double> studentSkillProficiencies = skillAssessments.stream()
                    .collect(Collectors.toMap(
                            skill -> skill.getSkillName().trim().toLowerCase(),
                            skill -> skill.getScore() / 100.0,
                            (existing, replacement) -> existing
                    ));

            System.out.println("   Student skills (normalized): " + studentSkillProficiencies.keySet());

            double totalProficiency = 0.0;
            int matchedSkillsCount = 0;
            int totalRequiredSkills = requiredSkills.size();

            // Match skills (case-insensitive)
            for (String requiredSkill : requiredSkills) {
                if (studentSkillProficiencies.containsKey(requiredSkill)) {
                    double studentProficiency = studentSkillProficiencies.get(requiredSkill);
                    totalProficiency += studentProficiency;
                    matchedSkillsCount++;
                    System.out.println("   ✅ Matched: " + requiredSkill + " (proficiency: " + studentProficiency + ")");
                } else {
                    System.out.println("   ❌ Missing: " + requiredSkill);
                }
            }

            // Calculate coverage (how many required skills the student has)
            double skillCoverage = (double) matchedSkillsCount / totalRequiredSkills;

            // Calculate average proficiency in matched skills
            double averageProficiency = matchedSkillsCount > 0 ? totalProficiency / matchedSkillsCount : 0.0;

            // Combined confidence score (coverage * proficiency with weights)
            double coverageWeight = 0.6; // 60% weight to having the required skills
            double proficiencyWeight = 0.4; // 40% weight to skill level

            double confidence = (skillCoverage * coverageWeight) + (averageProficiency * proficiencyWeight);

            // Enhanced match level calculation
            String matchLevel;
            if (confidence >= 0.7) {
                matchLevel = "High";
            } else if (confidence >= 0.4) {
                matchLevel = "Medium";
            } else if (confidence >= 0.2) {
                matchLevel = "Low";
            } else {
                matchLevel = "Very Low";
            }

            System.out.println("   📊 Career: " + career.getCareerName() +
                    " | Matched: " + matchedSkillsCount + "/" + totalRequiredSkills +
                    " | Coverage: " + Math.round(skillCoverage * 100) + "%" +
                    " | Confidence: " + Math.round(confidence * 100) + "%" +
                    " | Level: " + matchLevel);

            // Create recommendation if confidence meets threshold
            if (confidence >= 0.1) { // Lower threshold to show more potential matches
                CareerRecommendation recommendation = new CareerRecommendation();
                recommendation.setStudent(student);
                recommendation.setCareerPath(career);
                recommendation.setConfidenceScore(Math.round(confidence * 100.0) / 100.0);
                recommendation.setMatchLevel(matchLevel);
                recommendation.setRecommendationDate(LocalDateTime.now());

                CareerRecommendation savedRec = recommendationRepository.save(recommendation);
                recommendations.add(savedRec);
                System.out.println("   ✅ Created recommendation: " + matchLevel + " match");
            } else {
                System.out.println("   ❌ Below threshold, skipping");
            }
        }

        // Sort recommendations by confidence score (highest first)
        recommendations.sort((a, b) -> Double.compare(b.getConfidenceScore(), a.getConfidenceScore()));

        System.out.println("🎯 Generated " + recommendations.size() + " total recommendations");

        return recommendations;
    }

    /**
     * Get recommendations for a specific student
     */
    public List<CareerRecommendation> getRecommendationsByStudent(Long studentId) {
        StudentProfile student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));
        return recommendationRepository.findByStudent(student);
    }

    /**
     * Get all recommendations (Admin only)
     */
    public List<CareerRecommendation> getAllRecommendations() {
        return recommendationRepository.findAll();
    }

    /**
     * Optional: Get detailed match breakdown for debugging/analytics
     */
    public Map<String, Object> getRecommendationBreakdown(Long studentId) {
        StudentProfile student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<SkillAssessment> skills = skillAssessmentRepository.findByStudentOrderByAssessmentDateAsc(student);
        List<CareerRecommendation> recommendations = recommendationRepository.findByStudent(student);

        Map<String, Object> breakdown = new HashMap<>();
        breakdown.put("studentSkills", skills);
        breakdown.put("totalRecommendations", recommendations.size());
        breakdown.put("highMatchCount", recommendations.stream().filter(r -> "High".equals(r.getMatchLevel())).count());
        breakdown.put("mediumMatchCount", recommendations.stream().filter(r -> "Medium".equals(r.getMatchLevel())).count());
        breakdown.put("lowMatchCount", recommendations.stream().filter(r -> "Low".equals(r.getMatchLevel())).count());

        return breakdown;
    }
}