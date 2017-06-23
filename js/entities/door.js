/**
* Door Entity.
*/
game.DoorEntity = me.Entity.extend({

  /**
  * Constructor.
  */
  init : function (x, y, settings) {
    this.padlocks = [];

    // Parse the right color code into an array.
    for (var i = settings.padlocks.length - 1; i >= 0; i--) {
      this.padlocks.push(game.parseColor(settings.padlocks[i]));
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
    this.body.setVelocity(1,1);

    // Disable gravity.
    this.body.gravity = 0;

    // Set renderable animations.
    this.renderable.addAnimation('idle', [0]);
    this.renderable.addAnimation('opened', [3]);
    this.renderable.addAnimation('open', [0, 1, 2], 250);

    this.renderable.setCurrentAnimation('idle');
  },

  /**
  * Open the door.
  */
  open : function (removedLock) {
    // If the door is locked.
    if (this.closed) {
      var index = this.padlocks.indexOf(removedLock);
      if (index > -1) {
        this.padlocks.splice(index, 1);
      }
      if (this.padlocks.length === 0) {
        // Play the opening animation.
        this.renderable.setCurrentAnimation('open', (function () {
          this.renderable.setCurrentAnimation('opened');
          // After this, the door will be opened no matter what.
          this.closed = false;

          // Turn off the collision.
          this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        }).bind(this));
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
  * Colision handler
  * (called when colliding with other objects).
  */
  onCollision : function (response, other) {
    // Make all other objects non solid.
    return false;
  }
});
