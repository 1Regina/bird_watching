CREATE TABLE IF NOT EXISTS users ( 
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

CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  date TEXT,
  behaviour TEXT,
  flock_size INTEGER,
  species TEXT,
  creator_id INTEGER,
  CONSTRAINT FK_notes_users FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
  -- FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notes_behaviour (
  id SERIAL PRIMARY KEY, 
  notes_id INTEGER,
  behaviour_id INTEGER,
  CONSTRAINT FK_notes_notes_behaviour FOREIGN KEY (notes_id) REFERENCES notes(id) ON DELETE CASCADE,
  CONSTRAINT FK_behaviours_notes_behaviour FOREIGN KEY (behaviour_id) REFERENCES  behaviours(id) ON DELETE CASCADE  
  -- FOREIGN KEY (notes_id) REFERENCES notes(id) ON DELETE CASCADE,
  -- FOREIGN KEY (behaviour_id) REFERENCES  behaviours(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  text TEXT,
  notes_id INTEGER,
  user_id INTEGER
  -- notes_id INTEGER REFERENCES notes(id),
  -- user_id INTEGER REFERENCES users(id)
);

ALTER TABLE comments 
  ADD CONSTRAINT FK_comments_notes FOREIGN KEY (notes_id) REFERENCES notes(id) ON DELETE CASCADE,
  ADD CONSTRAINT FK_comments_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;