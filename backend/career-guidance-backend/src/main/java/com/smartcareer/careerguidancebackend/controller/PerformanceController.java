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

    @GetMapping("/academic/{studentId}")
    public List<AcademicPerformance> getAcademicPerformance(@PathVariable Long studentId) {
        return performanceService.getAcademicPerformanceByStudent(studentId);
    }

    @GetMapping("/skills/{studentId}")
    public List<SkillAssessment> getSkillAssessments(@PathVariable Long studentId) {
        return performanceService.getSkillAssessmentsByStudent(studentId);
    }

    @PostMapping("/summary/{studentId}")
    public PerformanceSummary generatePerformanceSummary(@PathVariable Long studentId) {
        return performanceService.generatePerformanceSummary(studentId);
    }

    @GetMapping("/summary/{studentId}")
    public PerformanceSummary getPerformanceSummary(@PathVariable Long studentId) {
        return performanceService.generatePerformanceSummary(studentId);
    }
}
