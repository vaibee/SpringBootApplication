package com.hexaware.service;


import com.hexaware.entity.Department;
import com.hexaware.entity.Student;
import com.hexaware.repository.DepartmentRepository;
import com.hexaware.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class StudentSeriveImpl implements StudentService {

    private StudentRepository studentRepo;
    private DepartmentRepository departmentRepo;

    public StudentSeriveImpl(StudentRepository studentRepo, DepartmentRepository departmentRepo) {
        this.studentRepo = studentRepo;
        this.departmentRepo = departmentRepo;
    }

    @Override
    public Student createUser(Student stud) {
        stud.setDept(findDepartment(stud));
        return studentRepo.save(stud);
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepo.findAll();
    }


    @Override
    public Student getStudentById(int studId) {
        return studentRepo.findById(studId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Student not found with id: " + studId));
    }

    @Override
    public void deleteStudentById(int studId) {
        studentRepo.deleteById(studId);
    }

    @Override
    public void updateStudentById(int studId, Student studentDetails) {
        Student existingStudent = studentRepo.findById(studId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Student not found with id: " + studId));

        existingStudent.setStudentName(studentDetails.getStudentName());
        existingStudent.setStudentAge(studentDetails.getStudentAge());
        existingStudent.setDept(findDepartment(studentDetails));

        studentRepo.save(existingStudent);
    }

    private Department findDepartment(Student student) {
        if (student.getDept() == null || student.getDept().getId() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A valid department is required");
        }

        int departmentId = student.getDept().getId();
        return departmentRepo.findById(departmentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Department not found with id: " + departmentId));
    }
}
