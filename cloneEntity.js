const fs = require('fs');
Entity = require('./Entity.js');

const content = fs.readFileSync(process.argv[2], 'utf8');
const entity = JSON.parse(content);
const entityId = process.argv[3];

const clonedEntity = new Entity(entity, entityId);

fs.writeFileSync('./output.json', JSON.stringify(clonedEntity.entity, null, 2), 'utf8');

module.exports = Entity;
