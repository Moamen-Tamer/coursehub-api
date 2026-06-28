CREATE TABLE submissions (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id INT REFERENCES tenants(id) ON DELETE CASCADE,
    assignment_id INT REFERENCES assignments(id) ON DELETE CASCADE,
    student_id INT REFERENCES users(id) ON DELETE CASCADE,
    content TEXT,
    grade NUMERIC(5, 2),
    submitted_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (assignment_id, student_id)
);