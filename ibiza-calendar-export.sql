-- =============================================
-- EXPORTACIÓN COMPLETA PARA IBIZA CALENDAR
-- Generado el: 2025-06-04T18:40:57.442Z
-- Base de datos destino: u242834448_ibiza
-- =============================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


-- =============================================
-- ESTRUCTURA DE TABLAS PARA IBIZA CALENDAR
-- Base de datos: u242834448_ibiza
-- =============================================

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `role` enum('USER','MODERATOR','ADMIN') DEFAULT 'USER',
  `is_banned` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_username_unique` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de clubs
CREATE TABLE IF NOT EXISTS `clubs` (
  `id` varchar(36) NOT NULL DEFAULT (UUID()),
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `location` varchar(255) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `social_links` json DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `submitted_by` varchar(36) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clubs_slug_unique` (`slug`),
  KEY `idx_clubs_slug` (`slug`),
  KEY `idx_clubs_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de DJs
CREATE TABLE IF NOT EXISTS `djs` (
  `id` varchar(36) NOT NULL DEFAULT (UUID()),
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `image_url` varchar(500) DEFAULT NULL,
  `genre` varchar(255) DEFAULT NULL,
  `social_links` json DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `submitted_by` varchar(36) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `djs_slug_unique` (`slug`),
  KEY `idx_djs_slug` (`slug`),
  KEY `idx_djs_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de promoters
CREATE TABLE IF NOT EXISTS `promoters` (
  `id` varchar(36) NOT NULL DEFAULT (UUID()),
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `image_url` varchar(500) DEFAULT NULL,
  `social_links` json DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `submitted_by` varchar(36) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `promoters_slug_unique` (`slug`),
  KEY `idx_promoters_slug` (`slug`),
  KEY `idx_promoters_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de eventos
CREATE TABLE IF NOT EXISTS `events` (
  `id` varchar(36) NOT NULL DEFAULT (UUID()),
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `date` date NOT NULL,
  `time` time DEFAULT NULL,
  `price` varchar(50) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `event_type` varchar(100) DEFAULT NULL,
  `club_id` varchar(36) DEFAULT NULL,
  `promoter_id` varchar(36) DEFAULT NULL,
  `dj_ids` json DEFAULT NULL,
  `social_links` json DEFAULT NULL,
  `original_source_url` varchar(500) DEFAULT NULL,
  `import_notes` text,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `submitted_by` varchar(36) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `events_slug_unique` (`slug`),
  KEY `idx_events_slug` (`slug`),
  KEY `idx_events_date` (`date`),
  KEY `idx_events_status` (`status`),
  KEY `idx_events_club_id` (`club_id`),
  KEY `idx_events_promoter_id` (`promoter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- DATOS PARA TABLA: USERS
-- =============================================

-- Insertar datos en users
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `name`, `country`, `preferred_styles`, `user_profile_type`, `role`, `is_banned`, `registration_date`, `accepted_terms_date`, `created_at`, `updated_at`) VALUES
('00000000-0000-0000-0000-000000000000', 'AdminBassse', 'admin@sunflower.ibiza', '$2a$06$jXahNJijgdgonj024rcfbuAM3nKjL2nW516QxQrsTfYzVf3rvsm.2', 'Admin Bassse', 'Spain', NULL, 'promoter', 'admin', 0, '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00')
ON DUPLICATE KEY UPDATE
`id` = VALUES(`id`),
`username` = VALUES(`username`),
`email` = VALUES(`email`),
`password_hash` = VALUES(`password_hash`),
`name` = VALUES(`name`),
`country` = VALUES(`country`),
`preferred_styles` = VALUES(`preferred_styles`),
`user_profile_type` = VALUES(`user_profile_type`),
`role` = VALUES(`role`),
`is_banned` = VALUES(`is_banned`),
`registration_date` = VALUES(`registration_date`),
`accepted_terms_date` = VALUES(`accepted_terms_date`),
`created_at` = VALUES(`created_at`),
`updated_at` = VALUES(`updated_at`);

