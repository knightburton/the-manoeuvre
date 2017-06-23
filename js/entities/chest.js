/**
* Chest Entity.
*/
game.ChestEntity = me.Entity.extend({

  /**
  * Constructor
  */
  init : function (x, y, settings) {
    // Store the color based on the Tiled color information.
    this.color = game.parseColor(settings.color);
    this.chestId = settings.chestId;

    settings.image = "chests";
    settings.framewidth = 32;
    settings.frameheight = 32;
    settings.anchorPoint = new me.Vector2d(0.5, 0.5);

    // Call the constructor.
    this._super(me.Entity, 'init', [x, y , settings]);
    this.name = 'chest';

    // Close the chest by default.
    this.closed = true;

    // Fix the chest on the map.
    this.body.setVelocity(0, 0);
    this.body.setMaxVelocity(0, 0);
    this.body.garavity = 0;
    this.body.collisionType = me.collision.types.ACTION_OBJECT;

    // ALWAYS update.
    this.alwaysUpdate = true;

    // Calculate the correct frame line.
    this.numberOfFrames = 2;
    this.frameLine = this.numberOfFrames * this.color;

    // add animation.
    this.renderable.addAnimation('closed', [0 + this.frameLine]);
    this.renderable.addAnimation('opened', [1 + this.frameLine]);

    this.renderable.setCurrentAnimation('closed');
  },

  /**
  * Open the chest and show the treasure in it.
  */
  open : function () {
    // If the chest is locked.
    if (this.closed) {
      var index = game.data.obtainedKeys.indexOf(this.color);
      if (index > -1) {
        // Remove the key from the global obtained key stash.
        game.data.obtainedKeys.splice(index, 1);

        // Open the chest.
        if (!this.renderable.isCurrentAnimation('opened')) {
          this.renderable.setCurrentAnimation('opened');
        }
        this.closed = false;

        // Enable, show the inner key.
        game.keys.filter(key => key.chestNumber === this.chestId)[0].enableKey();

        me.timer.setTimeout(() => {
          this.body.collisionType = me.collision.types.NO_OBJECT;
        }, 500);

        return true;
      }
    }

    return false;
  },

  /**
  * Update the entity.
  */
  update : function (dt) {

    // Apply physics to the body (this moves the entity).
    this.body.update(dt);

    // Handle collisions against other shapes.
    me.collision.check(this);

    // Return true if we moved or if the renderable was updated
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
