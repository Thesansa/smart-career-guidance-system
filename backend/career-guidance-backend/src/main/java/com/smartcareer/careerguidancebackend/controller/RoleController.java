package com.smartcareer.careerguidancebackend.controller;


import com.smartcareer.careerguidancebackend.model.Role;
import com.smartcareer.careerguidancebackend.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @PostMapping("/add")
    public Role addRole(@RequestBody Role role) {
        return roleService.saveRole(role);
    }

    @GetMapping("/all")
    public List<Role> getAllRoles() {
        return roleService.getAllRoles();
    }

    @GetMapping("/{id}")
    public Optional<Role> getRoleById(@PathVariable Integer id) {
        return roleService.getRoleById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteRole(@PathVariable Integer id) {
        roleService.deleteRole(id);
    }
}

