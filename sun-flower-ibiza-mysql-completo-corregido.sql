-- Sun & Flower Ibiza Calendar - Import Completo CORREGIDO
-- Base de datos: u242834448_nuevoibiza
-- Generado: 04/06/2025 20:55:00
-- 
-- INSTRUCCIONES DE IMPORTACIÓN:
-- 1. Ir a: https://auth-db1507.hstgr.io/index.php
-- 2. Login: info@sunandfloweragency.com / Agency2024.
-- 3. Seleccionar base de datos: u242834448_nuevoibiza
-- 4. Ir a "Importar" y seleccionar este archivo
-- 5. Ejecutar importación

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

USE u242834448_nuevoibiza;

-- Eliminar tablas si existen (orden inverso por dependencias)
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS promoters;
DROP TABLE IF EXISTS djs;
DROP TABLE IF EXISTS clubs;
DROP TABLE IF EXISTS users;

-- Tabla: users (ESTRUCTURA CORREGIDA)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(255),
    country VARCHAR(100),
    user_profile_type ENUM('user', 'promoter', 'club', 'dj', 'admin') DEFAULT 'user',
    role ENUM('USER', 'MODERATOR', 'ADMIN') DEFAULT 'USER',
    is_banned BOOLEAN DEFAULT FALSE,
    registration_date TIMESTAMP NULL,
    accepted_terms_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla: clubs
CREATE TABLE clubs (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    location VARCHAR(255),
    image_url VARCHAR(500),
    capacity INT,
    social_links JSON,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
    submitted_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_slug (slug)
);

-- Tabla: djs
CREATE TABLE djs (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    genre VARCHAR(255),
    social_links JSON,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
    submitted_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_slug (slug),
    INDEX idx_genre (genre)
);

-- Tabla: promoters
CREATE TABLE promoters (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    social_links JSON,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
    submitted_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_slug (slug)
);

-- Tabla: events
CREATE TABLE events (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME,
    price VARCHAR(50),
    image_url VARCHAR(500),
    event_type VARCHAR(100),
    club_id VARCHAR(36),
    promoter_id VARCHAR(36),
    dj_ids JSON,
    social_links JSON,
    original_source_url VARCHAR(500),
    import_notes TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
    submitted_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date),
    INDEX idx_status (status),
    INDEX idx_club (club_id),
    INDEX idx_promoter (promoter_id),
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL,
    FOREIGN KEY (promoter_id) REFERENCES promoters(id) ON DELETE SET NULL
);

-- Insertar datos

-- Datos para users (CORREGIDO)
INSERT INTO users (id, username, email, password_hash, name, country, user_profile_type, role, is_banned, registration_date, accepted_terms_date, created_at, updated_at) VALUES ('1749062966115-qdltrd5g5', 'AdminBassse', 'admin@sunflower.ibiza', '$2a$06$jXahNJijgdgonj024rcfbuAM3nKjL2nW516QxQrsTfYzVf3rvsm.2', 'Admin Bassse', 'Spain', 'admin', 'ADMIN', false, '2025-05-29 03:50:33', '2025-05-29 03:50:33', '2025-05-29 03:50:33', '2025-05-29 03:50:33');

