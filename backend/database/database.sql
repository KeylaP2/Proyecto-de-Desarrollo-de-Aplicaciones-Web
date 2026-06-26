DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE productos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio REAL NOT NULL CHECK (precio >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nombre, email, password) VALUES
  ('Ana Perez', 'ana@example.com', 'password_demo_1'),
  ('Luis Gomez', 'luis@example.com', 'password_demo_2');

INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
  ('Laptop Lenovo', 'Laptop para trabajo y estudio', 850.00, 10),
  ('Mouse Logitech', 'Mouse inalambrico ergonomico', 25.50, 35),
  ('Teclado Mecanico', 'Teclado mecanico retroiluminado', 65.99, 15);
