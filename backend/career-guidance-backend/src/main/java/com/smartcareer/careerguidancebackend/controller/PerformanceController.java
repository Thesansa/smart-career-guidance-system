package com.smartcareer.careerguidancebackend.controller;

import com.smartcareer.careerguidancebackend.model.AcademicPerformance;
import com.smartcareer.careerguidancebackend.model.PerformanceSummary;
import com.smartcareer.careerguidancebackend.model.SkillAssessment;
import com.smartcareer.careerguidancebackend.service.PerformanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/performance")
@CrossOrigin(origins = "*")
public class PerformanceController {

    @Autowired
    private PerformanceService performanceService;

    // Academic Performance Endpoints
    @GetMapping("/academic/{studentId}")
    public List<AcademicPerformance> getAcademicPerformance(@PathVariable Long studentId) {
        return performanceService.getAcademicPerformanceByStudent(studentId);
    }

    @PostMapping("/academic/add")
    public AcademicPerformance addAcademicPerformance(@RequestBody AcademicPerformance academicPerformance) {
        return performanceService.addAcademicPerformance(academicPerformance);
    }

    @PostMapping("/academic/sample/{studentId}")
    public List<AcademicPerformance> addSampleAcademicData(@PathVariable Long studentId) {
        return performanceService.addSampleAcademicData(studentId);
    }

    // Skills Endpoints
    @GetMapping("/skills/{studentId}")
    public List<SkillAssessment> getSkillAssessments(@PathVariable Long studentId) {
        return performanceService.getSkillAssessmentsByStudent(studentId);
    }

    @PostMapping("/skills/add")
    public SkillAssessment addSkillAssessment(@RequestBody SkillAssessment skillAssessment) {
        return performanceService.addSkillAssessment(skillAssessment);
    }

    @PutMapping("/skills/update/{id}")
    public SkillAssessment updateSkillAssessment(@PathVariable Long id, @RequestBody SkillAssessment skillAssessment) {
        return performanceService.updateSkillAssessment(id, skillAssessment);
    }

    @DeleteMapping("/skills/{id}")
    public void deleteSkillAssessment(@PathVariable Long id) {
        performanceService.deleteSkillAssessment(id);
    }

    // Performance Summary Endpoints
    @PostMapping("/summary/{studentId}")
    public PerformanceSummary generatePerformanceSummary(@PathVariable Long studentId) {
        return performanceService.generatePerformanceSummary(studentId);
    }

    @GetMapping("/summary/{studentId}")
    public PerformanceSummary getPerformanceSummary(@PathVariable Long studentId) {
        return performanceService.generatePerformanceSummary(studentId);
    }
}