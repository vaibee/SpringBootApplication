package com.hexaware.service;


import com.hexaware.entity.Student;
import com.hexaware.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentSeriveImpl implements StudentService {

    private StudentRepository studentRepo;

    public StudentSeriveImpl(StudentRepository studentRepo) {
        this.studentRepo = studentRepo;
    }

    @Override
    public Student createUser(Student stud) {
        return studentRepo.save(stud);
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepo.findAll();
    }


    // to get the information from the table by using an id , we need two methods i.e findById() and get().
    @Override
    public Student getStudentById(int studId) {
        Optional<Student> studentId = studentRepo.findById(studId);
        return studentId.get();
    }

    @Override
    public void deleteStudentById(int studId) {
        studentRepo.deleteById(studId);
    }

    @Override
    public void updateStudentById(int studId, Student studentDetails) {
        Student existingStudent = studentRepo.findById(studId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studId));

        // update only necessary fields
        existingStudent.setStudentName(studentDetails.getStudentName());
        existingStudent.setStudentAge(studentDetails.getStudentAge());
        existingStudent.setDept(studentDetails.getDept());

        studentRepo.save(existingStudent);
    }
}


