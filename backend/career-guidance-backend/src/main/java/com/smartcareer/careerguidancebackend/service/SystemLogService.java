package com.smartcareer.careerguidancebackend.service;

import com.smartcareer.careerguidancebackend.model.SystemLog;
import com.smartcareer.careerguidancebackend.repository.SystemLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SystemLogService {

    @Autowired
    private SystemLogRepository systemLogRepository;

    /**
     * Get all system logs (Admin view)
     */
    public List<SystemLog> getAllLogs() {
        return systemLogRepository.findAll();
    }

    /**
     * Get logs filtered by actor username (e.g., "admin1" or "counselorA")
     */
    public List<SystemLog> getLogsByActor(String actor) {
        return systemLogRepository.findByActor(actor);
    }

    /**
     * Record a custom log action manually
     * (used if other services want to log custom operations)
     */
    public SystemLog createLog(String action, String actor, String details) {
        SystemLog log = new SystemLog(action, actor, details);
        return systemLogRepository.save(log);
    }

    /**
     * Delete a specific log (optional Admin cleanup)
     */
    public void deleteLog(Long id) {
        if (!systemLogRepository.existsById(id)) {
            throw new RuntimeException("Log entry not found with id: " + id);
        }
        systemLogRepository.deleteById(id);
    }

    /**
     * Delete all logs (use carefully)
     */
    public void clearAllLogs() {
        systemLogRepository.deleteAll();
    }
}
