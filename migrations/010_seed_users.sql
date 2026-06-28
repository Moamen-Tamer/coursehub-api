-- Seed data: users
-- 1 admin + 2 instructors + 5 students per tenant = 8 users x 3 tenants = 24 rows
-- Greenwood Academy: user12345 | Blue Ridge Institute: user54321 | Lighthouse Online School: user00000
-- Looked up by tenant slug so this works regardless of the actual generated tenant ids.

INSERT INTO users (tenant_id, first_name, last_name, email, password_hash, role)
SELECT t.id, v.first_name, v.last_name, v.email, v.password_hash, v.role
FROM (VALUES
    -- Greenwood Academy
    ('greenwood-academy', 'Sarah',  'Mitchell', 'sarah.mitchell@greenwood-academy.test', '$2a$10$jS6sY7.cM4HxJdIpBgSvQOI6weQ2iVis0qM7SNn.9by.48wfpwCf2', 'admin'),
    ('greenwood-academy', 'David',  'Chen',     'david.chen@greenwood-academy.test',     '$2a$10$jS6sY7.cM4HxJdIpBgSvQOI6weQ2iVis0qM7SNn.9by.48wfpwCf2', 'instructor'),
    ('greenwood-academy', 'Emily',  'Rodriguez','emily.rodriguez@greenwood-academy.test','$2a$10$jS6sY7.cM4HxJdIpBgSvQOI6weQ2iVis0qM7SNn.9by.48wfpwCf2', 'instructor'),
    ('greenwood-academy', 'James',  'Walker',   'james.walker@greenwood-academy.test',   '$2a$10$jS6sY7.cM4HxJdIpBgSvQOI6weQ2iVis0qM7SNn.9by.48wfpwCf2', 'student'),
    ('greenwood-academy', 'Olivia', 'Brown',    'olivia.brown@greenwood-academy.test',   '$2a$10$jS6sY7.cM4HxJdIpBgSvQOI6weQ2iVis0qM7SNn.9by.48wfpwCf2', 'student'),
    ('greenwood-academy', 'Noah',   'Davis',    'noah.davis@greenwood-academy.test',     '$2a$10$jS6sY7.cM4HxJdIpBgSvQOI6weQ2iVis0qM7SNn.9by.48wfpwCf2',  'student'),
    ('greenwood-academy', 'Ava',    'Wilson',   'ava.wilson@greenwood-academy.test',     '$2a$10$jS6sY7.cM4HxJdIpBgSvQOI6weQ2iVis0qM7SNn.9by.48wfpwCf2',  'student'),
    ('greenwood-academy', 'Liam',   'Taylor',   'liam.taylor@greenwood-academy.test',    '$2a$10$jS6sY7.cM4HxJdIpBgSvQOI6weQ2iVis0qM7SNn.9by.48wfpwCf2',  'student'),

    -- Blue Ridge Institute
    ('blue-ridge-institute', 'Michael',  'Foster',  'michael.foster@blue-ridge-institute.test',  '$2a$10$JWp8ablXochzO1p7XUlsSeCKOv/5lhrF.WZQCnoSodreSWIllftZ.', 'admin'),
    ('blue-ridge-institute', 'Laura',    'Bennett', 'laura.bennett@blue-ridge-institute.test',   '$2a$10$JWp8ablXochzO1p7XUlsSeCKOv/5lhrF.WZQCnoSodreSWIllftZ.',  'instructor'),
    ('blue-ridge-institute', 'Kevin',    'Park',    'kevin.park@blue-ridge-institute.test',      '$2a$10$JWp8ablXochzO1p7XUlsSeCKOv/5lhrF.WZQCnoSodreSWIllftZ.', 'instructor'),
    ('blue-ridge-institute', 'Sophia',   'Martinez','sophia.martinez@blue-ridge-institute.test', '$2a$10$JWp8ablXochzO1p7XUlsSeCKOv/5lhrF.WZQCnoSodreSWIllftZ.','student'),
    ('blue-ridge-institute', 'Ethan',    'Clark',   'ethan.clark@blue-ridge-institute.test',     '$2a$10$JWp8ablXochzO1p7XUlsSeCKOv/5lhrF.WZQCnoSodreSWIllftZ.',  'student'),
    ('blue-ridge-institute', 'Mia',      'Lewis',   'mia.lewis@blue-ridge-institute.test',       '$2a$10$JWp8ablXochzO1p7XUlsSeCKOv/5lhrF.WZQCnoSodreSWIllftZ.',   'student'),
    ('blue-ridge-institute', 'Lucas',    'Young',   'lucas.young@blue-ridge-institute.test',     '$2a$10$JWp8ablXochzO1p7XUlsSeCKOv/5lhrF.WZQCnoSodreSWIllftZ.',  'student'),
    ('blue-ridge-institute', 'Isabella', 'King',    'isabella.king@blue-ridge-institute.test',   '$2a$10$JWp8ablXochzO1p7XUlsSeCKOv/5lhrF.WZQCnoSodreSWIllftZ.',   'student'),

    -- Lighthouse Online School
    ('lighthouse-online', 'Rachel',   'Adams',    'rachel.adams@lighthouse-online.test',   '$2a$10$mNx.k14nf/mXZlcpS9OG3.ivKO8yuiCYnCFVVLMZXzkMSYMrIjl.i', 'admin'),
    ('lighthouse-online', 'Daniel',   'Scott',    'daniel.scott@lighthouse-online.test',   '$2a$10$mNx.k14nf/mXZlcpS9OG3.ivKO8yuiCYnCFVVLMZXzkMSYMrIjl.i', 'instructor'),
    ('lighthouse-online', 'Grace',    'Turner',   'grace.turner@lighthouse-online.test',   '$2a$10$mNx.k14nf/mXZlcpS9OG3.ivKO8yuiCYnCFVVLMZXzkMSYMrIjl.i', 'instructor'),
    ('lighthouse-online', 'Benjamin', 'Hill',     'benjamin.hill@lighthouse-online.test',  '$2a$10$mNx.k14nf/mXZlcpS9OG3.ivKO8yuiCYnCFVVLMZXzkMSYMrIjl.i', 'student'),
    ('lighthouse-online', 'Chloe',    'Baker',    'chloe.baker@lighthouse-online.test',    '$2a$10$mNx.k14nf/mXZlcpS9OG3.ivKO8yuiCYnCFVVLMZXzkMSYMrIjl.i',  'student'),
    ('lighthouse-online', 'Henry',    'Green',    'henry.green@lighthouse-online.test',    '$2a$10$mNx.k14nf/mXZlcpS9OG3.ivKO8yuiCYnCFVVLMZXzkMSYMrIjl.i',  'student'),
    ('lighthouse-online', 'Zoe',      'Campbell', 'zoe.campbell@lighthouse-online.test',   '$2a$10$mNx.k14nf/mXZlcpS9OG3.ivKO8yuiCYnCFVVLMZXzkMSYMrIjl.i',  'student'),
    ('lighthouse-online', 'Jack',     'Mitchell', 'jack.mitchell@lighthouse-online.test',  '$2a$10$mNx.k14nf/mXZlcpS9OG3.ivKO8yuiCYnCFVVLMZXzkMSYMrIjl.i', 'student')
) AS v(slug, first_name, last_name, email, password_hash, role)
JOIN tenants t ON t.slug = v.slug;
