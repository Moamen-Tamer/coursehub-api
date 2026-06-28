-- Seed data: submissions
-- One submission per enrollment, for that course's already-due "Assignment 1" (the upcoming
-- "Assignment 2" rows intentionally have no submissions yet — that's realistic and also gives
-- the partial index on grade a mix of NULL/non-NULL rows to be useful against.
-- 30 rows total: 21 graded, 9 still ungraded (grade = NULL, pending instructor review).
-- Looked up by tenant slug + course title + assignment title + student email.

INSERT INTO submissions (tenant_id, assignment_id, student_id, content, grade, submitted_at)
SELECT t.id, a.id, s.id, v.content, v.grade::numeric, v.submitted_at::timestamp
FROM (VALUES
    -- Greenwood Academy
    ('greenwood-academy', 'Introduction to Algorithms',   'Assignment 1: Big-O Analysis',            'james.walker@greenwood-academy.test',   'Submitted Big-O analysis writeup covering five sample functions.', 91.5, '2026-05-19 16:40:00'),
    ('greenwood-academy', 'Data Structures Fundamentals', 'Assignment 1: Linked List Implementation','james.walker@greenwood-academy.test',   'Submitted singly and doubly linked list implementation in TypeScript.', NULL, '2026-05-21 20:05:00'),
    ('greenwood-academy', 'Modern Web Development',       'Assignment 1: REST API Design',            'olivia.brown@greenwood-academy.test',   'Submitted API design doc with endpoint table and status codes.', 88.0, '2026-05-24 18:22:00'),
    ('greenwood-academy', 'Database Design Principles',   'Assignment 1: ER Diagram Submission',      'olivia.brown@greenwood-academy.test',   'Submitted ER diagram for a library management schema.', 95.0, '2026-05-26 21:10:00'),
    ('greenwood-academy', 'Introduction to Algorithms',   'Assignment 1: Big-O Analysis',            'noah.davis@greenwood-academy.test',     'Submitted complexity analysis with annotated pseudocode.', 78.5, '2026-05-20 10:15:00'),
    ('greenwood-academy', 'Modern Web Development',       'Assignment 1: REST API Design',            'noah.davis@greenwood-academy.test',     'Submitted REST API design proposal for a bookstore service.', NULL, '2026-05-25 23:40:00'),
    ('greenwood-academy', 'Data Structures Fundamentals', 'Assignment 1: Linked List Implementation','ava.wilson@greenwood-academy.test',     'Submitted linked list code with full unit test coverage.', 97.0, '2026-05-21 14:05:00'),
    ('greenwood-academy', 'Database Design Principles',   'Assignment 1: ER Diagram Submission',      'ava.wilson@greenwood-academy.test',     'Submitted normalized ER diagram with cardinality notation.', 89.5, '2026-05-27 09:30:00'),
    ('greenwood-academy', 'Introduction to Algorithms',   'Assignment 1: Big-O Analysis',            'liam.taylor@greenwood-academy.test',    'Submitted Big-O comparison table for searching algorithms.', 83.0, '2026-05-20 19:55:00'),
    ('greenwood-academy', 'Database Design Principles',   'Assignment 1: ER Diagram Submission',      'liam.taylor@greenwood-academy.test',    'Submitted ER diagram draft for a course catalog system.', NULL, '2026-05-27 22:48:00'),

    -- Blue Ridge Institute
    ('blue-ridge-institute', 'Calculus I',                'Assignment 1: Limits and Continuity',       'sophia.martinez@blue-ridge-institute.test','Submitted worked solutions for all limit problems.', 92.0, '2026-05-17 15:20:00'),
    ('blue-ridge-institute', 'Linear Algebra Essentials', 'Assignment 1: Matrix Operations',           'sophia.martinez@blue-ridge-institute.test','Submitted matrix multiplication and inverse exercises.', 85.5, '2026-05-20 17:45:00'),
    ('blue-ridge-institute', 'Organic Chemistry Basics',  'Assignment 1: Nomenclature Worksheet',      'ethan.clark@blue-ridge-institute.test',    'Submitted IUPAC naming worksheet for 20 compounds.', NULL, '2026-05-23 13:10:00'),
    ('blue-ridge-institute', 'General Physics',           'Assignment 1: Kinematics Problem Set',      'ethan.clark@blue-ridge-institute.test',    'Submitted kinematics problem set with full derivations.', 76.0, '2026-05-25 20:30:00'),
    ('blue-ridge-institute', 'Calculus I',                'Assignment 1: Limits and Continuity',       'mia.lewis@blue-ridge-institute.test',      'Submitted limits worksheet with epsilon-delta proofs.', 94.5, '2026-05-17 11:00:00'),
    ('blue-ridge-institute', 'Organic Chemistry Basics',  'Assignment 1: Nomenclature Worksheet',      'mia.lewis@blue-ridge-institute.test',      'Submitted nomenclature worksheet covering alkanes through esters.', 90.0, '2026-05-23 16:50:00'),
    ('blue-ridge-institute', 'Linear Algebra Essentials', 'Assignment 1: Matrix Operations',           'lucas.young@blue-ridge-institute.test',    'Submitted matrix operations problem set.', NULL, '2026-05-20 21:15:00'),
    ('blue-ridge-institute', 'General Physics',           'Assignment 1: Kinematics Problem Set',      'lucas.young@blue-ridge-institute.test',    'Submitted kinematics lab report with motion graphs.', 81.5, '2026-05-25 18:05:00'),
    ('blue-ridge-institute', 'Calculus I',                'Assignment 1: Limits and Continuity',       'isabella.king@blue-ridge-institute.test',  'Submitted continuity proofs and limit calculations.', 87.0, '2026-05-17 22:40:00'),
    ('blue-ridge-institute', 'General Physics',           'Assignment 1: Kinematics Problem Set',      'isabella.king@blue-ridge-institute.test',  'Submitted kinematics problem set with diagrams.', NULL, '2026-05-26 08:25:00'),

    -- Lighthouse Online School
    ('lighthouse-online', 'Digital Marketing Strategy',   'Assignment 1: Audience Persona Report',     'benjamin.hill@lighthouse-online.test',  'Submitted audience persona report with three sample personas.', 86.5, '2026-05-18 19:00:00'),
    ('lighthouse-online', 'Creative Writing Workshop',    'Assignment 1: Short Story Draft',           'benjamin.hill@lighthouse-online.test',  'Submitted 1,500-word short story draft.', 79.0, '2026-05-27 23:55:00'),
    ('lighthouse-online', 'Business Analytics',           'Assignment 1: KPI Dashboard Draft',          'chloe.baker@lighthouse-online.test',    'Submitted KPI dashboard mockup with metric definitions.', NULL, '2026-05-22 17:30:00'),
    ('lighthouse-online', 'World History Survey',         'Assignment 1: Civilization Comparison Essay','chloe.baker@lighthouse-online.test',    'Submitted comparison essay on Mesopotamia and the Indus Valley.', 93.0, '2026-05-29 14:20:00'),
    ('lighthouse-online', 'Digital Marketing Strategy',   'Assignment 1: Audience Persona Report',     'henry.green@lighthouse-online.test',    'Submitted audience persona report focused on Gen Z segments.', 90.5, '2026-05-18 12:10:00'),
    ('lighthouse-online', 'Business Analytics',           'Assignment 1: KPI Dashboard Draft',          'henry.green@lighthouse-online.test',    'Submitted KPI dashboard draft with sample SQL queries.', 84.0, '2026-05-22 21:05:00'),
    ('lighthouse-online', 'Creative Writing Workshop',    'Assignment 1: Short Story Draft',           'zoe.campbell@lighthouse-online.test',   'Submitted short story draft exploring a coastal town setting.', NULL, '2026-05-28 10:45:00'),
    ('lighthouse-online', 'World History Survey',         'Assignment 1: Civilization Comparison Essay','zoe.campbell@lighthouse-online.test',   'Submitted comparison essay on ancient Egypt and Nubia.', 88.5, '2026-05-29 19:35:00'),
    ('lighthouse-online', 'Digital Marketing Strategy',   'Assignment 1: Audience Persona Report',     'jack.mitchell@lighthouse-online.test',  'Submitted audience persona report with channel recommendations.', 77.5, '2026-05-19 09:50:00'),
    ('lighthouse-online', 'World History Survey',         'Assignment 1: Civilization Comparison Essay','jack.mitchell@lighthouse-online.test',  'Submitted comparison essay draft, still missing the conclusion.', NULL, '2026-05-30 23:10:00')
) AS v(slug, course_title, assignment_title, student_email, content, grade, submitted_at)
JOIN tenants t ON t.slug = v.slug
JOIN courses c ON c.title = v.course_title AND c.tenant_id = t.id
JOIN assignments a ON a.title = v.assignment_title AND a.course_id = c.id
JOIN users s ON s.email = v.student_email;