-- =============================================
-- DATOS PARA TABLA: CLUBS
-- =============================================

-- Insertar datos en clubs
INSERT INTO `clubs` (`id`, `name`, `slug`, `description`, `location`, `image_url`, `capacity`, `social_links`, `status`, `submitted_by`, `created_at`, `updated_at`) VALUES
('e8a6e495-097b-4de9-a794-4d4a0124bc23', 'Amnesia Ibiza', 'amnesia-ibiza', 'Legendario superclub de Ibiza con múltiples salas y amaneceres en la terraza.', 'Carretera Ibiza a San Antonio, Km 5, 07816 Ibiza', NULL, NULL, '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00'),
('91835fbf-86dd-4114-9673-297b6217d55c', 'Pacha Ibiza', 'pacha-ibiza', 'Discoteca de renombre mundial, una institución en Ibiza con su icónico logo de cerezas.', 'Av. 8 d''Agost, 07800 Eivissa, Illes Balears', NULL, NULL, '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00'),
('ba3b24e3-1b37-48fa-8728-ec22b8ce20ab', 'Hï Ibiza', 'hi-ibiza', 'Superclub vanguardista en Playa d''en Bossa, conocido por su producción inmersiva.', 'Platja d''en Bossa, 07817 Sant Josep de sa Talaia', NULL, NULL, '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00'),
('c97a637c-ec80-4f5e-abf4-7b161fd6f07b', 'Ushuaïa Ibiza Beach Hotel', 'ushuaia-ibiza', 'Hotel de playa icónico que alberga fiestas diurnas masivas con los DJs más grandes del mundo.', 'Platja d''en Bossa, 10, 07817 Sant Josep de sa Talaia', NULL, NULL, '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00'),
('11ac9325-d37c-447f-b1aa-75342fe1fad3', 'DC-10', 'dc10', 'Club underground legendario conocido por sus fiestas Circoloco y su ambiente crudo.', 'Carretera las Salinas, km 1, 07818 Sant Josep de sa Talaia', NULL, NULL, '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00'),
('dd3fcaba-97d1-4737-a2b7-67584ac5fee8', 'Eden Ibiza', 'eden-ibiza', 'Superclub revitalizado en San Antonio con un potente sistema de sonido y noches de diversos géneros.', 'Carrer Salvador Espriu, s/n, 07820 Sant Antoni de Portmany', NULL, NULL, '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00'),
('38f176e1-ce51-46b3-a6b5-191a5f2408ca', 'Hï Ibiza', 'h-ibiza', 'Modern superclub with cutting-edge sound', 'Platja d''en Bossa', NULL, NULL, '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:22.48905+00:00', '2025-06-04T18:34:22.48905+00:00'),
('646de7dd-cefe-4126-816b-e318a7efc2b0', 'Ushuaïa Ibiza', 'ushuaa-ibiza', 'Open-air club and hotel', 'Platja d''en Bossa', NULL, NULL, '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:22.558195+00:00', '2025-06-04T18:34:22.558195+00:00'),
('309e1666-5a4d-493b-84e5-fdb14a5668fa', 'DC-10', 'dc-10', 'Underground club famous for Circoloco', 'Aeropuerto de Ibiza', NULL, NULL, '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:22.621488+00:00', '2025-06-04T18:34:22.621488+00:00'),
('dde4e2aa-bcf4-4c71-bdfd-9583bd834c8d', 'Privilege Ibiza', 'privilege-ibiza', 'World''s largest nightclub', 'Urbanització San Rafael', NULL, NULL, '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:22.762618+00:00', '2025-06-04T18:34:22.762618+00:00'),
('c1ce6fbe-de27-4c8e-8a8d-e3dbe3b3d81f', 'Es Paradis', 'es-paradis', 'Pyramid-shaped club in San Antonio', 'Carrer Salvador Espriu, San Antonio', NULL, NULL, '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:22.828969+00:00', '2025-06-04T18:34:22.828969+00:00'),
('52d42f05-b550-4bb6-a6ba-eef77a8691b1', 'Café Mambo', 'caf-mambo', 'Famous sunset bar', 'Carrer de Vara del Rey, San Antonio', NULL, NULL, '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:22.894879+00:00', '2025-06-04T18:34:22.894879+00:00'),
('25b68bd1-b4a7-42c2-a7c6-62a2c9780ee9', 'Café del Mar', 'caf-del-mar', 'Legendary sunset spot', 'Carrer de Vara del Rey, San Antonio', NULL, NULL, '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:22.960375+00:00', '2025-06-04T18:34:22.960375+00:00'),
('local-club-1', 'Bambuddha Grove', 'bambuddha-grove', 'Asian fusion restaurant and bar with stunning views', 'Ctra. San Juan, Km 8.5, Sant Joan de Labritja', NULL, NULL, NULL, 'approved', NULL, '2025-06-04T18:40:57.439Z', '2025-06-04T18:40:57.440Z'),
('local-club-2', 'Blue Marlin Ibiza', 'blue-marlin-ibiza', 'Luxury beach club on Cala Jondal', 'Cala Jondal, Ibiza', NULL, NULL, NULL, 'approved', NULL, '2025-06-04T18:40:57.440Z', '2025-06-04T18:40:57.440Z')
ON DUPLICATE KEY UPDATE
`id` = VALUES(`id`),
`name` = VALUES(`name`),
`slug` = VALUES(`slug`),
`description` = VALUES(`description`),
`location` = VALUES(`location`),
`image_url` = VALUES(`image_url`),
`capacity` = VALUES(`capacity`),
`social_links` = VALUES(`social_links`),
`status` = VALUES(`status`),
`submitted_by` = VALUES(`submitted_by`),
`created_at` = VALUES(`created_at`),
`updated_at` = VALUES(`updated_at`);

