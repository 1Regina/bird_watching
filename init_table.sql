CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  date TEXT,
  -- user_id INTEGER REFERENCES users(id),
  -- species_id INTEGER REFERENCES species(id),
  behaviour TEXT,
  flock_size INTEGER
);