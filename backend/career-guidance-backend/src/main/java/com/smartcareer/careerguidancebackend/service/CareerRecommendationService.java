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
     * Generate career recommendations for a specific student
     */
    public List<CareerRecommendation> generateRecommendations(Long studentId) {
        StudentProfile student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));

        // ✅ Fetch skills using StudentProfile reference
        List<SkillAssessment> skillAssessments = skillAssessmentRepository.findByStudentOrderByAssessmentDateAsc(student);
        List<String> studentSkills = skillAssessments.stream()
                .map(SkillAssessment::getSkillName)
                .collect(Collectors.toList());

        List<CareerPath> allCareers = careerPathRepository.findAll();
        List<CareerRecommendation> recommendations = new ArrayList<>();

        for (CareerPath career : allCareers) {
            List<String> requiredSkills = Arrays.asList(career.getRequiredSkills().split(",\\s*"));

            long matchedSkills = requiredSkills.stream()
                    .filter(studentSkills::contains)
                    .count();

            double confidence = requiredSkills.isEmpty() ? 0 :
                    (double) matchedSkills / requiredSkills.size();

            String matchLevel = confidence >= 0.75 ? "High"
                    : confidence >= 0.4 ? "Medium" : "Low";

            if (confidence >= 0.4) {
                CareerRecommendation recommendation = new CareerRecommendation();
                recommendation.setStudent(student);
                recommendation.setCareerPath(career);
                recommendation.setConfidenceScore(confidence);
                recommendation.setMatchLevel(matchLevel);
                recommendation.setRecommendationDate(LocalDateTime.now());

                recommendations.add(recommendationRepository.save(recommendation));
            }
        }

        return recommendations;
    }

    public List<CareerRecommendation> getRecommendationsByStudent(Long studentId) {
        StudentProfile student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));

        return recommendationRepository.findByStudent(student);
    }

    public List<CareerRecommendation> getAllRecommendations() {
        return recommendationRepository.findAll();
    }
}