-- =============================================
-- DATOS PARA TABLA: DJS
-- =============================================

-- Insertar datos en djs
INSERT INTO `djs` (`id`, `name`, `slug`, `description`, `image_url`, `genre`, `social_links`, `status`, `submitted_by`, `created_at`, `updated_at`) VALUES
('01d07c79-aeff-4d43-a1df-ea84e03753c3', 'David Guetta', 'david-guetta', 'DJ y productor francés, uno de los más influyentes de la música electrónica mundial.', NULL, 'House, EDM', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00'),
('9c2d325e-2019-459c-8279-17db96e3b025', 'Martin Garrix', 'martin-garrix', 'DJ y productor holandés, uno de los más jóvenes en alcanzar el #1 mundial.', NULL, 'Progressive House, EDM', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00'),
('82dde53f-64ae-4075-937b-a2ee6287b174', 'Solomun', 'solomun', 'DJ y productor alemán, maestro del deep house y residente de Pacha Ibiza.', NULL, 'Deep House, Melodic Techno', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00'),
('eeb7efa5-30c8-404e-9188-85cc89d0ada7', 'Carl Cox', 'carl-cox', 'DJ británico, leyenda del techno y house, rey de Ibiza.', NULL, 'Techno, House', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00'),
('ad6cdfc0-79e4-43c7-8f0f-b0b7474b7c9d', 'Marco Carola', 'marco-carola', 'DJ y productor italiano, maestro del techno minimal.', NULL, 'Techno, Minimal', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00'),
('fdc6417b-471e-4c04-af44-3741a4d49fd0', 'Black Coffee', 'black-coffee', 'DJ y productor sudafricano, pionero del house africano.', NULL, 'Afro House, Deep House', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00'),
('c1a340f0-96ad-454d-9f8c-a9d9f6f02163', 'Tale of Us', 'tale-of-us', 'Italian electronic music duo', NULL, 'Melodic Techno', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:23.450724+00:00', '2025-06-04T18:34:23.450724+00:00'),
('615d368e-aa47-4d05-b31d-df6a82c281b8', 'Jamie Jones', 'jamie-jones', 'British DJ and Paradise founder', NULL, 'Tech House', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:23.517623+00:00', '2025-06-04T18:34:23.517623+00:00'),
('bec41a3a-e0b7-4007-ad82-471afc031960', 'Luciano', 'luciano', 'Swiss-Chilean DJ', NULL, 'Deep House, Minimal', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:23.581363+00:00', '2025-06-04T18:34:23.581363+00:00'),
('5bc47228-2a2a-4390-b6cb-d15195f55aa9', 'Hot Since 82', 'hot-since-82', 'British house music producer', NULL, 'Tech House', '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:23.643949+00:00', '2025-06-04T18:34:23.643949+00:00'),
('local-dj-1', 'Claptone', 'claptone', 'German DJ with mysterious golden mask', NULL, 'Deep House, Tech House', NULL, 'approved', NULL, '2025-06-04T18:40:57.440Z', '2025-06-04T18:40:57.440Z')
ON DUPLICATE KEY UPDATE
`id` = VALUES(`id`),
`name` = VALUES(`name`),
`slug` = VALUES(`slug`),
`description` = VALUES(`description`),
`image_url` = VALUES(`image_url`),
`genre` = VALUES(`genre`),
`social_links` = VALUES(`social_links`),
`status` = VALUES(`status`),
`submitted_by` = VALUES(`submitted_by`),
`created_at` = VALUES(`created_at`),
`updated_at` = VALUES(`updated_at`);

-- =============================================
-- DATOS PARA TABLA: PROMOTERS
-- =============================================

-- Insertar datos en promoters
INSERT INTO `promoters` (`id`, `name`, `slug`, `description`, `image_url`, `social_links`, `status`, `submitted_by`, `created_at`, `updated_at`) VALUES
('5e5d83ad-a093-4fc0-b566-d3d0c31f60b3', 'Elrow', 'elrow', 'Marca de fiestas española conocida por sus espectáculos coloridos y creativos.', NULL, '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00'),
('2787826d-1175-48c2-9ede-cf62c503e95f', 'Circoloco', 'circoloco', 'Legendaria marca de fiestas underground de DC-10.', NULL, '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00'),
('9e263086-f913-4f54-afee-1c07c3b27dcf', 'ABODE', 'abode', 'Promotora británica especializada en house y techno.', NULL, '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00'),
('cb469b4a-1793-4196-84b2-cd71547a2b59', 'Defected', 'defected', 'Sello discográfico y promotora especializada en house music.', NULL, '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00'),
('f4270acf-38a0-4be3-9de2-5f1c392ad7fe', 'Music On', 'music-on', 'Marco Carola''s event series', NULL, '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:23.847225+00:00', '2025-06-04T18:34:23.847225+00:00'),
('714090a1-29d2-4178-8063-a38102952708', 'Paradise', 'paradise', 'Jamie Jones'' party concept', NULL, '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:23.919156+00:00', '2025-06-04T18:34:23.919156+00:00'),
('1ba79e9d-4337-49fa-a0ea-8b1d378300a0', 'Pyramid', 'pyramid', 'Amnesia''s techno night', NULL, '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:23.987296+00:00', '2025-06-04T18:34:23.987296+00:00'),
('6364cc04-51d5-4622-b4f7-afdd71633fcd', 'ANTS', 'ants', 'Ushuaïa''s signature event series', NULL, '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:24.054723+00:00', '2025-06-04T18:34:24.054723+00:00'),
('52119119-0efb-424a-a5b3-a99643356c61', 'Afterlife', 'afterlife', 'Tale of Us melodic techno experience', NULL, '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:24.186427+00:00', '2025-06-04T18:34:24.186427+00:00'),
('2966310b-5a7f-4ae6-bb23-471707327fb6', 'Solid Grooves', 'solid-grooves', 'Underground house and techno', NULL, '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:24.265494+00:00', '2025-06-04T18:34:24.265494+00:00'),
('b3d1daab-3f9f-4513-9f34-fbb4df6c38e5', 'FUSE', 'fuse', 'Belgian techno collective', NULL, '[]', 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:24.340537+00:00', '2025-06-04T18:34:24.340537+00:00'),
('local-promoter-1', 'Zoo Project', 'zoo-project', 'Animal-themed party experience', NULL, NULL, 'approved', NULL, '2025-06-04T18:40:57.440Z', '2025-06-04T18:40:57.440Z')
ON DUPLICATE KEY UPDATE
`id` = VALUES(`id`),
`name` = VALUES(`name`),
`slug` = VALUES(`slug`),
`description` = VALUES(`description`),
`image_url` = VALUES(`image_url`),
`social_links` = VALUES(`social_links`),
`status` = VALUES(`status`),
`submitted_by` = VALUES(`submitted_by`),
`created_at` = VALUES(`created_at`),
`updated_at` = VALUES(`updated_at`);

-- =============================================
-- DATOS PARA TABLA: EVENTS
-- =============================================

-- Insertar datos en events
INSERT INTO `events` (`id`, `name`, `slug`, `description`, `date`, `time`, `price`, `image_url`, `video_url`, `event_type`, `club_id`, `promoter_id`, `dj_ids`, `social_links`, `original_source_url`, `import_notes`, `ticket_link`, `status`, `submitted_by`, `created_at`, `updated_at`) VALUES
('e5517161-e107-4d0d-bb67-eb0d3c9306f6', 'David Guetta Live', 'david-guetta-live-ushuaia', 'El rey del EDM regresa a Ushuaïa para una noche épica.', '2025-07-15', '20:00', '€80', NULL, NULL, NULL, 'c97a637c-ec80-4f5e-abf4-7b161fd6f07b', NULL, '[]', '[]', NULL, NULL, NULL, 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00'),
('53f8bce8-3537-49f0-8fa8-67d1509589fe', 'Solomun +1', 'solomun-plus-one-pacha', 'La legendaria fiesta de Solomun en la terraza de Pacha.', '2025-08-02', '23:00', '€60', NULL, NULL, NULL, '91835fbf-86dd-4114-9673-297b6217d55c', NULL, '[]', '[]', NULL, NULL, NULL, 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00'),
('6d7f8422-f445-4638-85e5-1799edb3d0a5', 'Circoloco', 'circoloco-dc10', 'La fiesta underground más auténtica de Ibiza.', '2025-07-28', '16:00', '€45', NULL, NULL, NULL, '11ac9325-d37c-447f-b1aa-75342fe1fad3', NULL, '[]', '[]', NULL, NULL, NULL, 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00'),
('a628dea1-a49e-4543-9d91-d24d32724b5c', 'Martin Garrix Presents STMPD', 'martin-garrix-stmpd-hi', 'El fenómeno holandés trae su sello a Hï Ibiza.', '2025-08-10', '23:00', '€70', NULL, NULL, NULL, 'ba3b24e3-1b37-48fa-8728-ec22b8ce20ab', NULL, '[]', '[]', NULL, NULL, NULL, 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00'),
('d73a2982-b4c8-472b-a815-032ca7ef0c34', 'Pyramid at Amnesia', 'pyramid-amnesia', 'La noche de trance más épica de Ibiza.', '2025-07-22', '23:00', '€55', NULL, NULL, NULL, 'e8a6e495-097b-4de9-a794-4d4a0124bc23', NULL, '[]', '[]', NULL, NULL, NULL, 'approved', '00000000-0000-0000-0000-000000000000', '2025-05-29T03:50:33.914021+00:00', '2025-05-29T03:50:33.914021+00:00'),
('fd66e051-548a-4f24-8e9d-7e7cb2d07ae6', 'David Guetta F*** Me I''m Famous', 'david-guetta-f-me-im-famous', 'David Guetta''s legendary Pacha residency', '2025-07-15', '23:00', '50€', NULL, NULL, 'club', NULL, NULL, '[]', '[]', NULL, NULL, NULL, 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:24.434786+00:00', '2025-06-04T18:34:24.434786+00:00'),
('598f0f4a-dd07-41b5-b412-a965a9b3b0b7', 'Solomun +1 at Pacha', 'solomun-1-at-pacha', 'Intimate sets by Solomun and special guests', '2025-08-02', '23:30', '45€', NULL, NULL, 'club', NULL, NULL, '[]', '[]', NULL, NULL, NULL, 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:24.498605+00:00', '2025-06-04T18:34:24.498605+00:00'),
('2b26bc55-fc7a-4dec-9e3a-022967654e6f', 'Circoloco at DC-10', 'circoloco-at-dc-10', 'Monday madness at the legendary DC-10', '2025-07-28', '16:00', '40€', NULL, NULL, 'underground', NULL, NULL, '[]', '[]', NULL, NULL, NULL, 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:24.56329+00:00', '2025-06-04T18:34:24.56329+00:00'),
('1c009361-2c1a-4c69-a9b2-c60fcd80f07d', 'ANTS at Ushuaïa', 'ants-at-ushuaa', 'The worker ants take over Ushuaïa', '2025-08-10', '17:00', '60€', NULL, NULL, 'pool', NULL, NULL, '[]', '[]', NULL, NULL, NULL, 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:24.674631+00:00', '2025-06-04T18:34:24.674631+00:00'),
('97c75913-d593-4bd8-8b47-b01c636910c9', 'Pyramid at Amnesia', 'pyramid-at-amnesia', 'Techno titans at the legendary pyramid room', '2025-07-22', '24:00', '35€', NULL, NULL, 'club', NULL, NULL, '[]', '[]', NULL, NULL, NULL, 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:24.742879+00:00', '2025-06-04T18:34:24.742879+00:00'),
('1419bdff-ee49-4bc0-86c8-979ce72f6852', 'Afterlife presents Tale of Us', 'afterlife-presents-tale-of-us', 'Melodic techno journey at Privilege', '2025-08-15', '23:00', '55€', NULL, NULL, 'club', NULL, NULL, '[]', '[]', NULL, NULL, NULL, 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:24.815466+00:00', '2025-06-04T18:34:24.815466+00:00'),
('6352519c-17cb-4c0d-a02c-d410b1330939', 'Solid Grooves Pool Party', 'solid-grooves-pool-party', 'Underground vibes at Ushuaïa', '2025-07-30', '16:00', '45€', NULL, NULL, 'pool', NULL, NULL, '[]', '[]', NULL, NULL, NULL, 'approved', '00000000-0000-0000-0000-000000000000', '2025-06-04T18:34:24.904196+00:00', '2025-06-04T18:34:24.904196+00:00'),
('local-event-1', 'Zoo Project at Benimussa Park', 'zoo-project-benimussa', 'Wild party in the park with animal costumes', '2025-08-20', '15:00:00', '35€', NULL, NULL, 'outdoor', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL, '2025-06-04T18:40:57.440Z', '2025-06-04T18:40:57.440Z')
ON DUPLICATE KEY UPDATE
`id` = VALUES(`id`),
`name` = VALUES(`name`),
`slug` = VALUES(`slug`),
`description` = VALUES(`description`),
`date` = VALUES(`date`),
`time` = VALUES(`time`),
`price` = VALUES(`price`),
`image_url` = VALUES(`image_url`),
`video_url` = VALUES(`video_url`),
`event_type` = VALUES(`event_type`),
`club_id` = VALUES(`club_id`),
`promoter_id` = VALUES(`promoter_id`),
`dj_ids` = VALUES(`dj_ids`),
`social_links` = VALUES(`social_links`),
`original_source_url` = VALUES(`original_source_url`),
`import_notes` = VALUES(`import_notes`),
`ticket_link` = VALUES(`ticket_link`),
`status` = VALUES(`status`),
`submitted_by` = VALUES(`submitted_by`),
`created_at` = VALUES(`created_at`),
`updated_at` = VALUES(`updated_at`);


-- =============================================
-- FINALIZAR TRANSACCIÓN
-- =============================================

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

-- =============================================
-- FIN DE LA EXPORTACIÓN
-- Total de registros exportados:
-- - Usuarios: 1
-- - Clubs: 15
-- - DJs: 11
-- - Promoters: 12
-- - Eventos: 13
-- =============================================
