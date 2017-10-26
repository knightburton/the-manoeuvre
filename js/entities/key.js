/**
 * Key entitiy.
 */
game.KeyEntity = me.CollectableEntity.extend({

  /**
   * Constructor
   */
  init(x, y, settings) {
    this.color = game.parseColor(settings.color);
    this.isHidden = settings.isHidden;
    this.chestNumber = settings.chestNumber;

    settings.image = 'keys';
    settings.framewidth = 32;
    settings.frameheight = 32;

    // Redefine the shapes ans renderable position.
    settings.anchorPoint = new me.Vector2d(0.5, 0.5);
    settings.shapes = [new me.Rect(5, 11, 22, 10)];

    // Call the super constructor.
    this._super(me.CollectableEntity, 'init', [x, y, settings]);
    this.name = 'key';

    // Set the collision based on the hidden property.
    if (this.isHidden) {
      this.body.collisionType = me.collision.types.NO_OBJECT;
    } else {
      this.body.collisionType = me.collision.types.COLLECTABLE_OBJECT;
    }

    // Calculate the correct frame line.
    this.numberOfFrames = 12;
    this.animationLine = this.numberOfFrames * this.color;

    if (this.isHidden) {
      this.renderable.alpha = 0;
    }

    // Add an idle animation.
    this.renderable.addAnimation('idle', [
      0 + this.animationLine,
      1 + this.animationLine,
      2 + this.animationLine,
      3 + this.animationLine,
      4 + this.animationLine,
      5 + this.animationLine,
      6 + this.animationLine,
      7 + this.animationLine,
      8 + this.animationLine,
      9 + this.animationLine,
      10 + this.animationLine,
      11 + this.animationLine,
    ], 200);

    // Set the default animation.
    this.renderable.setCurrentAnimation('idle');
  },

  /**
   * Enable the key.
   */
  enable() {
    this.renderable.alpha = 1;
    this.renderable.flicker(500);
    this.body.collisionType = me.collision.types.COLLECTABLE_OBJECT;
  },

  /**
   * Collision handling.
   */
  onCollision(/* response */) {
    if (game.data.obtainedKeys.indexOf(this.color) === -1) {
      game.data.obtainedKeys.push(this.color);

      // Play a key collected sound.
      me.audio.play('collect');
    }

    // Avoid further collision and delete it.
    this.body.setCollisionMask(me.collision.types.NO_OBJECT);

    // Remove the key from the map.
    me.game.world.removeChild(this);

    return false;
  },
});
