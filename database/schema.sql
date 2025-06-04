-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'MODERATOR', 'ADMIN')),
    is_banned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de clubs
CREATE TABLE IF NOT EXISTS clubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    location VARCHAR(255),
    image_url TEXT,
    capacity INTEGER,
    social_links JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de DJs
CREATE TABLE IF NOT EXISTS djs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    genre VARCHAR(100),
    social_links JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de promotores
CREATE TABLE IF NOT EXISTS promoters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    social_links JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de eventos
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time VARCHAR(10),
    price VARCHAR(50),
    image_url TEXT,
    event_type VARCHAR(100),
    club_id UUID REFERENCES clubs(id) ON DELETE SET NULL,
    promoter_id UUID REFERENCES promoters(id) ON DELETE SET NULL,
    dj_ids UUID[] DEFAULT ARRAY[]::UUID[],
    social_links JSONB DEFAULT '[]'::jsonb,
    original_source_url TEXT,
    import_notes TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_club_id ON events(club_id);
CREATE INDEX IF NOT EXISTS idx_events_promoter_id ON events(promoter_id);
CREATE INDEX IF NOT EXISTS idx_events_dj_ids ON events USING GIN(dj_ids);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

CREATE INDEX IF NOT EXISTS idx_clubs_status ON clubs(status);
CREATE INDEX IF NOT EXISTS idx_clubs_slug ON clubs(slug);

CREATE INDEX IF NOT EXISTS idx_djs_status ON djs(status);
CREATE INDEX IF NOT EXISTS idx_djs_slug ON djs(slug);
CREATE INDEX IF NOT EXISTS idx_djs_genre ON djs(genre);

