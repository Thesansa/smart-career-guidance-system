package com.smartcareer.careerguidancebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentReportDTO {
    private Integer studentId;
    private Double averageGrade;
    private String topSkills;
    private String[] recommendedCareers;
    private Double[] confidenceScores;
    private LocalDate summaryUpdatedOn;
}
