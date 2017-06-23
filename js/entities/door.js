/**
* Door Entity.
*/
game.DoorEntity = me.Entity.extend({

  /**
  * Constructor.
  */
  init : function(x, y, settings) {
    this.padlocks = [];

    // Parse the right color code into padlocks.
    for (let value of settings.padlocks) {
      this.padlocks.push(game.parseColor(value));
    }

    this.doorNumber = settings.doorNumber;

    settings.image = 'door';
    settings.framewidth = 64;
    settings.frameheight = 64;

    // Change the hitbox.
    settings.anchorPoint = new me.Vector2d(0.5, 0.5);
    settings.shapes = [new me.Rect(28, 0, 8, 64)];

    // Call the constructor.
    this._super(me.Entity, 'init', [x, y, settings]);

    this.name = 'door';
    this.closed = true;

    this.alwaysUpdate = true;

    // Disable gravity.
    this.body.gravity = 0;
    this.body.setVelocity(1, 1);

    // Set renderable animations.
    this.renderable.addAnimation('idle', [0]);
    this.renderable.addAnimation('opened', [3]);
    this.renderable.addAnimation('open', [0, 1, 2], 250);

    this.renderable.setCurrentAnimation('idle');
  },

  /**
  * Open the door.
  */
  open : function(removedLock) {
    // If the door is locked.
    if (this.closed) {
      this.padlocks.splice(this.padlocks.indexOf(removedLock), 1);

      if (this.padlocks.length === 0) {
        // Play the opening animation.
        this.renderable.setCurrentAnimation('open', () => {
          this.renderable.setCurrentAnimation('opened');
          // After this, the door will be opened no matter what.
          this.closed = false;

          // Turn off the collision.
          this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        });
      }
    }
  },

  /**
  * Update the entity.
  */
  update : function(dt) {
    // Apply physics to the body (this moves the entity).
    this.body.update(dt);

    // Handle collisions against other shapes.
    me.collision.check(this);

    // Return true if we moved or if the renderable was updated.
    return (this._super(me.Entity, 'update', [dt]));
  },

  /**
  * Collision handler
  */
  onCollision : function(response, other) {
    // Make all other objects non solid.
    return false;
  }
});
