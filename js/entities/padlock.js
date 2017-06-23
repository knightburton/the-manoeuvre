/**
* Padlock entitiy.
*/
game.PadlockEntity = me.CollectableEntity.extend({
  /**
  * Constructor
  */
  init: function (x, y, settings) {
    this.color = game.parseColor(settings.color);
    this.doorNumber = settings.doorNumber;

    this.name = "padlock";

    settings.image = "padlocks";
    settings.framewidth = 32;
    settings.frameheight = 32;
    // Set the renderable position to center.
    settings.anchorPoint = new me.Vector2d(0.5, 0.5);
    settings.shapes = [new me.Rect(6, 4, 20, 24)];

    // Call the super constructor.
    this._super(me.CollectableEntity, "init", [x, y , settings]);
    this.body.collisionType = me.collision.types.ACTION_OBJECT;

    // Calculate the correct frame line.
    this.numberOfFrames = 6;
    this.animationLine = this.numberOfFrames * this.color;

    // add an idle animation.
    this.renderable.addAnimation('idle', [
      0 + this.animationLine,
      1 + this.animationLine,
      2 + this.animationLine,
      3 + this.animationLine,
      4 + this.animationLine,
      5 + this.animationLine,
    ], 200);

    // set the default animation.
    this.renderable.setCurrentAnimation('idle');
  },

  /**
  * Open the padlock and remove from the world.
  */
  open: function() {
    var index = game.data.obtainedKeys.indexOf(this.color);
    if (index > -1) {
      // Remove the key from the stash.
      game.data.obtainedKeys.splice(index, 1);

      this.renderable.flicker(300, () => {
        // Remove the padlock from the map.
        me.game.world.removeChild(this);

        for (var i = 0; i < game.doors.length; i++) {
          if (game.doors[i].doorNumber === this.doorNumber) {
            game.doors[i].open(this.color);
            break;
          }
        }
      });
      return true;
    }

    return false;
  },

  /**
  * Collision handling.
  */
  onCollision : function (response, other) {
    return false;
  }
});
