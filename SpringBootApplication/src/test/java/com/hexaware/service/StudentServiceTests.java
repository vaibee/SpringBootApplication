package com.hexaware.service;

import com.hexaware.entity.Department;
import com.hexaware.entity.Student;
import com.hexaware.repository.DepartmentRepository;
import com.hexaware.repository.StudentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class StudentServiceTests {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @InjectMocks
    private StudentSeriveImpl studentService;

    @Test
    void createStudentUsesExistingDepartment() {
        Department department = new Department();
        department.setId(7);
        Student student = new Student();
        Department requestedDepartment = new Department();
        requestedDepartment.setId(7);
        student.setDept(requestedDepartment);

        when(departmentRepository.findById(7)).thenReturn(Optional.of(department));
        when(studentRepository.save(student)).thenReturn(student);

        Student created = studentService.createUser(student);

        assertSame(department, created.getDept());
        verify(studentRepository).save(student);
    }

    @Test
    void createStudentRejectsDepartmentThatDoesNotExist() {
        Student student = new Student();
        Department requestedDepartment = new Department();
        requestedDepartment.setId(99);
        student.setDept(requestedDepartment);
        when(departmentRepository.findById(99)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class, () -> studentService.createUser(student));

        assertEquals(404, exception.getStatusCode().value());
        verify(studentRepository, never()).save(any(Student.class));
    }
}
