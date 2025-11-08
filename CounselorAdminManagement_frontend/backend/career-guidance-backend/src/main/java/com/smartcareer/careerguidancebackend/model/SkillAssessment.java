package com.smartcareer.careerguidancebackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "skill_assessment")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class SkillAssessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;


    @Column(name = "skill_name")
    private String skillName;

    private Double score;

    @Column(name = "assessment_date")
    private LocalDate assessmentDate;
}
