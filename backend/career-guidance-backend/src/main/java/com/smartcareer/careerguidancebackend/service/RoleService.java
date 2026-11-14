package com.smartcareer.careerguidancebackend.service;

import com.smartcareer.careerguidancebackend.exceptions.DuplicateResourceException;
import com.smartcareer.careerguidancebackend.exceptions.ResourceInUseException;
import com.smartcareer.careerguidancebackend.exceptions.ResourceNotFoundException;
import com.smartcareer.careerguidancebackend.model.Role;
import com.smartcareer.careerguidancebackend.repository.RoleRepository;
import com.smartcareer.careerguidancebackend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;


    // CREATE ROLE
    public Role saveRole(Role role) {

        if (role == null || role.getName() == null
                || role.getName().isBlank()) {

            throw new IllegalArgumentException("Role name is required.");
        }

        String roleName = role.getName().trim().toUpperCase();

        if (roleRepository.existsByName(roleName)) {
            throw new DuplicateResourceException(
                    "Role already exists."
            );
        }

        role.setName(roleName);

        try {
            return roleRepository.save(role);

        } catch (DataIntegrityViolationException ex) {

            // Protect against duplicate insertion caused by concurrent requests.
            throw new DuplicateResourceException(
                    "Role already exists."
            );
        }
    }


    // GET ALL ROLES
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }


    // GET ROLE BY ID
    public Optional<Role> getRoleById(Integer id) {
        return roleRepository.findById(id);
    }


    // DELETE ROLE
    public void deleteRole(Integer id) {

        Role role = roleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role not found."
                        )
                );

        long assignedUsers =
                userRepository.countByRoleName(role.getName());

        if (assignedUsers > 0) {

            throw new ResourceInUseException(
                    "Cannot delete this role because users are assigned to it."
            );
        }

        roleRepository.delete(role);
    }
}