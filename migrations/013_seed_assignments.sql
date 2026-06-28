-- Seed data: assignments
-- 2 assignments per course = 24 rows. Assignment 1 is past-due (so submissions/grades exist for it),
-- Assignment 2 is upcoming (so it has no submissions yet) — gives realistic, mixed test data.
-- Looked up by tenant slug + course title.

INSERT INTO assignments (tenant_id, course_id, title, due_date)
SELECT t.id, c.id, v.title, v.due_date::timestamp
FROM (VALUES
    -- Greenwood Academy
    ('greenwood-academy', 'Introduction to Algorithms',     'Assignment 1: Big-O Analysis',              '2026-05-20 23:59:00'),
    ('greenwood-academy', 'Introduction to Algorithms',     'Assignment 2: Sorting Algorithm Comparison', '2026-08-10 23:59:00'),
    ('greenwood-academy', 'Data Structures Fundamentals',   'Assignment 1: Linked List Implementation',   '2026-05-22 23:59:00'),
    ('greenwood-academy', 'Data Structures Fundamentals',   'Assignment 2: Binary Search Tree',           '2026-08-12 23:59:00'),
    ('greenwood-academy', 'Modern Web Development',         'Assignment 1: REST API Design',              '2026-05-25 23:59:00'),
    ('greenwood-academy', 'Modern Web Development',         'Assignment 2: Auth Middleware',              '2026-08-15 23:59:00'),
    ('greenwood-academy', 'Database Design Principles',     'Assignment 1: ER Diagram Submission',        '2026-05-27 23:59:00'),
    ('greenwood-academy', 'Database Design Principles',     'Assignment 2: Normalization Exercise',       '2026-08-18 23:59:00'),

    -- Blue Ridge Institute
    ('blue-ridge-institute', 'Calculus I',                  'Assignment 1: Limits and Continuity',        '2026-05-18 23:59:00'),
    ('blue-ridge-institute', 'Calculus I',                  'Assignment 2: Derivative Applications',      '2026-08-08 23:59:00'),
    ('blue-ridge-institute', 'Linear Algebra Essentials',   'Assignment 1: Matrix Operations',            '2026-05-21 23:59:00'),
    ('blue-ridge-institute', 'Linear Algebra Essentials',   'Assignment 2: Eigenvalues and Eigenvectors', '2026-08-11 23:59:00'),
    ('blue-ridge-institute', 'Organic Chemistry Basics',    'Assignment 1: Nomenclature Worksheet',       '2026-05-24 23:59:00'),
    ('blue-ridge-institute', 'Organic Chemistry Basics',    'Assignment 2: Reaction Mechanisms',          '2026-08-14 23:59:00'),
    ('blue-ridge-institute', 'General Physics',             'Assignment 1: Kinematics Problem Set',       '2026-05-26 23:59:00'),
    ('blue-ridge-institute', 'General Physics',             'Assignment 2: Energy Conservation Lab',      '2026-08-16 23:59:00'),

    -- Lighthouse Online School
    ('lighthouse-online', 'Digital Marketing Strategy',     'Assignment 1: Audience Persona Report',      '2026-05-19 23:59:00'),
    ('lighthouse-online', 'Digital Marketing Strategy',     'Assignment 2: Campaign Plan',                '2026-08-09 23:59:00'),
    ('lighthouse-online', 'Business Analytics',              'Assignment 1: KPI Dashboard Draft',          '2026-05-23 23:59:00'),
    ('lighthouse-online', 'Business Analytics',              'Assignment 2: Statistical Summary Report',   '2026-08-13 23:59:00'),
    ('lighthouse-online', 'Creative Writing Workshop',       'Assignment 1: Short Story Draft',            '2026-05-28 23:59:00'),
    ('lighthouse-online', 'Creative Writing Workshop',       'Assignment 2: Peer Review Revision',         '2026-08-19 23:59:00'),
    ('lighthouse-online', 'World History Survey',            'Assignment 1: Civilization Comparison Essay','2026-05-30 23:59:00'),
    ('lighthouse-online', 'World History Survey',            'Assignment 2: Primary Source Analysis',      '2026-08-20 23:59:00')
) AS v(slug, course_title, title, due_date)
JOIN tenants t ON t.slug = v.slug
JOIN courses c ON c.title = v.course_title AND c.tenant_id = t.id;
