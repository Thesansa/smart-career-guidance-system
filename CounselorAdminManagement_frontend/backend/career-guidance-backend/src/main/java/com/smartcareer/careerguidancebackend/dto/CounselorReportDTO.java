package com.smartcareer.careerguidancebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CounselorReportDTO {
    private int counselorId;
    private long assignedStudents;
    private double averageGradeForAssigned;
    private String mostCommonTopSkill;
    private String mostRecommendedCareer;

}
