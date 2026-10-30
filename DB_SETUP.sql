-- Database setup for the SpringBootApplication project.
-- Run this script in MySQL Workbench or with the MySQL command-line client.

CREATE DATABASE IF NOT EXISTS springbootdatabase
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE springbootdatabase;

CREATE TABLE IF NOT EXISTS dept (
    id INT NOT NULL AUTO_INCREMENT,
    dept_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Student (
    id INT NOT NULL AUTO_INCREMENT,
    student_name VARCHAR(255) NOT NULL,
    student_age INT NOT NULL,
    dept_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_student_department
        FOREIGN KEY (dept_id) REFERENCES dept (id)
) ENGINE=InnoDB;

-- Add sample rows only when they are not already present, so the script
-- can be rerun without inserting duplicate sample records.
INSERT INTO dept (dept_name, location)
SELECT 'Computer Science', 'Building A'
WHERE NOT EXISTS (
    SELECT 1 FROM dept WHERE dept_name = 'Computer Science'
);

INSERT INTO dept (dept_name, location)
SELECT 'Mathematics', 'Building B'
WHERE NOT EXISTS (
    SELECT 1 FROM dept WHERE dept_name = 'Mathematics'
);

INSERT INTO Student (student_name, student_age, dept_id)
SELECT 'Alex Morgan', 20, dept.id
FROM dept
WHERE dept.dept_name = 'Computer Science'
  AND NOT EXISTS (
      SELECT 1 FROM Student WHERE student_name = 'Alex Morgan'
  )
LIMIT 1;

INSERT INTO Student (student_name, student_age, dept_id)
SELECT 'Jamie Lee', 21, dept.id
FROM dept
WHERE dept.dept_name = 'Mathematics'
  AND NOT EXISTS (
      SELECT 1 FROM Student WHERE student_name = 'Jamie Lee'
  )
LIMIT 1;

-- Check the sample data.
SELECT * FROM dept;
SELECT * FROM Student;
