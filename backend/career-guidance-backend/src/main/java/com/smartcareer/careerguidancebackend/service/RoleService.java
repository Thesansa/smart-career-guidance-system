package com.smartcareer.careerguidancebackend.service;

import com.smartcareer.careerguidancebackend.model.Role;
import com.smartcareer.careerguidancebackend.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    public Role saveRole(Role role) {
        return roleRepository.save(role);
    }

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public Optional<Role> getRoleById(Integer id) {
        return roleRepository.findById(id);
    }

    public void deleteRole(Integer id) {
        roleRepository.deleteById(id);
    }
}

