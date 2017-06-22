/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init : function (x, y, settings) {
        settings.image = "thevrjani";
        settings.framewidth = 32;
        settings.frameheight = 64;

        // define the shapes
        this.normalShape = new me.Rect(6, 0, 26, 64);
        this.crouchShape = new me.Rect(6, 32, 26, 32);

        // reduce the entity's "hitbox"
        settings.shapes = [this.normalShape];

        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);
        this.name = "player";
        this.body.collisionType = me.collision.types.PLAYER_OBJECT;

        // store some information about spawn
        this.spawnPosition = new me.Vector2d(x, y);
        this.spawnGravity = this.body.gravity;

        // set the multiple jump
        this.multipleJump = 1;

        // set the dying and respawning flag
        this.dying = false;
        this.respawning = false;

        // flag for shape state
        this.isShapeModified = false;

        // set the velocity of the blayer's body - walking & jumping speed
        this.WALK_SPEED = 3.8;
        this.VERTICAL_SPEED = 12.5;
        this.ACCELERATED_VERTICAL_SPEED = 18.5;
        this.body.setVelocity(this.WALK_SPEED, this.VERTICAL_SPEED);
        this.body.setFriction(1, 0);
        this.accelerated = false;

        // entity can exit the viewport (jumping, falling into a hole, etc.)
        this.alwaysUpdate = true;

        // set the display around our position
        me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);

        // add some keyboard shortcut
        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.X,     "jump", true);
        me.input.bindKey(me.input.KEY.UP,    "jump", true);
        me.input.bindKey(me.input.KEY.DOWN,  "down");

        //add some gamepad shortcut
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_1}, me.input.KEY.UP);
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_2}, me.input.KEY.UP);
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.DOWN}, me.input.KEY.DOWN);
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_3}, me.input.KEY.DOWN);
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_4}, me.input.KEY.DOWN);
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.LEFT}, me.input.KEY.LEFT);
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.RIGHT}, me.input.KEY.RIGHT);
        // map axes
        me.input.bindGamepad(0, {type:"axes", code: me.input.GAMEPAD.AXES.LX, threshold: -0.5}, me.input.KEY.LEFT);
        me.input.bindGamepad(0, {type:"axes", code: me.input.GAMEPAD.AXES.LX, threshold: 0.5}, me.input.KEY.RIGHT);
        me.input.bindGamepad(0, {type:"axes", code: me.input.GAMEPAD.AXES.LY, threshold: -0.5}, me.input.KEY.UP);

        // set renderable and animations
        this.renderable.addAnimation('idle', [0, 1, 2], 250);
        this.renderable.addAnimation('walk', [10, 11, 12, 13, 15, 16, 17, 18], 100);
        this.renderable.addAnimation('jump', [3]);
        this.renderable.addAnimation('crouch', [{name: 5, delay: 2000}, {name: 6, delay: 2000}, {name: 7, delay: 250}, {name: 8, delay: 250}]);
        this.renderable.addAnimation('die', [20, 21, 22, 23, 24, 25, 26, 27 ,28, 29, 30 ,31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49], 25);
        this.renderable.addAnimation('respawn', [49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20], 25);

        //set the current animation
        this.renderable.setCurrentAnimation('idle');
    },

    /**
     * choose between stand and crounch shapes based on crounch state
     */
    modifyShape : function (crouch) {
        // remove the current shape
        this.body.removeShapeAt(0);
        if (crouch) {
            // add crounch shape
            this.body.addShape(this.crouchShape);
            this.isShapeModified = true;
            this.renderable.anchorPoint = new me.Vector2d(0.5, 0.75);
        } else {
            // add stand shape
            this.body.addShape(this.normalShape);
            this.isShapeModified = false;
            this.renderable.anchorPoint = new me.Vector2d(0.5, 0.5);
        }
    },

    /**
     * accelerate the entity
     */
    speedUp : function () {
        this.body.setVelocity(this.WALK_SPEED, this.ACCELERATED_VERTICAL_SPEED);
        this.accelerated = true;
    },

    /**
     * deccelerate the entity
     */
    speedDown : function () {
        if (this.accelerated) {
            this.body.setVelocity(this.WALK_SPEED, this.VERTICAL_SPEED);
            this.accelerated = false;
        }
    },

    /**
     * "move up" the entity
     */
    jump : function () {
        this.body.jumping = true;
        if (this.multipleJump <= 2) {
            // Play a jump sound.
            me.audio.play("jump");

            // easy "math" for double jump
            this.body.vel.y -= (this.body.maxVel.y * this.multipleJump++) * me.timer.tick;
            if (!this.renderable.isCurrentAnimation('jump')) {
                this.renderable.setCurrentAnimation('jump');
            }
        }
    },

    /**
     * kill the entity
     */
    die : function () {
        // Play a hurt sound.
        me.audio.play("hurt");

        // increase the dc
        game.data.deathCounter++;

        // poor player....
        this.dying = true;

        // turn off the further collision
        this.body.collisionType = me.collision.types.NO_OBJECT;

        // stop the entity
        this.body.gravity = 0;
        this.body.setVelocity(0, 0);
        this.body.setFriction(0, 0);
    },

    /**
     * reset the entity to the spawn position
     */
    reset : function () {
        // set the flags
        this.dying = false;
        this.respawning = true;

        // reset the entity position to the spawn position
        this.pos.x = this.spawnPosition.x;
        this.pos.y = this.spawnPosition.y;

        // reset the gravity and jump flag
        this.body.jumping = false;
        this.body.gravity = this.spawnGravity;

        // turn back the further collision
        this.body.collisionType = me.collision.types.PLAYER_OBJECT;

        // set the velocity back to normal
        this.body.setVelocity(this.WALK_SPEED, this.VERTICAL_SPEED);
        this.body.setFriction(1, 0);
    },

    /**
     * update the entity
     */
    update : function (dt) {
        // if the entity is dying
        if (this.dying) {
            this.renderable.flicker(100, (function () {
                this.reset();
            }).bind(this));
            if (!this.renderable.isCurrentAnimation("die")) {
                this.renderable.setCurrentAnimation("die", (function () {
                    this.reset();
                }).bind(this));
            }
        // if the entity is respawning
        } else if (this.respawning) {
            if (!this.renderable.isCurrentAnimation('respawn')) {
                this.renderable.setCurrentAnimation('respawn', (function () {
                    this.respawning = false;
                }).bind(this));
            }
        } else {
            // if the user press a key
            if (me.input.isKeyPressed('jump')) {
                this.jump();
            } else if (!this.body.falling && !this.body.jumping) {
                // reset the multipleJump flag if on the ground
                this.multipleJump = 1;
            } else if (this.body.falling && this.multipleJump < 2) {
                // reset the multipleJump flag if falling
                this.multipleJump = 2;
            }

            // reset the vertical speed after an accelerated jump
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
        }

        // if the down key was released and tha shape was modified
        // go back to the normal shape
        if (this.isShapeModified && !me.input.keyStatus('down')) {
            this.modifyShape(false);
        }

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        switch (other.body.collisionType) {
            case me.collision.types.WORLD_SHAPE: {
                // simulate a platform effect
                if (other.type === "platform") {
                    if (this.body.falling &&
                        !me.input.isKeyPressed("down") &&
                        // Shortest overlap would move the player upward
                        (response.overlapV.y > 0) &&
                        // The velocity is reasonably fast enough to have penetrated to the overlap depth
                        (~~this.body.vel.y >= ~~response.overlapV.y)
                    ) {
                        // Disable collision on the x axis
                        response.overlapV.x = 0;

                        // Repond to the platform (it is solid)
                        return true;
                    }
                    // Do not respond to the platform (pass through)
                    return false;
                }
            } break;
            case me.collision.types.ENEMY_OBJECT: {
                // it is gonne be 'ouch'
                if (other.name === 'spike' ||
                    other.name === 'floatingSpike' ||
                    other.name === 'cannonSpike' ||
                    other.name === 'rotarySpike') {
                    this.die();
                }
            } break;
            case me.collision.types.ACTION_OBJECT : {
                // if the entity jumped onto a spring
                if (other.name === 'spring') {
                    if ((response.overlapV.y > 0) && this.body.falling) {
                        // accelerate the entity
                        this.speedUp();

                        // force the jump with accelerated vertical speed
                        this.jump();

                        // play the spring animation
                        other.action();
                    }
                }
            } break;
            default:
                // Do not respond to other objects (e.g. coins)
                return false;
        }

        // Make all other objects solid
        return true;
    }
});
