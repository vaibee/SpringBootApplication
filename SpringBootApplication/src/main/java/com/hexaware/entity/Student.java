package com.hexaware.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import org.springframework.beans.factory.annotation.Autowired;

@Entity
@Table(name = "Student")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String studentName;

    @Column(nullable = false)
    private int studentAge;

    @ManyToOne
    @JoinColumn(name = "dept_id", nullable = false)
    @JsonBackReference
    private Department dept;


    public Student() {
    }

    public Student(Department dept, int id, int studentAge, String studentName) {
        this.dept = dept;
        this.id = id;
        this.studentAge = studentAge;
        this.studentName = studentName;
    }

    public Department getDept() {
        return dept;
    }

    public void setDept(Department dept) {
        this.dept = dept;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getStudentAge() {
        return studentAge;
    }

    public void setStudentAge(int studentAge) {
        this.studentAge = studentAge;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    @Override
    public String toString() {
        return "Student{" +
                "dept=" + dept +
                ", id=" + id +
                ", studentName='" + studentName + '\'' +
                ", studentAge=" + studentAge +
                '}';
    }
}

