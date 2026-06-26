DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nombre, email, password) VALUES
  ('Ana Perez', 'ana@example.com', 'password_demo_1'),
  ('Luis Gomez', 'luis@example.com', 'password_demo_2');
