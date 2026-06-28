ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_users
ON users FOR ALL
USING(
    tenant_id = current_setting('app.tenant_id')::int
);

CREATE POLICY tenant_isolation_courses
ON courses FOR ALL
USING(
    tenant_id = current_setting('app.tenant_id')::int
);

CREATE POLICY tenant_isolation_assignments
ON assignments FOR ALL
USING(
    tenant_id = current_setting('app.tenant_id')::int
);

CREATE POLICY tenant_isolation_enrollments
ON enrollments FOR ALL
USING(
    tenant_id = current_setting('app.tenant_id')::int
);

CREATE POLICY tenant_isolation_submissions
ON submissions FOR ALL
USING(
    tenant_id = current_setting('app.tenant_id')::int
);