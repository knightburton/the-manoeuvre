/**
 * RotarySpike Entity
 */
game.RotarySpikeEntity = me.Entity.extend({

  /**
   * Constructor
   */
  init(x, y, settings) {
    settings.image = 'tileset';
    settings.width = 32;
    settings.height = 32;

    // Adjust the size setting information to match the sprite size.
    settings.framewidth = settings.width;
    settings.frameheight = settings.height;
    settings.anchorPoint = new me.Vector2d(0.5, 0.5);

    // redefine the shapes.
    settings.shapes = [
      new me.Rect(0, 0, settings.framewidth, settings.frameheight),
    ];

    // Call the constructor.
    this._super(me.Entity, 'init', [x, y, settings]);
    this.name = 'rotarySpike';

    // save the start position.
    this.startX = this.pos.x;
    this.startY = this.pos.y;

    // Fix the spike on the map.
    this.body.setVelocity(0, 0);
    this.body.setMaxVelocity(0, 0);
    this.body.garavity = 0;

    this.body.collisionType = me.collision.types.ENEMY_OBJECT;

    // ALWAYS update.
    this.alwaysUpdate = true;

    this.renderable.addAnimation('idle', [132]);
    this.renderable.setCurrentAnimation('idle');

    // Define the circle path variables.
    this.circleAngleStep = 15;
    this.circleAngle = 360 - this.circleAngleStep;
    this.circleRadius = 112;
    this.circleCenterX = this.startX + 128 - 16;
    this.circleCenterY = this.startY + 128 - 16;

    // Start moving the spike along the circle path.
    me.timer.setInterval(() => {
      this.calculatePosition();
    }, 100);
  },

  /**
   * Calculate the spike actual position based on the circle path.
   */
  calculatePosition() {
    this.pos.x = this.circleCenterX +
                 Math.cos(this.circleAngle * Math.PI / 180) *
                 this.circleRadius;

    this.pos.y = this.circleCenterY +
                 Math.sin(this.circleAngle *
                 Math.PI / 180) *
                 this.circleRadius;

    // Reset or incriease the angle.
    if (this.circleAngle === 0) {
      this.circleAngle = 360 - this.circleAngleStep;
    } else {
      this.circleAngle -= this.circleAngleStep;
    }
  },

  /**
   * Update the entity.
   */
  update(dt) {
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
  onCollision() {
    // Make all other objects solid.
    return false;
  },
});
