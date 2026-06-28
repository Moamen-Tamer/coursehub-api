-- Seed data: tenants
-- 3 independent organizations sharing the same schema (multi-tenant isolation via RLS)

INSERT INTO tenants (name, slug) VALUES
('Greenwood Academy',       'greenwood-academy'),
('Blue Ridge Institute',    'blue-ridge-institute'),
('Lighthouse Online School','lighthouse-online');
