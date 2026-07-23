CREATE DATABASE IF NOT EXISTS `3dverse`;

USE `3dverse`;

CREATE TABLE IF NOT EXISTS object_catalog (
  id VARCHAR(120) PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  model_url TEXT NOT NULL,
  aliases JSON NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO object_catalog (id, label, model_url, aliases, description) VALUES
(
  'chair',
  'Wooden Chair',
  'https://modelviewer.dev/assets/ShopifyModels/Chair.glb',
  JSON_ARRAY('chair', 'wooden chair', 'office chair', 'dining chair'),
  'A wooden chair for seating in a room, office, dining area, classroom, or furniture scene.'
),
(
  'astronaut',
  'Astronaut',
  'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
  JSON_ARRAY('astronaut', 'space suit', 'spacesuit', 'space man', 'space explorer'),
  'A human space explorer wearing a white astronaut suit, helmet, boots, and life support pack.'
),
(
  'robot',
  'Robot',
  'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb',
  JSON_ARRAY('robot', 'android', 'humanoid robot', 'bot'),
  'A friendly humanoid robot or android with mechanical body parts for technology scenes.'
),
(
  'horse',
  'Horse',
  'https://modelviewer.dev/shared-assets/models/Horse.glb',
  JSON_ARRAY('horse', 'stallion', 'pony'),
  'A four legged horse animal, useful for farm, riding, stable, race, or outdoor scenes.'
),
(
  'helmet',
  'Helmet',
  'https://modelviewer.dev/shared-assets/models/DamagedHelmet.glb',
  JSON_ARRAY('helmet', 'damaged helmet', 'biker helmet', 'motorcycle helmet', 'helmate', 'helment'),
  'A protective sci fi or motorcycle style helmet with worn metal details.'
),
(
  'train',
  'Toy Train',
  'https://modelviewer.dev/assets/ShopifyModels/ToyTrain.glb',
  JSON_ARRAY('toy train', 'train', 'locomotive'),
  'A toy train or small locomotive for railway, kids toy, transport, or playroom scenes.'
),
(
  'planter',
  'Planter',
  'https://modelviewer.dev/assets/ShopifyModels/GeoPlanter.glb',
  JSON_ARRAY('planter', 'plant pot', 'flower pot', 'pot'),
  'A geometric planter or plant pot for flowers, indoor plants, garden, balcony, or home decor.'
),
(
  'boombox',
  'Boombox',
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb',
  JSON_ARRAY('boombox', 'speaker', 'music player', 'radio', 'stereo'),
  'A portable music speaker or stereo radio with handles and audio controls.'
),
(
  'avocado',
  'Avocado',
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb',
  JSON_ARRAY('avocado', 'fruit', 'food', 'green fruit'),
  'A sliced avocado fruit with green flesh and seed, useful for food or kitchen scenes.'
),
(
  'lantern',
  'Lantern',
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb',
  JSON_ARRAY('lantern', 'lamp', 'light', 'hanging lamp'),
  'A decorative lantern or lamp that represents lighting for rooms, camping, or night scenes.'
)
ON DUPLICATE KEY UPDATE
  label = VALUES(label),
  model_url = VALUES(model_url),
  aliases = VALUES(aliases),
  description = VALUES(description);
