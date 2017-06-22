/**
* Spike Entity.
*/
game.SpikeEntity = me.Entity.extend({

  /**
  * Constructor
  */
  init : function (x, y, settings) {
    // Call the constructor.
    this._super(me.Entity, 'init', [x, y , settings]);
    this.name = 'spike';

    // Fix every spike on the map.
    this.body.setVelocity(0, 0);
    this.body.setMaxVelocity(0, 0);
    this.body.garavity = 0;
    this.body.collisionType = me.collision.types.ENEMY_OBJECT;

    // ALWAYS update.
    this.alwaysUpdate = true;
  },

  /**
  * Update the entity.
  */
  update : function (dt) {

    // apply physics to the body (this moves the entity).
    this.body.update(dt);

    // Handle collisions against other shapes.
    me.collision.check(this);

    // Return true if we moved or if the renderable was updated.
    return (this._super(me.Entity, 'update', [dt]));
  },

  /**
  * Colision handler
  * (called when colliding with other objects).
  */
  onCollision : function (response, other) {
    // Make all other objects solid.
    return false;
  }
});
