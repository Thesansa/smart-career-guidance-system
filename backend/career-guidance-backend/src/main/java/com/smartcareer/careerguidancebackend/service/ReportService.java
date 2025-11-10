package com.smartcareer.careerguidancebackend.service;

import com.smartcareer.careerguidancebackend.model.*;
import com.smartcareer.careerguidancebackend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private PerformanceSummaryRepository performanceSummaryRepository;

    @Autowired
    private CareerRecommendationRepository careerRecommendationRepository;

    @Autowired
    private SystemLogRepository systemLogRepository;


    // Get system-wide statistics (for Admin Dashboard)

    public Map<String, Object> getSystemOverview() {
        Map<String, Object> report = new HashMap<>();

        //  Total summaries recorded
        long totalSummaries = performanceSummaryRepository.count();

        // Total career recommendations made
        long totalRecommendations = careerRecommendationRepository.count();

        //  Total logged actions
        long totalLogs = systemLogRepository.count();

        //  Add to report map
        report.put("totalSummaries", totalSummaries);
        report.put("totalRecommendations", totalRecommendations);
        report.put("totalSystemLogs", totalLogs);

        return report;
    }

    //Get Student’s Own Performance Summary (for Student Dashboard)

    public Optional<PerformanceSummary> getStudentPerformance(StudentProfile student) {
        return Optional.ofNullable(performanceSummaryRepository.findByStudent(student));
    }


    // Get Student Career Recommendations (for Student Dashboard)

    public List<CareerRecommendation> getCareerRecommendations(StudentProfile student) {
        return careerRecommendationRepository.findByStudent(student);
    }


    // Get Common Career Trends (for Counselors/Admin)

    public Map<String, Long> getPopularCareers() {
        List<CareerRecommendation> allRecs = careerRecommendationRepository.findAll();

        // Group by career name and count how many students got each one
        return allRecs.stream()
                .collect(Collectors.groupingBy(
                        rec -> rec.getCareerPath().getCareerName(),
                        Collectors.counting()
                ));
    }


    // Get Counselor Activity Summary (for Admin)

    public Map<String, Long> getCounselorActivity() {
        List<SystemLog> logs = systemLogRepository.findAll();

        // Count number of actions per actor (e.g., counselor/admin)
        return logs.stream()
                .collect(Collectors.groupingBy(SystemLog::getActor, Collectors.counting()));
    }


    // Calculate Average Grade Across All Students (for Analytics)

    public Double getAverageGradeAllStudents() {
        List<PerformanceSummary> summaries = performanceSummaryRepository.findAll();

        return summaries.stream()
                .filter(s -> s.getAverageGrade() != null)
                .mapToDouble(PerformanceSummary::getAverageGrade)
                .average()
                .orElse(0.0);
    }

    // Get student skill progress over time (for Student Dashboard charts)
    @Autowired
    private SkillAssessmentRepository skillAssessmentRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    public Map<String, List<Map<String, Object>>> getStudentSkillProgress(Long studentId) {
        StudentProfile student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        var assessments = skillAssessmentRepository.findByStudentOrderByAssessmentDateAsc(student);

        Map<String, List<Map<String, Object>>> progress = new HashMap<>();

        for (SkillAssessment a : assessments) {
            progress.computeIfAbsent(a.getSkillName(), k -> new ArrayList<>())
                    .add(Map.of("date", a.getAssessmentDate(), "score", a.getScore()));
        }

        return progress;
    }



    // Get counselor's assigned students and their performance summary
    @Autowired
    private StudentCounselorMappingRepository studentCounselorMappingRepository;

    public List<Map<String, Object>> getAssignedStudentsSummary(Long counselorId) {
        var mappings = studentCounselorMappingRepository.findByCounselorId(counselorId);
        List<Map<String, Object>> summaryList = new ArrayList<>();

        for (StudentCounselorMapping map : mappings) {
            var studentOpt = studentProfileRepository.findById(map.getStudent().getId());
            if (studentOpt.isEmpty()) continue;
            var student = studentOpt.get();

            var summary = performanceSummaryRepository.findByStudent(student);
            var recs = careerRecommendationRepository.findByStudent(student);

            Map<String, Object> studentSummary = new HashMap<>();
            studentSummary.put("studentId", student.getId());
            studentSummary.put("studentName", student.getFullName());
            studentSummary.put("averageGrade", summary != null ? summary.getAverageGrade() : null);
            studentSummary.put("topSkills", summary != null ? summary.getTopSkills() : null);
            studentSummary.put("recommendedCareer",
                    !recs.isEmpty() ? recs.get(0).getCareerPath().getCareerName() : null);

            summaryList.add(studentSummary);
        }
        return summaryList;
    }
}


