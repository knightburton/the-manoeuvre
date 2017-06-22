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
  * Open the chest.
  */
  open : function () {
    var ok = false;
    // If the chest is locked.
    if (this.closed) {
      for (var i = game.data.obtainedKeys.length - 1; i >= 0; i--) {
        // If the player has the correct key.
        if (game.data.obtainedKeys[i] == this.color) {

          // Remove the key.
          game.data.obtainedKeys.splice(i, 1);
          ok = true;
          break;
        }
      }

      if (ok) {
        // Open the door.
        if (!this.renderable.isCurrentAnimation('opened')) {
          this.renderable.setCurrentAnimation('opened');
        }
        this.closed = false;
        return true;
      } else {
        //TODO: HUD needed.
        return false;
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
    switch (other.body.collisionType) {
      case me.collision.types.PLAYER_OBJECT : {
        if (this.open()) {
          for (var i = game.keys.length - 1; i >= 0; i--) {

            // Enable the correct key, based on the chest Number.
            if (game.keys[i].chestNumber == this.chestId) {
              game.keys[i].enableKey();

              // Disable the colliison on this after 500ms.
              me.timer.setTimeout((function () {
                this.body.collisionType = me.collision.types.NO_OBJECT;
              }).bind(this), 500);

              break;
            }
          }
        }
      } break;
    }
    // Make all other objects solid.
    return false;
  }
});
