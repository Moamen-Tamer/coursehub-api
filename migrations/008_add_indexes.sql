CREATE INDEX idx_users_tenant_role
ON users (tenant_id, role);

CREATE INDEX idx_courses_tenant_instructor
ON courses (tenant_id, instructor_id);

CREATE INDEX idx_enrollments_tenant_course
ON enrollments (tenant_id, course_id);

CREATE INDEX idx_enrollments_tenant_student
ON enrollments (tenant_id, student_id);

CREATE INDEX idx_assignments_tenant_course
ON assignments (tenant_id, course_id);

CREATE INDEX idx_submissions_tenant_assignment
ON submissions (tenant_id, assignment_id);

CREATE INDEX idx_submissions_tenant_student
ON submissions (tenant_id, student_id);

CREATE INDEX idx_submissions_grade_not_null
ON submissions (grade)
WHERE grade IS NOT NULL;