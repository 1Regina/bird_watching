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
    creator_id INTEGER,
  ADD COLUMN IF NOT EXISTS   
    species TEXT;
    

CREATE TABLE  IF NOT EXISTS users (
  id SERIAL PRIMARY KEY, 
  user_name TEXT,
  email TEXT, 
  password TEXT
);


CREATE TABLE  IF NOT EXISTS species (
  id SERIAL PRIMARY KEY, 
  name TEXT,
  scientific_name TEXT
);

CREATE TABLE  IF NOT EXISTS behaviours (
  id SERIAL PRIMARY KEY, 
  action TEXT
);

-- INSERT INTO species (name, scientific_name) VALUES ('Ruby-cheeked Sunbird', 'Chalcoparia singalensis'), ('Scarlet-breasted Flowerpecker', 'Prionochilus thoracicus'), ('Greater Green Leafbird', 'Chloropsis sonnerati'), ('Blue-and-white Flycatcher', 'Cyanoptila cyanomelana');

-- INSERT INTO behaviours (action) VALUES ('bobbing_tail'), ('cocking_head'), ('stretching_wings'), ('resting'), ('preening'), ('singing');