CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  date TEXT,
  behaviour TEXT,
  flock_size INTEGER,
  species TEXT,
  creator_id INTEGER REFERENCES users(id)
);

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

ALTER TABLE notes 
  ADD COLUMN IF NOT EXISTS 
    creator_id INTEGER REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS   
    species TEXT;

CREATE TABLE  IF NOT EXISTS behaviours (
  id SERIAL PRIMARY KEY, 
  action TEXT
);

CREATE TABLE IF NOT EXISTS notes_behaviour (
  id SERIAL PRIMARY KEY, 
  notes_id INTEGER REFERENCES notes(id),
  behaviour_id INTEGER REFERENCES behaviours(id)
);

INSERT INTO species (name, scientific_name) VALUES ('Ruby-cheeked Sunbird', 'Chalcoparia singalensis'), ('Scarlet-breasted Flowerpecker', 'Prionochilus thoracicus'), ('Greater Green Leafbird', 'Chloropsis sonnerati'), ('Blue-and-white Flycatcher', 'Cyanoptila cyanomelana');


INSERT INTO behaviours (action) VALUES ('tail bobbing'), ('head cocking'), ('wings stretching'), ('resting'), ('preening'), ('singing');