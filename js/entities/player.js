/**
* Player Entity.
*/
game.PlayerEntity = me.Entity.extend({

  /**
  * Constructor
  */
  init : function(x, y, settings) {
    settings.image = "thevrjani";
    settings.framewidth = 32;
    settings.frameheight = 64;

    // Define the shapes.
    this.normalShape = new me.Rect(6, 0, 26, 64);
    this.crouchShape = new me.Rect(6, 32, 26, 32);

    // Reduce the entity's "hitbox".
    settings.shapes = [this.normalShape];

    this.action = {
      enabled: false,
      other: null
    };

    // Call the constructor.
    this._super(me.Entity, 'init', [x, y , settings]);
    this.name = "player";
    this.body.collisionType = me.collision.types.PLAYER_OBJECT;

    // Store some information about spawn.
    this.spawnPosition = new me.Vector2d(x, y);
    this.spawnGravity = this.body.gravity;

    // Set the multiple jump.
    this.multipleJump = 1;

    // Set the dying and respawning flag.
    this.dying = false;
    this.respawning = false;

    // Flag for shape state.
    this.isShapeModified = false;

    // Set the velocity of the blayer's body - walking & jumping speed.
    this.WALK_SPEED = 3.8;
    this.VERTICAL_SPEED = 12.5;
    this.ACCELERATED_VERTICAL_SPEED = 18.5;
    this.body.setVelocity(this.WALK_SPEED, this.VERTICAL_SPEED);
    this.body.setFriction(1, 0);
    this.accelerated = false;

    // Entity can exit the viewport (jumping, falling into a hole, etc.).
    this.alwaysUpdate = true;

    // Set the display around our position.
    me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);

    // Add some keyboard shortcut.
    me.input.bindKey(me.input.KEY.LEFT, "left");
    me.input.bindKey(me.input.KEY.RIGHT, "right");
    me.input.bindKey(me.input.KEY.Z, "jump", true);
    me.input.bindKey(me.input.KEY.UP, "jump", true);
    me.input.bindKey(me.input.KEY.DOWN, "down");
    me.input.bindKey(me.input.KEY.X, "action", true);

    // Add some gamepad shortcut.
    me.input.bindGamepad(0,
      {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_1},
      me.input.KEY.UP
    );
    me.input.bindGamepad(0,
      {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_2},
      me.input.KEY.UP
    );
    me.input.bindGamepad(0,
      {type: "buttons", code: me.input.GAMEPAD.BUTTONS.DOWN},
      me.input.KEY.DOWN
    );
    me.input.bindGamepad(0,
      {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_3},
      me.input.KEY.DOWN
    );
    me.input.bindGamepad(0,
      {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_4},
      me.input.KEY.DOWN
    );
    me.input.bindGamepad(0,
      {type: "buttons", code: me.input.GAMEPAD.BUTTONS.LEFT},
      me.input.KEY.LEFT
    );
    me.input.bindGamepad(0,
      {type: "buttons", code: me.input.GAMEPAD.BUTTONS.RIGHT},
      me.input.KEY.RIGHT
    );

    // Map axes.
    me.input.bindGamepad(0,
      {type:"axes", code: me.input.GAMEPAD.AXES.LX, threshold: -0.5},
      me.input.KEY.LEFT
    );
    me.input.bindGamepad(0,
      {type:"axes", code: me.input.GAMEPAD.AXES.LX, threshold: 0.5},
      me.input.KEY.RIGHT
    );
    me.input.bindGamepad(0,
      {type:"axes", code: me.input.GAMEPAD.AXES.LY, threshold: -0.5},
      me.input.KEY.UP
    );

    // Set renderable and animations.
    this.renderable.addAnimation('idle', [0, 1, 2], 250);
    this.renderable.addAnimation('walk', [10, 11, 12, 13, 15, 16, 17, 18], 100);
    this.renderable.addAnimation('jump', [3]);
    this.renderable.addAnimation('crouch',
      [
        {name: 5, delay: 2000},
        {name: 6, delay: 2000},
        {name: 7, delay: 250},
        {name: 8, delay: 250}
      ]
    );
    this.renderable.addAnimation('die',
      [
        20, 21, 22, 23, 24,
        {name: 19, delay: 500}
      ], 100
    );

    // Set the current animation.
    this.renderable.setCurrentAnimation('idle');
  },

  /**
  * Choose between stand and crounch shapes based on crounch state.
  */
  modifyShape : function(crouch) {
    // Remove the current shape.
    this.body.removeShapeAt(0);
    if (crouch) {
      // Add crounch shape.
      this.body.addShape(this.crouchShape);
      this.isShapeModified = true;
      this.renderable.anchorPoint = new me.Vector2d(0.5, 0.75);
    } else {
      // Add stand shape.
      this.body.addShape(this.normalShape);
      this.isShapeModified = false;
      this.renderable.anchorPoint = new me.Vector2d(0.5, 0.5);
    }
  },

  /**
  * Accelerate the entity.
  */
  speedUp : function() {
    this.body.setVelocity(this.WALK_SPEED, this.ACCELERATED_VERTICAL_SPEED);
    this.accelerated = true;
  },

  /**
  * Deccelerate the entity.
  */
  speedDown : function() {
    if (this.accelerated) {
      this.body.setVelocity(this.WALK_SPEED, this.VERTICAL_SPEED);
      this.accelerated = false;
    }
  },

  /**
  * "Move up" the entity.
  */
  jump : function() {
    this.body.jumping = true;
    if (this.multipleJump <= 2) {
      // Play a jump sound.
      me.audio.play("jump");

      // Easy "math" for double jump.
      this.body.vel.y -= (this.body.maxVel.y * this.multipleJump++)
                         * me.timer.tick;

      if (!this.renderable.isCurrentAnimation('jump')) {
        this.renderable.setCurrentAnimation('jump');
      }
    }
  },

  /**
  * Kill the entity.
  */
  die : function() {
    // Play a hurt sound.
    me.audio.play("hurt");

    // Increase the dc.
    game.data.deathCounter++;

    // Poor player....
    this.dying = true;

    // Turn off the further collision.
    this.body.collisionType = me.collision.types.NO_OBJECT;

    // Stop the entity.
    this.body.gravity = 0;
    this.body.setVelocity(0, 0);
    this.body.setFriction(0, 0);
  },

  /**
  * Reset the entity to the spawn position.
  */
  reset : function() {
    // Set the flags.
    this.dying = false;
    this.respawning = true;

    // Set the velocity back to normal.
    this.body.setVelocity(this.WALK_SPEED, this.VERTICAL_SPEED);
    this.body.setFriction(1, 0);

    // Reset the entity position to the spawn position.
    this.pos.x = this.spawnPosition.x;
    this.pos.y = this.spawnPosition.y;

    // Reset the gravity and jump flag.
    this.body.jumping = false;
    this.body.gravity = this.spawnGravity;

    // Turn back the further collision.
    this.body.collisionType = me.collision.types.PLAYER_OBJECT;
  },

  /**
  * Update the entity.
  */
  update : function(dt) {
    // If the entity is dying.
    if (this.dying) {
      if (!this.renderable.isCurrentAnimation("die")) {
        this.renderable.setCurrentAnimation("die", () => {
          this.reset();
        });
      }
      // If the entity is respawning.
    } else if (this.respawning) {
        this.renderable.setCurrentAnimation('idle');
        this.respawning = false;
    } else {
      // If the user press a key.

      if (me.input.isKeyPressed('jump')) {
        this.jump();
      } else if (!this.body.falling && !this.body.jumping) {
        // Reset the multipleJump flag if on the ground.
        this.multipleJump = 1;
      } else if (this.body.falling && this.multipleJump < 2) {
        // Reset the multipleJump flag if falling.
        this.multipleJump = 2;
      }

      // Reset the vertical speed after an accelerated jump.
      if (this.accelerated && this.body.vel.y === 0) {
        this.speedDown();
      }

      if (me.input.isKeyPressed('right')) {
        this.body.vel.x += this.body.accel.x * me.timer.tick;
        this.renderable.flipX(false);
        if (!this.renderable.isCurrentAnimation('walk')) {
          this.renderable.setCurrentAnimation('walk');
        }
      } else if (me.input.isKeyPressed('left')) {
        this.body.vel.x -= this.body.accel.x * me.timer.tick;
        this.renderable.flipX(true);
        if (!this.renderable.isCurrentAnimation('walk')) {
          this.renderable.setCurrentAnimation('walk');
        }
      } else if (me.input.isKeyPressed('down')) {
        if (!this.renderable.isCurrentAnimation('crouch')) {
          this.renderable.setCurrentAnimation('crouch');
          if (!this.isShapeModified) {
            this.modifyShape(true);
          }
        }
      } else if (this.body.vel.x === 0 && this.body.vel.y === 0) {
        if (!this.renderable.isCurrentAnimation("idle")) {
          this.renderable.setCurrentAnimation("idle");
        }
      }

      // Allow to use the action button while moving.
      if (me.input.isKeyPressed('action') && this.action.enabled) {
        if ((this.action.other.name === 'padlock'
            || this.action.other.name === 'chest')
            && Math.abs(this.action.other.pos.x - this.pos.x) <= 50)
        {
          if (this.action.other.open()) {
            this.action.other = null;
          }
          this.action.enabled = false;
        }
      }
    }

    // If the down key was released and thaeshape was modified
    // go back to the normal shape.
    if (this.isShapeModified && !me.input.keyStatus('down')) {
      this.modifyShape(false);
    }

    // Apply physics to the body (this moves the entity).
    this.body.update(dt);

    // Handle collisions against other shapes.
    me.collision.check(this);

    // Return true if we moved or if the renderable was updated.
    return (this._super(me.Entity, 'update', [dt])
            || this.body.vel.x !== 0
            || this.body.vel.y !== 0);
  },

  /**
  * Collision handler
  * (called when colliding with other objects).
  */
  onCollision : function(response, other) {
    switch (other.body.collisionType) {
      case me.collision.types.WORLD_SHAPE: {
        // Simulate a platform effect.
        if (other.type === "platform") {
          if (this.body.falling &&
            !me.input.isKeyPressed("down") &&
            // Shortest overlap would move the player upward.
            (response.overlapV.y > 0) &&
            // The velocity is reasonably fast enough
            // to have penetrated to the overlap depth.
            (~~this.body.vel.y >= ~~response.overlapV.y)
          ) {
            // Disable collision on the x axis.
            response.overlapV.x = 0;

            // Repond to the platform (it is solid).
            return true;
          }
          // Do not respond to the platform (pass through).
          return false;
        }
      } break;
      case me.collision.types.ENEMY_OBJECT: {
        // It is gonne be 'ouch'.
        if (other.name === 'spike'
            || other.name === 'floatingSpike'
            || other.name === 'cannonSpike'
            || other.name === 'rotarySpike')
        {
          this.die();
        }
      } break;
      case me.collision.types.ACTION_OBJECT : {
        // If the entity jumped onto a spring.
        if (other.name === 'spring') {
          if ((response.overlapV.y > 0) && this.body.falling) {
            // Accelerate the entity.
            this.speedUp();

            // Force the jump with accelerated vertical speed.
            this.jump();

            // Play the spring animation.
            other.action();
          }
        } else if (other.name === 'padlock' || other.name === 'chest') {
          this.action.enabled = true;
          this.action.other = other;
        }
      } break;
      default:
      // Do not respond to other objects (e.g. coins).
      return false;
    }

    // Make all other objects solid.
    return true;
  }
});
