package com.smartcareer.careerguidancebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportDTO {
    private long totalStudents;
    private long totalCounselors;
    private long totalAdmins;
    private double averageGradeOverall;
    private String mostCommonTopSkill;
    private String mostPopularCareer;
    private long totalCareerRecommendations;
    private long totalSystemLogs;

}
