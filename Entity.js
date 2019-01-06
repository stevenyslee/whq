function Entity(entity, entityId) {
  this.entity = entity;
  this.maxId = null;
  this.ancestors = {};
  this.nodesToClone = [];
  this.adjacencyList = {};
  this.cloneEntity(entityId);
}

Entity.prototype.cloneEntity = function(entityId) {
  // Create adjacency List
  this.createAdjacencyList();

  // Create initial parents
  this.adjacencyList[entityId].from.forEach((parent) => {
    this.nodesToClone.push([entityId, parent]);
  });

  if (!this.adjacencyList[entityId].from.length) {
      this.nodesToClone.push([entityId, null])
  }

  while(this.nodesToClone.length) {
    let tuplet = this.nodesToClone.shift();
    let seenBefore = false;
    let newNodeId;

    // Create new node if does not exist
    if (!this.ancestors[tuplet[0]]) {
      newNodeId = this.addNode(tuplet[0]);
    } else {
      seenBefore = true;
    }

    // Add link from parent to child
    newNodeId ? this.addLink(newNodeId, tuplet[1]) : this.addLink(this.ancestors[tuplet[0]], tuplet[1]);

    // Create traverse graph if node not seen before
    if (!seenBefore) {
      this.adjacencyList[tuplet[0]].to.forEach((child) => {
        this.nodesToClone.push([child, newNodeId]);
      });
    }
  }
};

Entity.prototype.addNode = function(node) {
  let name = this.adjacencyList[node].name;
  let entity_id = ++this.maxId;
  let description = this.adjacencyList[node].description;

  let entity = { 
    entity_id, 
    name
  };

  if (description) {
    entity.description = description;
  }

  this.entity.entities.push(entity);
  this.ancestors[node] = entity_id;

  return entity_id;
};

Entity.prototype.addLink = function(to, from) {
  if (!to || !from) {
      return;
  }
  let link = {
    from,
    to
  };

  return this.entity.links.push(link);
};

Entity.prototype.createAdjacencyList = function() {
  // Create entities
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

  // Create links between entities
  this.entity.links.forEach((link) => {
    this.adjacencyList[link.from].to.push(link.to);
    this.adjacencyList[link.to].from.push(link.from);
  });
};

module.exports = Entity;