-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               PostgreSQL 12.9 (Ubuntu 12.9-0ubuntu0.20.04.1) on x86_64-pc-linux-gnu, compiled by gcc (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0, 64-bit
-- Server OS:                    
-- HeidiSQL Version:             12.0.0.6468
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES  */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping data for table public.behaviours: 0 rows
/*!40000 ALTER TABLE "behaviours" DISABLE KEYS */;
INSERT INTO "behaviours" ("id", "action") VALUES
	(1, 'tail bobbing'),
	(2, 'head cocking'),
	(3, 'wings stretching'),
	(4, 'resting'),
	(5, 'preening'),
	(6, 'singing');
/*!40000 ALTER TABLE "behaviours" ENABLE KEYS */;

-- Dumping data for table public.comments: 0 rows
/*!40000 ALTER TABLE "comments" DISABLE KEYS */;
INSERT INTO "comments" ("id", "text", "notes_id", "user_id") VALUES
	(1, '''undefined''', 4, 3),
	(2, '''undefined''', 4, 2),
	(3, '''undefined''', 2, 2),
	(4, '''undefined''', 2, 2),
	(5, '''undefined''', 2, 2),
	(6, '''undefined''', 6, 2),
	(7, '''tweety''', 6, 2),
	(8, '''away with cats''', 3, 2),
	(9, '''Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.''', 5, 2),
	(10, '''In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available''', 2, 2),
	(11, '''Tweety is eaten''', 3, 2),
	(12, '''Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client Hence I can only edit once''', 4, 3),
	(13, '''I m doing post review''', 6, 3),
	(14, '''post review''', 6, 3),
	(15, '''post review''', 6, 3),
	(16, '''post review''', 5, 3),
	(17, '''post review''', 4, 3),
	(18, '''post review''', 4, 3),
	(19, '''goodnite''', 4, 3),
	(20, '''it is almost done''', 8, 3),
	(21, '''aasa''', 13, 1),
	(22, '''comment on note 2''', 2, 1);
/*!40000 ALTER TABLE "comments" ENABLE KEYS */;

-- Dumping data for table public.notes: 11 rows
/*!40000 ALTER TABLE "notes" DISABLE KEYS */;
INSERT INTO "notes" ("id", "date", "behaviour", "flock_size", "species", "creator_id") VALUES
	(5, '5-Nov-2021', '', 21, 'Scarlet-breasted Flowerpecker', 3),
	(3, '2021-11-03', '', 10, 'Greater Green Leafbird', 2),
	(2, '2021-11-02', '', 20, 'Blue-and-white Flycatcher', 1),
	(10, '28-Dec-2021', '', 7, 'Ruby-cheeked Sunbird', 2),
	(9, '23-Dec-2021', '', 15, 'Blue-and-white Flycatcher', 2),
	(11, '2-Mar-2022', NULL, 19, 'Ruby-cheeked Sunbird', 3),
	(4, '4-Nov-2021', '', 12, 'Blue-and-white Flycatcher', 3),
	(7, '10-Nov-2021', '', 190, 'Greater Green Leafbird', 3),
	(8, '10-Nov-2021', '', 111, 'Scarlet-breasted Flowerpecker', 3),
	(6, '2021-11-08', '', 121, 'Ruby-cheeked Sunbird', 3),
	(12, '26-Jun-2022', NULL, 181, 'Ruby-cheeked Sunbird', 3),
	(1, '2021-11-01', '', 1, 'Ruby-cheeked Sunbird', 1),
	(13, '1-Jul-2022', NULL, 22, 'Scarlet-breasted Flowerpecker', 1),
	(14, '12-Jul-2022', NULL, 333, 'Greater Green Leafbird', 1),
	(15, '12-Jul-2022', NULL, 222, 'Greater Green Leafbird', 1),
	(16, '13-Jul-2022', NULL, 123, 'Blue-and-white Flycatcher', 1),
	(17, '13-Jul-2022', NULL, 22, 'Greater Green Leafbird', 1),
	(18, '13-Jul-2022', NULL, 101, 'Blue-and-white Flycatcher', 1),
	(19, '13-Jul-2022', NULL, 1, 'Greater Green Leafbird', 1),
	(20, '6-Jul-2022', NULL, 123, 'Scarlet-breasted Flowerpecker', 1);
/*!40000 ALTER TABLE "notes" ENABLE KEYS */;

-- Dumping data for table public.notes_behaviour: 24 rows
/*!40000 ALTER TABLE "notes_behaviour" DISABLE KEYS */;
INSERT INTO "notes_behaviour" ("id", "notes_id", "behaviour_id") VALUES
	(360, 16, 1),
	(361, 16, 5),
	(362, 19, 6),
	(4, 2, 1),
	(5, 2, 2),
	(363, 20, 3),
	(364, 14, 2),
	(365, 15, 3),
	(366, 17, 3),
	(367, 17, 4),
	(368, 18, 4),
	(337, 12, 2),
	(338, 12, 3),
	(339, 12, 4),
	(340, 12, 5),
	(341, 12, 6),
	(342, 1, 2),
	(343, 1, 5),
	(347, 3, 2),
	(348, 4, 5),
	(349, 6, 5),
	(350, 7, 2),
	(351, 8, 2),
	(352, 9, 2),
	(353, 10, 2),
	(355, 11, 2),
	(217, 5, 1),
	(356, 13, 1),
	(357, 13, 2),
	(358, 13, 5),
	(359, 13, 6),
	(218, 5, 4),
	(219, 5, 6);
/*!40000 ALTER TABLE "notes_behaviour" ENABLE KEYS */;

-- Dumping data for table public.species: 0 rows
/*!40000 ALTER TABLE "species" DISABLE KEYS */;
INSERT INTO "species" ("id", "name", "scientific_name") VALUES
	(1, 'Ruby-cheeked Sunbird', 'Chalcoparia singalensis'),
	(2, 'Scarlet-breasted Flowerpecker', 'Prionochilus thoracicus'),
	(3, 'Greater Green Leafbird', 'Chloropsis sonnerati'),
	(4, 'Blue-and-white Flycatcher', 'Cyanoptila cyanomelana');
/*!40000 ALTER TABLE "species" ENABLE KEYS */;

-- Dumping data for table public.users: 0 rows
/*!40000 ALTER TABLE "users" DISABLE KEYS */;
INSERT INTO "users" ("id", "user_name", "email", "password") VALUES
	(1, 'aaa', 'a@gmail.com', '7a9b2a35095dcdfedfdf0ef810310b409e38c92c20cbd51088ea5e4bc4873bdacfeb29f14b7f2ed033d87fad00036da83d5c597a7e7429bc70cec378db4de6a6'),
	(2, 'bbb', 'b@gmail.com', '5b1e6fa0b00d6808b076a5bdd3e14f1b3388ebc995145b95bc37d7a58301689c220f3dea24a3a5018958c9116dd4462b4026bc729f88a1c46f469d39344c6278'),
	(3, 'ccc', 'c@gmail.com', 'ccfb06682cae78663c496e97a8fb2c3cb5ae53985b6350956d984806ad3dee4c8a04b8c306eff898a813eba4e5ea51f531d2513a4a22d2486591b1c699698ea8'),
	(4, 'ddd', 'd@gmail.com', '652dcf7057417d54c3236731a2ca47330b8809236b87da89917403feaac34ea5dbe938ee60fdd606383b38df9b51239d25968ddf1c0445c0e7ab448287197d64');
/*!40000 ALTER TABLE "users" ENABLE KEYS */;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
