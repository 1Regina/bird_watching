-- INSERT INTO species (name, scientific_name) VALUES ('Ruby-cheeked Sunbird', 'Chalcoparia singalensis'), ('Scarlet-breasted Flowerpecker', 'Prionochilus thoracicus'), ('Greater Green Leafbird', 'Chloropsis sonnerati'), ('Blue-and-white Flycatcher', 'Cyanoptila cyanomelana');


-- INSERT INTO behaviours (action) VALUES ('head cocking'), ('preening'), ('resting'), ('singing') , ('tail bobbing'),  ('wings stretching');

-- INSERT INTO users (user_name, email, password) VALUES ('Aaa', 'a@gmail.com', '7a9b2a35095dcdfedfdf0ef810310b409e38c92c20cbd51088ea5e4bc4873bdacfeb29f14b7f2ed033d87fad00036da83d5c597a7e7429bc70cec378db4de6a6')

-- INSERT INTO notes (date, flock_size, species,creator_id) VALUES ('1-Apr-2022' , 4, 'Ruby-cheeked Sunbird', 1);

-- INSERT INTO notes_behaviour (notes_id, behaviour_id) VALUES (1, 1);

INSERT INTO users (user_name, email, password) VALUES ('Bbb', 'b@gmail.com', '5b1e6fa0b00d6808b076a5bdd3e14f1b3388ebc995145b95bc37d7a58301689c220f3dea24a3a5018958c9116dd4462b4026bc729f88a1c46f469d39344c6278');

INSERT INTO notes (date, flock_size, species,creator_id) VALUES ('2-Apr-2022' , 2, 'Scarlet-breasted Flowerpecker', 2);

INSERT INTO notes_behaviour (notes_id, behaviour_id) VALUES (2, 2);
