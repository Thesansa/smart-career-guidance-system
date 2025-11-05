package com.smartcareer.careerguidancebackend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "counselor_profile")
public class CounselorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user; // Link to User entity

    @Column(nullable = false)
    private String fullName;

    private String department;
    private Integer experienceYears;
    private String contactNumber;

    // Constructors
    public CounselorProfile() {}

    public CounselorProfile(User user, String fullName, String department, Integer experienceYears, String contactNumber) {
        this.user = user;
        this.fullName = fullName;
        this.department = department;
        this.experienceYears = experienceYears;
        this.contactNumber = contactNumber;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
}
