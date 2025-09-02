package com.hexaware.service;

import com.hexaware.entity.Department;

import java.util.List;

public interface DepartmentService {
    Department createDepartment(Department department);
    List<Department> getAllDepartments();
    Department getDepartmentById(int id);
    Department updateDepartmentById(int id, Department departmentDetails);
    void deleteDepartmentById(int id);
}
