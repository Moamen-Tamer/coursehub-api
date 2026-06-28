-- Seed data: enrollments
-- Each student enrolled in exactly 2 courses, both within their own tenant = 10 rows per tenant x 3 = 30 rows
-- Looked up by tenant slug + student email + course title.

INSERT INTO enrollments (tenant_id, student_id, course_id)
SELECT t.id, s.id, c.id
FROM (VALUES
    -- Greenwood Academy
    ('greenwood-academy', 'james.walker@greenwood-academy.test',   'Introduction to Algorithms'),
    ('greenwood-academy', 'james.walker@greenwood-academy.test',   'Data Structures Fundamentals'),
    ('greenwood-academy', 'olivia.brown@greenwood-academy.test',   'Modern Web Development'),
    ('greenwood-academy', 'olivia.brown@greenwood-academy.test',   'Database Design Principles'),
    ('greenwood-academy', 'noah.davis@greenwood-academy.test',     'Introduction to Algorithms'),
    ('greenwood-academy', 'noah.davis@greenwood-academy.test',     'Modern Web Development'),
    ('greenwood-academy', 'ava.wilson@greenwood-academy.test',     'Data Structures Fundamentals'),
    ('greenwood-academy', 'ava.wilson@greenwood-academy.test',     'Database Design Principles'),
    ('greenwood-academy', 'liam.taylor@greenwood-academy.test',    'Introduction to Algorithms'),
    ('greenwood-academy', 'liam.taylor@greenwood-academy.test',    'Database Design Principles'),

    -- Blue Ridge Institute
    ('blue-ridge-institute', 'sophia.martinez@blue-ridge-institute.test', 'Calculus I'),
    ('blue-ridge-institute', 'sophia.martinez@blue-ridge-institute.test', 'Linear Algebra Essentials'),
    ('blue-ridge-institute', 'ethan.clark@blue-ridge-institute.test',     'Organic Chemistry Basics'),
    ('blue-ridge-institute', 'ethan.clark@blue-ridge-institute.test',     'General Physics'),
    ('blue-ridge-institute', 'mia.lewis@blue-ridge-institute.test',       'Calculus I'),
    ('blue-ridge-institute', 'mia.lewis@blue-ridge-institute.test',       'Organic Chemistry Basics'),
    ('blue-ridge-institute', 'lucas.young@blue-ridge-institute.test',     'Linear Algebra Essentials'),
    ('blue-ridge-institute', 'lucas.young@blue-ridge-institute.test',     'General Physics'),
    ('blue-ridge-institute', 'isabella.king@blue-ridge-institute.test',   'Calculus I'),
    ('blue-ridge-institute', 'isabella.king@blue-ridge-institute.test',   'General Physics'),

    -- Lighthouse Online School
    ('lighthouse-online', 'benjamin.hill@lighthouse-online.test', 'Digital Marketing Strategy'),
    ('lighthouse-online', 'benjamin.hill@lighthouse-online.test', 'Creative Writing Workshop'),
    ('lighthouse-online', 'chloe.baker@lighthouse-online.test',   'Business Analytics'),
    ('lighthouse-online', 'chloe.baker@lighthouse-online.test',   'World History Survey'),
    ('lighthouse-online', 'henry.green@lighthouse-online.test',   'Digital Marketing Strategy'),
    ('lighthouse-online', 'henry.green@lighthouse-online.test',   'Business Analytics'),
    ('lighthouse-online', 'zoe.campbell@lighthouse-online.test',  'Creative Writing Workshop'),
    ('lighthouse-online', 'zoe.campbell@lighthouse-online.test',  'World History Survey'),
    ('lighthouse-online', 'jack.mitchell@lighthouse-online.test', 'Digital Marketing Strategy'),
    ('lighthouse-online', 'jack.mitchell@lighthouse-online.test', 'World History Survey')
) AS v(slug, student_email, course_title)
JOIN tenants t ON t.slug = v.slug
JOIN users s ON s.email = v.student_email
JOIN courses c ON c.title = v.course_title AND c.tenant_id = t.id;