CREATE INDEX IF NOT EXISTS idx_promoters_status ON promoters(status);
CREATE INDEX IF NOT EXISTS idx_promoters_slug ON promoters(slug);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON clubs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_djs_updated_at BEFORE UPDATE ON djs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_promoters_updated_at BEFORE UPDATE ON promoters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar usuario administrador por defecto
INSERT INTO users (id, email, name, role) 
VALUES ('00000000-0000-0000-0000-000000000001', 'admin@sunandflower.com', 'Admin', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Insertar usuario para importaciones externas
INSERT INTO users (id, email, name, role) 
VALUES ('00000000-0000-0000-0000-000000000002', 'external@import.system', 'External Import System', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Insertar algunos clubs famosos de Ibiza
INSERT INTO clubs (name, slug, description, location, status, submitted_by) VALUES
('Pacha Ibiza', 'pacha-ibiza', 'El club más icónico de Ibiza, conocido por su ambiente exclusivo y sus fiestas legendarias.', 'Av. 8 d''Agost, 07800 Eivissa, Illes Balears', 'approved', '00000000-0000-0000-0000-000000000001'),
('Amnesia Ibiza', 'amnesia-ibiza', 'Uno de los superclubs más famosos del mundo, hogar de las mejores fiestas de música electrónica.', 'Ctra. Ibiza a San Antonio, Km 5, 07816 San Rafael, Illes Balears', 'approved', '00000000-0000-0000-0000-000000000001'),
('Ushuaïa Ibiza', 'ushuaia-ibiza', 'El hotel-club más exclusivo de Ibiza con fiestas al aire libre y los mejores DJs del mundo.', 'Platja d''en Bossa, 10, 07817 Sant Jordi de ses Salines, Illes Balears', 'approved', '00000000-0000-0000-0000-000000000001'),
('Hï Ibiza', 'hi-ibiza', 'El club más moderno de Ibiza con tecnología de vanguardia y producciones espectaculares.', 'Ctra. Ibiza a San Antonio, Km 5, 07816 San Rafael, Illes Balears', 'approved', '00000000-0000-0000-0000-000000000001'),
('DC10', 'dc10', 'Club underground famoso por sus fiestas de techno y house más auténticas de la isla.', 'Ctra. de l''Aeroport, s/n, 07817 Sant Jordi de ses Salines, Illes Balears', 'approved', '00000000-0000-0000-0000-000000000001'),
('Privilege Ibiza', 'privilege-ibiza', 'El club más grande del mundo según el Guinness World Records.', 'Ctra. Ibiza a San Antonio, Km 5, 07816 San Rafael, Illes Balears', 'approved', '00000000-0000-0000-0000-000000000001')
ON CONFLICT (slug) DO NOTHING;

-- Insertar algunos DJs famosos
INSERT INTO djs (name, slug, description, genre, status, submitted_by) VALUES
('David Guetta', 'david-guetta', 'DJ y productor francés, uno de los más influyentes de la música electrónica mundial.', 'House, EDM', 'approved', '00000000-0000-0000-0000-000000000001'),
('Calvin Harris', 'calvin-harris', 'DJ, productor y cantante escocés, conocido por sus hits mundiales.', 'House, EDM, Pop', 'approved', '00000000-0000-0000-0000-000000000001'),
('Martin Garrix', 'martin-garrix', 'DJ y productor holandés, uno de los más jóvenes en alcanzar el #1 mundial.', 'Progressive House, EDM', 'approved', '00000000-0000-0000-0000-000000000001'),
('Tiësto', 'tiesto', 'DJ y productor holandés, leyenda de la música electrónica.', 'Trance, House, EDM', 'approved', '00000000-0000-0000-0000-000000000001'),
('Armin van Buuren', 'armin-van-buuren', 'DJ y productor holandés, rey del trance mundial.', 'Trance, Progressive', 'approved', '00000000-0000-0000-0000-000000000001'),
('Carl Cox', 'carl-cox', 'DJ británico, leyenda del techno y house.', 'Techno, House', 'approved', '00000000-0000-0000-0000-000000000001'),
('Solomun', 'solomun', 'DJ y productor alemán, maestro del deep house.', 'Deep House, Melodic Techno', 'approved', '00000000-0000-0000-0000-000000000001'),
('Tale Of Us', 'tale-of-us', 'Dúo italiano de música electrónica, especialistas en melodic techno.', 'Melodic Techno, Deep House', 'approved', '00000000-0000-0000-0000-000000000001')
ON CONFLICT (slug) DO NOTHING;

-- Insertar algunos promotores
INSERT INTO promoters (name, slug, description, status, submitted_by) VALUES
('Elrow', 'elrow', 'La marca de fiestas más colorida y divertida del mundo, famosa por sus decoraciones espectaculares.', 'approved', '00000000-0000-0000-0000-000000000001'),
('Cocoon', 'cocoon', 'Marca de fiestas de Sven Väth, sinónimo de techno de calidad.', 'approved', '00000000-0000-0000-0000-000000000001'),
('Music On', 'music-on', 'Marca de Marco Carola, especializada en techno underground.', 'approved', '00000000-0000-0000-0000-000000000001'),
('Afterlife', 'afterlife', 'Marca de Tale Of Us, referente del melodic techno.', 'approved', '00000000-0000-0000-0000-000000000001'),
('ANTS', 'ants', 'Concepto único de fiestas con temática de hormigas y música underground.', 'approved', '00000000-0000-0000-0000-000000000001')
ON CONFLICT (slug) DO NOTHING;

-- Insertar algunos eventos de ejemplo para el verano 2025
INSERT INTO events (name, slug, description, date, time, price, event_type, club_id, promoter_id, dj_ids, status, submitted_by) VALUES
(
    'David Guetta - F*** Me I''m Famous',
    'david-guetta-fmif-pacha-2025',
    'La residencia más famosa de David Guetta en Pacha Ibiza. Una noche épica de house y EDM.',
    '2025-07-15',
    '23:00',
    '€80-120',
    'Residency',
    (SELECT id FROM clubs WHERE slug = 'pacha-ibiza'),
    NULL,
    ARRAY[(SELECT id FROM djs WHERE slug = 'david-guetta')],
    'approved',
    '00000000-0000-0000-0000-000000000001'
),
(
    'Solomun +1',
    'solomun-plus-one-pacha-2025',
    'La residencia de Solomun en Pacha, donde invita a un artista especial cada semana.',
    '2025-08-03',
    '23:00',
    '€70-100',
    'Residency',
    (SELECT id FROM clubs WHERE slug = 'pacha-ibiza'),
    NULL,
    ARRAY[(SELECT id FROM djs WHERE slug = 'solomun')],
    'approved',
    '00000000-0000-0000-0000-000000000001'
),
(
    'Elrow Psychedelic Trip',
    'elrow-psychedelic-trip-amnesia-2025',
    'La fiesta más colorida y divertida de Ibiza con decoraciones espectaculares.',
    '2025-07-22',
    '16:00',
    '€60-90',
    'Festival',
    (SELECT id FROM clubs WHERE slug = 'amnesia-ibiza'),
    (SELECT id FROM promoters WHERE slug = 'elrow'),
    ARRAY[(SELECT id FROM djs WHERE slug = 'calvin-harris')],
    'approved',
    '00000000-0000-0000-0000-000000000001'
),
(
    'Martin Garrix presents STMPD RCRDS',
    'martin-garrix-stmpd-ushuaia-2025',
    'Martin Garrix presenta su sello discográfico en Ushuaïa con invitados especiales.',
    '2025-08-10',
    '17:00',
    '€90-150',
    'Label Showcase',
    (SELECT id FROM clubs WHERE slug = 'ushuaia-ibiza'),
    NULL,
    ARRAY[(SELECT id FROM djs WHERE slug = 'martin-garrix')],
    'approved',
    '00000000-0000-0000-0000-000000000001'
),
(
    'Afterlife',
    'afterlife-hi-ibiza-2025',
    'Tale Of Us presenta Afterlife, el evento de melodic techno más esperado del año.',
    '2025-07-29',
    '23:00',
    '€75-110',
    'Brand Event',
    (SELECT id FROM clubs WHERE slug = 'hi-ibiza'),
    (SELECT id FROM promoters WHERE slug = 'afterlife'),
    ARRAY[(SELECT id FROM djs WHERE slug = 'tale-of-us')],
    'approved',
    '00000000-0000-0000-0000-000000000001'
),
(
    'Carl Cox - Music is Revolution',
    'carl-cox-music-revolution-privilege-2025',
    'La legendaria residencia de Carl Cox en Privilege, puro techno y house.',
    '2025-08-05',
    '23:00',
    '€65-95',
    'Residency',
    (SELECT id FROM clubs WHERE slug = 'privilege-ibiza'),
    NULL,
    ARRAY[(SELECT id FROM djs WHERE slug = 'carl-cox')],
    'approved',
    '00000000-0000-0000-0000-000000000001'
)
ON CONFLICT (slug) DO NOTHING;

-- Habilitar Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE djs ENABLE ROW LEVEL SECURITY;
ALTER TABLE promoters ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad básicas (permitir lectura pública para contenido aprobado)
CREATE POLICY "Public read access for approved content" ON clubs FOR SELECT USING (status = 'approved');
CREATE POLICY "Public read access for approved content" ON djs FOR SELECT USING (status = 'approved');
CREATE POLICY "Public read access for approved content" ON promoters FOR SELECT USING (status = 'approved');
CREATE POLICY "Public read access for approved content" ON events FOR SELECT USING (status = 'approved');

-- Los usuarios pueden ver su propio contenido
CREATE POLICY "Users can view own content" ON clubs FOR SELECT USING (auth.uid() = submitted_by);
CREATE POLICY "Users can view own content" ON djs FOR SELECT USING (auth.uid() = submitted_by);
CREATE POLICY "Users can view own content" ON promoters FOR SELECT USING (auth.uid() = submitted_by);
CREATE POLICY "Users can view own content" ON events FOR SELECT USING (auth.uid() = submitted_by);

-- Los usuarios pueden crear contenido
CREATE POLICY "Users can create content" ON clubs FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Users can create content" ON djs FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Users can create content" ON promoters FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Users can create content" ON events FOR INSERT WITH CHECK (auth.uid() = submitted_by);

-- Los usuarios pueden editar su propio contenido
CREATE POLICY "Users can edit own content" ON clubs FOR UPDATE USING (auth.uid() = submitted_by);
CREATE POLICY "Users can edit own content" ON djs FOR UPDATE USING (auth.uid() = submitted_by);
CREATE POLICY "Users can edit own content" ON promoters FOR UPDATE USING (auth.uid() = submitted_by);
CREATE POLICY "Users can edit own content" ON events FOR UPDATE USING (auth.uid() = submitted_by); 