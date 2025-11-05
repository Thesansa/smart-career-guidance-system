package com.smartcareer.careerguidancebackend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_counselor_mapping")
public class StudentCounselorMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Student linked from StudentProfile
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", referencedColumnName = "id", nullable = false)
    private StudentProfile student;

    // Counselor linked from CounselorProfile
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "counselor_id", referencedColumnName = "id", nullable = false)
    private CounselorProfile counselor;

    // Optional feedback from counselor after sessions
    @Column(columnDefinition = "TEXT")
    private String feedback;

    private LocalDateTime assignedDate;
    private LocalDateTime lastUpdated;

    public StudentCounselorMapping() {
        this.assignedDate = LocalDateTime.now();
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public StudentProfile getStudent() { return student; }
    public void setStudent(StudentProfile student) { this.student = student; }

    public CounselorProfile getCounselor() { return counselor; }
    public void setCounselor(CounselorProfile counselor) { this.counselor = counselor; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) {
        this.feedback = feedback;
        this.lastUpdated = LocalDateTime.now();
    }

    public LocalDateTime getAssignedDate() { return assignedDate; }
    public void setAssignedDate(LocalDateTime assignedDate) { this.assignedDate = assignedDate; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}
