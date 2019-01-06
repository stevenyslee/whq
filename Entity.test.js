Entity = require('./Entity.js');

describe('Entity', () => {
  beforeAll(() => {
    let testEntity;
    let entityId;
    let entity;
    let expected;
  });

  test('Graph with no cycles', () => {
    entityId = 2;
    entity = {
      "entities": [{
        "entity_id": 1,
        "name": "EntityA"
      }, {
        "entity_id": 2,
        "name": "EntityB"
      }, {
        "entity_id": 3,
        "name": "EntityC",
      }],
      "links": [{
        "from": 1,
        "to": 2
      }, {
        "from": 2,
        "to": 3
      }]
    };
    expected = {
      "entities": [{
        "entity_id": 1,
        "name": "EntityA"
      }, {
        "entity_id": 2,
        "name": "EntityB"
      }, {
        "entity_id": 3,
        "name": "EntityC",
      }, {
        "entity_id": 4,
        "name": "EntityB"
      }, {
        "entity_id": 5,
        "name": "EntityC",
      }],
      "links": [{
        "from": 1,
        "to": 2
      }, {
        "from": 2,
        "to": 3
      }, {
        "from": 1,
        "to": 4
      }, {
        "from": 4,
        "to": 5
      }]
    };
    testEntity = new Entity(entity, entityId);
    expect(testEntity.entity).toMatchObject(expected);
  });

  test('Graph has cycle', () => {
    entityId = 2;
    entity = {
      "entities": [{
        "entity_id": 1,
        "name": "EntityA"
      }, {
        "entity_id": 2,
        "name": "EntityB"
      }, {
        "entity_id": 3,
        "name": "EntityC",
      }, {
        "entity_id": 4,
        "name": "EntityD",
      }],
      "links": [{
        "from": 1,
        "to": 2
      }, {
        "from": 2,
        "to": 3
      }, {
        "from": 3,
        "to": 4
      }, {
        "from": 4,
        "to": 1
      }]
    };
    expected = {
      "entities": [{
        "entity_id": 1,
        "name": "EntityA"
      }, {
        "entity_id": 2,
        "name": "EntityB"
      }, {
        "entity_id": 3,
        "name": "EntityC",
      }, {
        "entity_id": 4,
        "name": "EntityD"
      }, {
        "entity_id": 5,
        "name": "EntityB"
      }, {
        "entity_id": 6,
        "name": "EntityC"
      }, {
        "entity_id": 7,
        "name": "EntityD",
      }, {
        "entity_id": 8,
        "name": "EntityA"
      }],
      "links": [{
        "from": 1,
        "to": 2
      }, {
        "from": 2,
        "to": 3
      }, {
        "from": 3,
        "to": 4
      }, {
        "from": 4,
        "to": 1
      }, {
        "from": 1,
        "to": 5
      }, {
        "from": 5,
        "to": 6
      }, {
        "from": 6,
        "to": 7
      }, {
        "from": 7,
        "to": 8
      }, {
        "from": 8,
        "to": 5
      }]
    };
    testEntity = new Entity(entity, entityId);
    expect(testEntity.entity).toMatchObject(expected);
  });

  test('Graph has child with two parents', () => {
    entityId = 3;
    entity = {
      "entities": [{
        "entity_id": 1,
        "name": "EntityA"
      }, {
        "entity_id": 2,
        "name": "EntityB"
      }, {
        "entity_id": 3,
        "name": "EntityC",
      }, {
        "entity_id": 4,
        "name": "EntityD",
      }],
      "links": [{
        "from": 1,
        "to": 3
      }, {
        "from": 2,
        "to": 3
      }, {
        "from": 3,
        "to": 4
      }]
    };
    expected = {
      "entities": [{
        "entity_id": 1,
        "name": "EntityA"
      }, {
        "entity_id": 2,
        "name": "EntityB"
      }, {
        "entity_id": 3,
        "name": "EntityC",
      }, {
        "entity_id": 4,
        "name": "EntityD"
      }, {
        "entity_id": 5,
        "name": "EntityC"
      }, {
        "entity_id": 6,
        "name": "EntityD"
      }],
      "links": [{
        "from": 1,
        "to": 3
      }, {
        "from": 2,
        "to": 3
      }, {
        "from": 3,
        "to": 4
      }, {
        "from": 1,
        "to": 5
      }, {
        "from": 2,
        "to": 5
      }, {
        "from": 5,
        "to": 6
      }]
    };
    testEntity = new Entity(entity, entityId);
    expect(testEntity.entity).toMatchObject(expected);
  });

  // test('Graph has parent with two Children', () => {
  //   // expect(testEntity).toHaveProperty('cloneEntity', Function);
  // });
});

