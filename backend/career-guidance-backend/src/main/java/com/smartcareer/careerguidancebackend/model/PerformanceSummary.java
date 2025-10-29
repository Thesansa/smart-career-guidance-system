package com.smartcareer.careerguidancebackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "performance_summary")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class PerformanceSummary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "student_id")
    private Integer studentId;

    @Column(name = "average_grade")
    private Double averageGrade;

    @Column(name = "top_skills", columnDefinition = "TEXT")
    private String topSkills;

    @Column(name = "updated_on")
    private LocalDate updatedOn;
}
