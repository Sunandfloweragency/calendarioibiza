-- Sun & Flower Ibiza Calendar - Import Completo
-- Base de datos: u242834448_nuevoibiza
-- Generado: 4/6/2025, 20:49:26
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


-- Sun & Flower Ibiza Calendar - Base de Datos MySQL
-- Base de datos: u242834448_nuevoibiza
-- Usuario: u242834448_adminSF

USE u242834448_nuevoibiza;

-- Eliminar tablas si existen (orden inverso por dependencias)
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS promoters;
DROP TABLE IF EXISTS djs;
DROP TABLE IF EXISTS clubs;
DROP TABLE IF EXISTS users;

-- Tabla: users
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    name VARCHAR(255),
    password_hash VARCHAR(255),
    role ENUM('USER', 'MODERATOR', 'ADMIN') DEFAULT 'USER',
    is_banned BOOLEAN DEFAULT FALSE,
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

-- Datos para users
INSERT INTO users (id, username, email, password_hash, name, country, user_profile_type, role, is_banned, registration_date, accepted_terms_date, created_at, updated_at) VALUES ('1749062966115-qdltrd5g5', 'AdminBassse', 'admin@sunflower.ibiza', '$2a$06$jXahNJijgdgonj024rcfbuAM3nKjL2nW516QxQrsTfYzVf3rvsm.2', 'Admin Bassse', 'Spain', 'promoter', 'admin', 'false', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00');

-- Datos para clubs
INSERT INTO clubs (id, name, slug, description, location, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-sd9wk9msg', 'Amnesia Ibiza', 'amnesia-ibiza', 'Legendario superclub de Ibiza con múltiples salas y amaneceres en la terraza.', 'Carretera Ibiza a San Antonio, Km 5, 07816 Ibiza', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00');
INSERT INTO clubs (id, name, slug, description, location, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-64gxqkfns', 'Pacha Ibiza', 'pacha-ibiza', 'Discoteca de renombre mundial, una institución en Ibiza con su icónico logo de cerezas.', 'Av. 8 d\'Agost, 07800 Eivissa, Illes Balears', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00');
INSERT INTO clubs (id, name, slug, description, location, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-tl6181n08', 'Hï Ibiza', 'hi-ibiza', 'Superclub vanguardista en Playa d\'en Bossa, conocido por su producción inmersiva.', 'Platja d\'en Bossa, 07817 Sant Josep de sa Talaia', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00');
INSERT INTO clubs (id, name, slug, description, location, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-cz7o2g1hn', 'Ushuaïa Ibiza Beach Hotel', 'ushuaia-ibiza', 'Hotel de playa icónico que alberga fiestas diurnas masivas con los DJs más grandes del mundo.', 'Platja d\'en Bossa, 10, 07817 Sant Josep de sa Talaia', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00');
INSERT INTO clubs (id, name, slug, description, location, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-qkvxy6bvp', 'DC-10', 'dc10', 'Club underground legendario conocido por sus fiestas Circoloco y su ambiente crudo.', 'Carretera las Salinas, km 1, 07818 Sant Josep de sa Talaia', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00');
INSERT INTO clubs (id, name, slug, description, location, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-tgd9ep38c', 'Eden Ibiza', 'eden-ibiza', 'Superclub revitalizado en San Antonio con un potente sistema de sonido y noches de diversos géneros.', 'Carrer Salvador Espriu, s/n, 07820 Sant Antoni de Portmany', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00');
INSERT INTO clubs (id, name, slug, description, location, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-75miga0wk', 'Hï Ibiza', 'h-ibiza', 'Modern superclub with cutting-edge sound', 'Platja d\'en Bossa', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:22.48905+00:00', '2025-06-04T18:34:22.48905+00:00');
INSERT INTO clubs (id, name, slug, description, location, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-pofl4wqv6', 'Ushuaïa Ibiza', 'ushuaa-ibiza', 'Open-air club and hotel', 'Platja d\'en Bossa', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:22.558195+00:00', '2025-06-04T18:34:22.558195+00:00');
INSERT INTO clubs (id, name, slug, description, location, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-wxd1rieo0', 'DC-10', 'dc-10', 'Underground club famous for Circoloco', 'Aeropuerto de Ibiza', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:22.621488+00:00', '2025-06-04T18:34:22.621488+00:00');
INSERT INTO clubs (id, name, slug, description, location, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-7fa96glj7', 'Privilege Ibiza', 'privilege-ibiza', 'World\'s largest nightclub', 'Urbanització San Rafael', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:22.762618+00:00', '2025-06-04T18:34:22.762618+00:00');
INSERT INTO clubs (id, name, slug, description, location, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-cqewdohki', 'Es Paradis', 'es-paradis', 'Pyramid-shaped club in San Antonio', 'Carrer Salvador Espriu, San Antonio', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:22.828969+00:00', '2025-06-04T18:34:22.828969+00:00');
INSERT INTO clubs (id, name, slug, description, location, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-yffy1sf4d', 'Café Mambo', 'caf-mambo', 'Famous sunset bar', 'Carrer de Vara del Rey, San Antonio', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:22.894879+00:00', '2025-06-04T18:34:22.894879+00:00');
INSERT INTO clubs (id, name, slug, description, location, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-3bq4r2n8j', 'Café del Mar', 'caf-del-mar', 'Legendary sunset spot', 'Carrer de Vara del Rey, San Antonio', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:22.960375+00:00', '2025-06-04T18:34:22.960375+00:00');

-- Datos para djs
INSERT INTO djs (id, name, slug, description, genre, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-25b5zodc8', 'David Guetta', 'david-guetta', 'DJ y productor francés, uno de los más influyentes de la música electrónica mundial.', 'House, EDM', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00');
INSERT INTO djs (id, name, slug, description, genre, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-xexqcx86b', 'Martin Garrix', 'martin-garrix', 'DJ y productor holandés, uno de los más jóvenes en alcanzar el #1 mundial.', 'Progressive House, EDM', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00');
INSERT INTO djs (id, name, slug, description, genre, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-l8f89pfeq', 'Solomun', 'solomun', 'DJ y productor alemán, maestro del deep house y residente de Pacha Ibiza.', 'Deep House, Melodic Techno', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00');
INSERT INTO djs (id, name, slug, description, genre, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-wp0r77452', 'Carl Cox', 'carl-cox', 'DJ británico, leyenda del techno y house, rey de Ibiza.', 'Techno, House', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00');
INSERT INTO djs (id, name, slug, description, genre, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-0ripitzr1', 'Marco Carola', 'marco-carola', 'DJ y productor italiano, maestro del techno minimal.', 'Techno, Minimal', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00');
INSERT INTO djs (id, name, slug, description, genre, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-erpgwy0w9', 'Black Coffee', 'black-coffee', 'DJ y productor sudafricano, pionero del house africano.', 'Afro House, Deep House', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00');
INSERT INTO djs (id, name, slug, description, genre, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-w4d5ljkw2', 'Tale of Us', 'tale-of-us', 'Italian electronic music duo', 'Melodic Techno', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:23.450724+00:00', '2025-06-04T18:34:23.450724+00:00');
INSERT INTO djs (id, name, slug, description, genre, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-wk55mzl1u', 'Jamie Jones', 'jamie-jones', 'British DJ and Paradise founder', 'Tech House', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:23.517623+00:00', '2025-06-04T18:34:23.517623+00:00');
INSERT INTO djs (id, name, slug, description, genre, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-t3hrplw53', 'Luciano', 'luciano', 'Swiss-Chilean DJ', 'Deep House, Minimal', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:23.581363+00:00', '2025-06-04T18:34:23.581363+00:00');
INSERT INTO djs (id, name, slug, description, genre, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-e49oesvgv', 'Hot Since 82', 'hot-since-82', 'British house music producer', 'Tech House', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:23.643949+00:00', '2025-06-04T18:34:23.643949+00:00');

-- Datos para promoters
INSERT INTO promoters (id, name, slug, description, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-bae3tw8dr', 'Elrow', 'elrow', 'Marca de fiestas española conocida por sus espectáculos coloridos y creativos.', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00');
INSERT INTO promoters (id, name, slug, description, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-l939ok9ga', 'Circoloco', 'circoloco', 'Legendaria marca de fiestas underground de DC-10.', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00');
INSERT INTO promoters (id, name, slug, description, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-q0pvq6ouz', 'ABODE', 'abode', 'Promotora británica especializada en house y techno.', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00');
INSERT INTO promoters (id, name, slug, description, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-wjp19a1im', 'Defected', 'defected', 'Sello discográfico y promotora especializada en house music.', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00');
INSERT INTO promoters (id, name, slug, description, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-hzdsboakn', 'Music On', 'music-on', 'Marco Carola\'s event series', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:23.847225+00:00', '2025-06-04T18:34:23.847225+00:00');
INSERT INTO promoters (id, name, slug, description, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-whmze5tce', 'Paradise', 'paradise', 'Jamie Jones\' party concept', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:23.919156+00:00', '2025-06-04T18:34:23.919156+00:00');
INSERT INTO promoters (id, name, slug, description, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-u2gw4wpsn', 'Pyramid', 'pyramid', 'Amnesia\'s techno night', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:23.987296+00:00', '2025-06-04T18:34:23.987296+00:00');
INSERT INTO promoters (id, name, slug, description, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-ji418om66', 'ANTS', 'ants', 'Ushuaïa\'s signature event series', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:24.054723+00:00', '2025-06-04T18:34:24.054723+00:00');
INSERT INTO promoters (id, name, slug, description, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-0dxy1xx3o', 'Afterlife', 'afterlife', 'Tale of Us melodic techno experience', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:24.186427+00:00', '2025-06-04T18:34:24.186427+00:00');
INSERT INTO promoters (id, name, slug, description, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-g2atm8lds', 'Solid Grooves', 'solid-grooves', 'Underground house and techno', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:24.265494+00:00', '2025-06-04T18:34:24.265494+00:00');
INSERT INTO promoters (id, name, slug, description, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-02zjcrk62', 'FUSE', 'fuse', 'Belgian techno collective', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:24.340537+00:00', '2025-06-04T18:34:24.340537+00:00');

-- Datos para events
INSERT INTO events (id, name, slug, description, date, time, price, club_id, dj_ids, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-anskg30ml', 'David Guetta Live', 'david-guetta-live-ushuaia', 'El rey del EDM regresa a Ushuaïa para una noche épica.', '2025-07-15', '20:00', '€80', 'c97a637c-ec80-4f5e-abf4-7b161fd6f07b', '[]', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00');
INSERT INTO events (id, name, slug, description, date, time, price, club_id, dj_ids, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-d5xrdwfa5', 'Solomun +1', 'solomun-plus-one-pacha', 'La legendaria fiesta de Solomun en la terraza de Pacha.', '2025-08-02', '23:00', '€60', '91835fbf-86dd-4114-9673-297b6217d55c', '[]', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00');
INSERT INTO events (id, name, slug, description, date, time, price, club_id, dj_ids, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-0yuaqpnzx', 'Circoloco', 'circoloco-dc10', 'La fiesta underground más auténtica de Ibiza.', '2025-07-28', '16:00', '€45', '11ac9325-d37c-447f-b1aa-75342fe1fad3', '[]', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00');
INSERT INTO events (id, name, slug, description, date, time, price, club_id, dj_ids, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-l28mauvuy', 'Martin Garrix Presents STMPD', 'martin-garrix-stmpd-hi', 'El fenómeno holandés trae su sello a Hï Ibiza.', '2025-08-10', '23:00', '€70', 'ba3b24e3-1b37-48fa-8728-ec22b8ce20ab', '[]', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00');
INSERT INTO events (id, name, slug, description, date, time, price, club_id, dj_ids, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-9n5heskfm', 'Pyramid at Amnesia', 'pyramid-amnesia', 'La noche de trance más épica de Ibiza.', '2025-07-22', '23:00', '€55', 'e8a6e495-097b-4de9-a794-4d4a0124bc23', '[]', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00');
INSERT INTO events (id, name, slug, description, date, time, price, event_type, dj_ids, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-azt9p1ox9', 'David Guetta F*** Me I\'m Famous', 'david-guetta-f-me-im-famous', 'David Guetta\'s legendary Pacha residency', '2025-07-15', '23:00', '50€', 'club', '[]', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:24.434786+00:00', '2025-06-04T18:34:24.434786+00:00');
INSERT INTO events (id, name, slug, description, date, time, price, event_type, dj_ids, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-iw9rhcez1', 'Solomun +1 at Pacha', 'solomun-1-at-pacha', 'Intimate sets by Solomun and special guests', '2025-08-02', '23:30', '45€', 'club', '[]', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:24.498605+00:00', '2025-06-04T18:34:24.498605+00:00');
INSERT INTO events (id, name, slug, description, date, time, price, event_type, dj_ids, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-itkbvjmpr', 'Circoloco at DC-10', 'circoloco-at-dc-10', 'Monday madness at the legendary DC-10', '2025-07-28', '16:00', '40€', 'underground', '[]', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:24.56329+00:00', '2025-06-04T18:34:24.56329+00:00');
INSERT INTO events (id, name, slug, description, date, time, price, event_type, dj_ids, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-le5tw0eqi', 'ANTS at Ushuaïa', 'ants-at-ushuaa', 'The worker ants take over Ushuaïa', '2025-08-10', '17:00', '60€', 'pool', '[]', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:24.674631+00:00', '2025-06-04T18:34:24.674631+00:00');
INSERT INTO events (id, name, slug, description, date, time, price, event_type, dj_ids, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-wsmh55rsj', 'Pyramid at Amnesia', 'pyramid-at-amnesia', 'Techno titans at the legendary pyramid room', '2025-07-22', '24:00', '35€', 'club', '[]', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:24.742879+00:00', '2025-06-04T18:34:24.742879+00:00');
INSERT INTO events (id, name, slug, description, date, time, price, event_type, dj_ids, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-dmy5nbkfo', 'Afterlife presents Tale of Us', 'afterlife-presents-tale-of-us', 'Melodic techno journey at Privilege', '2025-08-15', '23:00', '55€', 'club', '[]', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:24.815466+00:00', '2025-06-04T18:34:24.815466+00:00');
INSERT INTO events (id, name, slug, description, date, time, price, event_type, dj_ids, social_links, status, submitted_by, created_at, updated_at) VALUES ('1749062966115-spxjdqw68', 'Solid Grooves Pool Party', 'solid-grooves-pool-party', 'Underground vibes at Ushuaïa', '2025-07-30', '16:00', '45€', 'pool', '[]', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:24.904196+00:00', '2025-06-04T18:34:24.904196+00:00');

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