-- Usuario CMS actualizado con nuevas credenciales
INSERT INTO users (id, username, email, password_hash, name, country, user_profile_type, role, is_banned, registration_date, accepted_terms_date, created_at, updated_at) VALUES ('admin-sunflower-cms', 'AdminSF', 'AdminSF', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin Sun Flower', 'Spain', 'admin', 'ADMIN', false, NOW(), NOW(), NOW(), NOW());

-- Datos para clubs
INSERT INTO clubs (id, name, slug, description, location, image_url, capacity, social_links, status, submitted_by, created_at, updated_at) VALUES ('club-001', 'Pacha Ibiza', 'pacha-ibiza', 'Legendary club in Ibiza, operating since 1973', 'Avenida 8 de Agosto, Ibiza', 'https://example.com/pacha.jpg', 3000, '{"instagram": "@pachaibiza", "website": "https://pacha.com"}', 'approved', 'admin-sunflower-cms', NOW(), NOW());

INSERT INTO clubs (id, name, slug, description, location, image_url, capacity, social_links, status, submitted_by, created_at, updated_at) VALUES ('club-002', 'Amnesia Ibiza', 'amnesia-ibiza', 'World famous superclub with amazing sound system', 'Carretera Ibiza-San Antonio, Km 5', 'https://example.com/amnesia.jpg', 5000, '{"instagram": "@amnesia_ibiza", "website": "https://amnesia.es"}', 'approved', 'admin-sunflower-cms', NOW(), NOW());

INSERT INTO clubs (id, name, slug, description, location, image_url, capacity, social_links, status, submitted_by, created_at, updated_at) VALUES ('club-003', 'Ushuaïa Ibiza', 'ushuaia-ibiza', 'Open-air club with world-class DJs', 'Platja d Es Codolar, Ibiza', 'https://example.com/ushuaia.jpg', 4000, '{"instagram": "@ushuaiaibiza", "website": "https://ushuaiaibiza.com"}', 'approved', 'admin-sunflower-cms', NOW(), NOW());

INSERT INTO clubs (id, name, slug, description, location, image_url, capacity, social_links, status, submitted_by, created_at, updated_at) VALUES ('club-004', 'Hï Ibiza', 'hi-ibiza', 'Ultra-modern superclub with cutting-edge technology', 'Platja d Es Codolar, Ibiza', 'https://example.com/hi-ibiza.jpg', 4500, '{"instagram": "@hiibiza", "website": "https://hiibiza.com"}', 'approved', 'admin-sunflower-cms', NOW(), NOW());

INSERT INTO clubs (id, name, slug, description, location, image_url, capacity, social_links, status, submitted_by, created_at, updated_at) VALUES ('club-005', 'DC10', 'dc10', 'Underground club loved by true house music fans', 'Carretera Salinas-Es Cavellet, Ibiza', 'https://example.com/dc10.jpg', 1500, '{"instagram": "@dc10ibiza", "website": "https://dc10ibiza.com"}', 'approved', 'admin-sunflower-cms', NOW(), NOW());

-- Datos para djs
INSERT INTO djs (id, name, slug, description, image_url, genre, social_links, status, submitted_by, created_at, updated_at) VALUES ('dj-001', 'David Guetta', 'david-guetta', 'French DJ and music producer, pioneer of electronic dance music', 'https://example.com/david-guetta.jpg', 'House, Electro', '{"instagram": "@davidguetta", "website": "https://davidguetta.com"}', 'approved', 'admin-sunflower-cms', NOW(), NOW());

INSERT INTO djs (id, name, slug, description, image_url, genre, social_links, status, submitted_by, created_at, updated_at) VALUES ('dj-002', 'Calvin Harris', 'calvin-harris', 'Scottish DJ, record producer and songwriter', 'https://example.com/calvin-harris.jpg', 'EDM, House', '{"instagram": "@calvinharris", "website": "https://calvinharris.com"}', 'approved', 'admin-sunflower-cms', NOW(), NOW());

INSERT INTO djs (id, name, slug, description, image_url, genre, social_links, status, submitted_by, created_at, updated_at) VALUES ('dj-003', 'Martin Garrix', 'martin-garrix', 'Dutch DJ and record producer, youngest DJ to headline Ultra Music Festival', 'https://example.com/martin-garrix.jpg', 'Progressive House, Future Bass', '{"instagram": "@martingarrix", "website": "https://martingarrix.com"}', 'approved', 'admin-sunflower-cms', NOW(), NOW());

INSERT INTO djs (id, name, slug, description, image_url, genre, social_links, status, submitted_by, created_at, updated_at) VALUES ('dj-004', 'Carl Cox', 'carl-cox', 'British house and techno DJ legend', 'https://example.com/carl-cox.jpg', 'Techno, House', '{"instagram": "@carlcoxofficial", "website": "https://carlcox.com"}', 'approved', 'admin-sunflower-cms', NOW(), NOW());

-- Datos para promoters
INSERT INTO promoters (id, name, slug, description, image_url, social_links, status, submitted_by, created_at, updated_at) VALUES ('promoter-001', 'Elrow', 'elrow', 'Colorful and creative party brand from Barcelona', 'https://example.com/elrow.jpg', '{"instagram": "@elrowofficial", "website": "https://elrow.com"}', 'approved', 'admin-sunflower-cms', NOW(), NOW());

INSERT INTO promoters (id, name, slug, description, image_url, social_links, status, submitted_by, created_at, updated_at) VALUES ('promoter-002', 'Cocoon', 'cocoon', 'Techno party series by Sven Väth', 'https://example.com/cocoon.jpg', '{"instagram": "@cocoonibiza", "website": "https://cocoon.net"}', 'approved', 'admin-sunflower-cms', NOW(), NOW());

INSERT INTO promoters (id, name, slug, description, image_url, social_links, status, submitted_by, created_at, updated_at) VALUES ('promoter-003', 'Music On', 'music-on', 'Marco Carola underground techno parties', 'https://example.com/music-on.jpg', '{"instagram": "@musiconofficial", "website": "https://music-on.it"}', 'approved', 'admin-sunflower-cms', NOW(), NOW());

-- Datos para events
INSERT INTO events (id, name, slug, description, date, time, price, image_url, event_type, club_id, promoter_id, dj_ids, social_links, status, submitted_by, created_at, updated_at) VALUES ('event-001', 'David Guetta at Ushuaïa', 'david-guetta-ushuaia-jun-2025', 'Epic summer opening with David Guetta', '2025-06-15', '18:00:00', '80-120€', 'https://example.com/guetta-ushuaia.jpg', 'Pool Party', 'club-003', 'promoter-001', '["dj-001"]', '{"instagram": "@ushuaiaibiza", "facebook": "UshuaiaIbiza"}', 'approved', 'admin-sunflower-cms', NOW(), NOW());

INSERT INTO events (id, name, slug, description, date, time, price, image_url, event_type, club_id, promoter_id, dj_ids, social_links, status, submitted_by, created_at, updated_at) VALUES ('event-002', 'Cocoon Opening Amnesia', 'cocoon-opening-amnesia-2025', 'Legendary Cocoon returns to Amnesia', '2025-06-20', '23:00:00', '50-70€', 'https://example.com/cocoon-amnesia.jpg', 'Club Night', 'club-002', 'promoter-002', '["dj-004"]', '{"instagram": "@amnesia_ibiza", "website": "https://cocoon.net"}', 'approved', 'admin-sunflower-cms', NOW(), NOW());

INSERT INTO events (id, name, slug, description, date, time, price, image_url, event_type, club_id, promoter_id, dj_ids, social_links, status, submitted_by, created_at, updated_at) VALUES ('event-003', 'Hï Ibiza Opening Party', 'hi-ibiza-opening-2025', 'Season opening with multiple DJs', '2025-06-01', '23:30:00', '60-90€', 'https://example.com/hi-opening.jpg', 'Club Night', 'club-004', NULL, '["dj-002", "dj-003"]', '{"instagram": "@hiibiza", "website": "https://hiibiza.com"}', 'approved', 'admin-sunflower-cms', NOW(), NOW());

-- Habilitar foreign keys
SET FOREIGN_KEY_CHECKS = 1;

-- Verificar datos insertados
SELECT 'users' as tabla, COUNT(*) as total FROM users
UNION ALL
SELECT 'clubs' as tabla, COUNT(*) as total FROM clubs
UNION ALL
SELECT 'djs' as tabla, COUNT(*) as total FROM djs
UNION ALL
SELECT 'promoters' as tabla, COUNT(*) as total FROM promoters
UNION ALL
SELECT 'events' as tabla, COUNT(*) as total FROM events;

-- USUARIOS DISPONIBLES DESPUÉS DE LA IMPORTACIÓN:
-- 1. admin@sunflower.ibiza / Hasheado (AdminBassse)
-- 2. AdminSF / admin123 (AdminSF)

-- Ambos usuarios tienen rol ADMIN y pueden acceder al CMS 