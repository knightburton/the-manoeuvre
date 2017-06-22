/**
* Spike Entity.
*/
game.SpringEntity = me.Entity.extend({

  /**
  * Constructor
  */
  init : function (x, y, settings) {
    // Set the type based on Tiled information.
    if (settings.isRegularBlock) {
      this.type = 0;
    } else {
      this.type = 1;
    }

    settings.image = "springs";
    settings.framewidth = 32;
    settings.frameheight = 32;
    settings.anchorPoint = new me.Vector2d(0, 1);

    // Change the hitbox.
    settings.shapes = [new me.Rect(0, 19, 32, 13)];

    // Call the constructor.
    this._super(me.Entity, 'init', [x, y, settings]);
    this.name = 'spring';

    // Fix every spring on the map.
    this.body.setVelocity(0, 0);
    this.body.setMaxVelocity(0, 0);
    this.body.garavity = 0;
    this.body.collisionType = me.collision.types.ACTION_OBJECT;
    this.alwaysUpdate = true;

    this.numberOfFrames = 6;
    this.animationLine = this.numberOfFrames * this.type;

    // Set renderable animations.
    this.renderable.addAnimation('idle', [0 + this.type * 6]);
    this.renderable.addAnimation('push', [
      1 + this.animationLine,
      2 + this.animationLine,
      3 + this.animationLine,
      4 + this.animationLine,
      5 + this.animationLine
    ], 50);

    // Set the current animation.
    this.renderable.setCurrentAnimation('idle');
  },

  /**
  * Start a spring specific action
  * play the push animation.
  */
  action : function () {
    if (!this.renderable.isCurrentAnimation('push')) {
      this.renderable.setCurrentAnimation('push', 'idle');
    }
  },

  /**
  * Update the entity.
  */
  update : function (dt) {
    // Apply physics to the body (this moves the entity).
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
