
CREATE TYPE role_type AS ENUM ('super_admin','artist_manager','artist');
---statement breakpoint---
CREATE TYPE gender AS ENUM ('male','female','others');
---statement breakpoint---
CREATE TYPE genre AS ENUM ('rnb','country','classic','rock','jazz');
---statement breakpoint---
CREATE TABLE IF NOT EXISTS users(
	id SERIAL PRIMARY KEY,
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR(500) NOT NULL,
	phone VARCHAR(20) NOT NULL,
	dob DATE,
	gender gender NOT NULL,
	role_type role_type NOT NULL,
	address VARCHAR(255),
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ
);
---statement breakpoint---
CREATE TABLE IF NOT EXISTS artists(
	id SERIAL PRIMARY KEY,
	user_id INT UNIQUE NOT NULL,
	first_release_year INT NOT NULL,
	no_of_albums_released INT NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
---statement breakpoint---
CREATE TABLE IF NOT EXISTS musics(
	artist_id INT NOT NULL,
	title VARCHAR(255) NOT NULL,
	album_name VARCHAR(255) NOT NULL,
	genre genre NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ,
	PRIMARY KEY (artist_id, title),
	FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);
---statement breakpoint---
CREATE INDEX idx_musics_artist_id ON musics(artist_id);

-- SELECT a.first_release_year,a.no_of_albums_released,u.first_name,u.last_name,u.email,u.gender,u. FROM artists a LEFT JOIN users u ON a.user_id = u.id;
