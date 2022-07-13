ALTER TABLE notes_behaviour
   ADD CONSTRAINT FK_notes_behaviour_Cascade
   FOREIGN KEY (notes_id) REFERENCES notes(id) ON DELETE CASCADE;


ALTER TABLE comments
   ADD CONSTRAINT FK_comments_Cascade
   FOREIGN KEY (notes_id) REFERENCES notes(id) ON DELETE CASCADE;   