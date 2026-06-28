-- Seed data: courses
-- 2 courses per instructor = 4 courses per tenant x 3 tenants = 12 rows
-- Looked up by tenant slug + instructor email so this doesn't depend on generated ids.

INSERT INTO courses (tenant_id, instructor_id, title, description)
SELECT t.id, instr.id, v.title, v.description
FROM (VALUES
    -- Greenwood Academy — David Chen
    ('greenwood-academy', 'david.chen@greenwood-academy.test', 'Introduction to Algorithms',
        'Foundational algorithmic thinking: complexity analysis, recursion, and classic problem-solving patterns.'),
    ('greenwood-academy', 'david.chen@greenwood-academy.test', 'Data Structures Fundamentals',
        'Arrays, linked lists, trees, hash maps, and graphs, with an emphasis on practical implementation.'),
    -- Greenwood Academy — Emily Rodriguez
    ('greenwood-academy', 'emily.rodriguez@greenwood-academy.test', 'Modern Web Development',
        'Building full-stack web applications with REST APIs, authentication, and client-server architecture.'),
    ('greenwood-academy', 'emily.rodriguez@greenwood-academy.test', 'Database Design Principles',
        'Relational modeling, normalization, indexing strategy, and transaction fundamentals.'),

    -- Blue Ridge Institute — Laura Bennett
    ('blue-ridge-institute', 'laura.bennett@blue-ridge-institute.test', 'Calculus I',
        'Limits, derivatives, and an introduction to integral calculus with applied problem sets.'),
    ('blue-ridge-institute', 'laura.bennett@blue-ridge-institute.test', 'Linear Algebra Essentials',
        'Vectors, matrices, eigenvalues, and their applications in computing and engineering.'),
    -- Blue Ridge Institute — Kevin Park
    ('blue-ridge-institute', 'kevin.park@blue-ridge-institute.test', 'Organic Chemistry Basics',
        'Structure, nomenclature, and reactivity of organic compounds for first-year science students.'),
    ('blue-ridge-institute', 'kevin.park@blue-ridge-institute.test', 'General Physics',
        'Mechanics, energy, and waves, covered through lectures and hands-on lab experiments.'),

    -- Lighthouse Online School — Daniel Scott
    ('lighthouse-online', 'daniel.scott@lighthouse-online.test', 'Digital Marketing Strategy',
        'Campaign planning, audience segmentation, and channel strategy for online marketing.'),
    ('lighthouse-online', 'daniel.scott@lighthouse-online.test', 'Business Analytics',
        'Using data to drive business decisions, covering reporting, KPIs, and basic statistical analysis.'),
    -- Lighthouse Online School — Grace Turner
    ('lighthouse-online', 'grace.turner@lighthouse-online.test', 'Creative Writing Workshop',
        'Short fiction and personal essay craft, with weekly peer-reviewed writing exercises.'),
    ('lighthouse-online', 'grace.turner@lighthouse-online.test', 'World History Survey',
        'A broad survey of major civilizations and turning points from antiquity to the modern era.')
) AS v(slug, instructor_email, title, description)
JOIN tenants t ON t.slug = v.slug
JOIN users instr ON instr.email = v.instructor_email;
