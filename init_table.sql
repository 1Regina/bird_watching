CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  date TEXT,
  -- user_id INTEGER REFERENCES users(id),
  -- species_id INTEGER REFERENCES species(id),
  behaviour TEXT,
  flock_size INTEGER
);

ALTER TABLE notes 
  ADD COLUMN IF NOT EXISTS 
    creator_id INTEGER;
    

CREATE TABLE  IF NOT EXISTS users (
  id SERIAL PRIMARY KEY, 
  user_name TEXT,
  email TEXT, 
  password TEXT
);