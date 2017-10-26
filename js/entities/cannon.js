/**
 * Cannon Entity.
 */
game.CannonEntity = me.Entity.extend({

  /**
   * Constructor
   */
  init(x, y, settings) {
    // Set the proper image.
    settings.image = 'cannon';
    settings.framewidth = 32;
    settings.frameheight = 64;
    settings.anchorPoint = new me.Vector2d(0.5, 1);

    // Call the constructor.
    this._super(me.Entity, 'init', [x, y, settings]);

    this.name = 'cannon';

    // Fix the cannon on the map.
    this.body.setVelocity(0, 0);
    this.body.setMaxVelocity(0, 0);
    this.body.garavity = 0;
    this.body.collisionType = me.collision.types.ACTION_OBJECT;

    // Turn on the updates.
    this.alwaysUpdate = true;

    // Add an idle and fire animation.
    this.renderable.addAnimation('idle', [1]);
    this.renderable.addAnimation('fire', [2, 3, 0], 200);

    this.renderable.setCurrentAnimation('idle');
  },

  /**
   * Open FIRE!
   */
  fire() {
    if (!this.renderable.isCurrentAnimation('fire')) {
      this.renderable.setCurrentAnimation('fire', 'idle');
    }
  },

  /**
   * Update the entity.
   */
  update(dt) {
    // apply physics to the body (this moves the entity).
    this.body.update(dt);

    // Handle collisions against other shapes.
    me.collision.check(this);

    // Return true if we moved or if the renderable was updated.
    return (this._super(me.Entity, 'update', [dt]));
  },

  /**
   * Collision handler.
   */
  onCollision(response, other) {
    switch (other.body.collisionType) {
      case me.collision.types.ENEMY_OBJECT:
        // If the cannonSpike is at the start (spawn) position.
        if (other.name === 'cannonSpike') {
          // Use the fire action.
          this.fire();
        }
        break;
      default:
        break;
    }
    // Make all other objects solid.
    return false;
  },
});
