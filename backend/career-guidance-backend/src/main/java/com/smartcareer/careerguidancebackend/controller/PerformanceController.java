package com.smartcareer.careerguidancebackend.controller;

import com.smartcareer.careerguidancebackend.model.*;
import com.smartcareer.careerguidancebackend.service.PerformanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/performance")
public class PerformanceController {

    @Autowired
    private PerformanceService performanceService;

    @GetMapping("/academic/{studentId}")
    public List<AcademicPerformance> getAcademicPerformance(@PathVariable Integer studentId) {
        return performanceService.getAcademicPerformanceByStudent(studentId);
    }

    @GetMapping("/skills/{studentId}")
    public List<SkillAssessment> getSkillAssessments(@PathVariable Integer studentId) {
        return performanceService.getSkillAssessmentsByStudent(studentId);
    }

    @PostMapping("/summary/{studentId}")
    public PerformanceSummary generatePerformanceSummary(@PathVariable Integer studentId) {
        return performanceService.generatePerformanceSummary(studentId);
    }

    @GetMapping("/summary/{studentId}")
    public PerformanceSummary getPerformanceSummary(@PathVariable Integer studentId) {
        return performanceService.generatePerformanceSummary(studentId);
    }
}

