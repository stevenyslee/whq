const fs = require("fs");

const content = fs.readFileSync(process.argv[2], 'utf8');
const entity = JSON.parse(content);
const entityId = process.argv[3];

function Entity(entity, entityId) {
  this.entity = entity;
  this.maxId = null;
  this.ancestors = {};
  this.nodesToClone = [];
  this.adjacencyList = {};
  this.cloneEntity(entityId);
}

Entity.prototype.cloneEntity = function(entityId) {
  // create adjacency list
  this.createAdjacencyList();

  this.adjacencyList[entityId].from.forEach((parent) => {
    this.nodesToClone.push([entityId, parent]);
  });

  while(this.nodesToClone.length) {
    let tuplet = this.nodesToClone.shift();
    let seenBefore = false;
    let newNodeId;
    if (!this.ancestors[tuplet[0]]) {
      newNodeId = this.addNode(tuplet[0]);
    } else {
      seenBefore = true;
    }

    // add to links for parents
    newNodeId ? this.addLink(newNodeId, tuplet[1]) : this.addLink(tuplet[0], tuplet[1]);
    this.addLink(newNodeId || tuplet[0], tuplet[1]);

    if (!seenBefore) {
      this.adjacencyList[tuplet[0]].to.forEach((child) => {
        this.nodesToClone.push([child, newNodeId]);
      });
    }
  }
};

Entity.prototype.addNode = function(node) {
  let entity = { 
    entity_id: ++this.maxId, 
    name: this.adjacencyList[node].name
  };
  if (this.adjacencyList[node].description) {
    entity.description = this.adjacencyList[node].description;
  }
  this.entity.entities.push(entity);
  return this.maxId;
};

Entity.prototype.addLink = function(child, parent) {
  let link = {
    from: parent,
    to: child
  };
  this.entity.links.push(link);
};

Entity.prototype.createAdjacencyList = function() {
  this.entity.entities.forEach((entity) => {
    if (entity.entity_id > this.maxId || this.maxId === null) {
      this.maxId = entity.entity_id;
    }
    this.adjacencyList[entity.entity_id] = { 
      name: entity.name,
      description: entity.description,
      to: [],
      from: []
    };
  });
    console.log(this.adjacencyList);
  this.entity.links.forEach((link) => {
    this.adjacencyList[link.from].to.push(link.to);
    this.adjacencyList[link.to].from.push(link.from);
  });
};

const clonedEntity = new Entity(entity, entityId);

fs.writeFileSync('./output.json', JSON.stringify(clonedEntity.entity, null, 2), 'utf8');
