/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        settings.image = "thevrjani";
        settings.framewidth = 32;
        settings.frameheight = 64;
        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);
        this.name = "player";

        // set the multiple jump
        this.multipleJump = 1;

        // set the crouch false
        this.crouch = false;

        // set the velocity of the blayer's body - walking & jumping speed
        this.WALK_SPEED = 3;
        this.VERTICAL_SPEED = 12;
        this.body.setVelocity(this.WALK_SPEED, this.VERTICAL_SPEED);
        this.body.setFriction(1, 0);

        // player can exit the viewport (jumping, falling into a hole, etc.)
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

        //set the current animation
        this.renderable.setCurrentAnimation('idle');
    },

    /**
     * update the entity
     */
    update : function (dt) {
        if (me.input.isKeyPressed('left')) {
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            this.renderable.flipX(true);
            if (!this.renderable.isCurrentAnimation('walk')) {
                this.renderable.setCurrentAnimation('walk');
            }
        } else if (me.input.isKeyPressed('right')) {
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.renderable.flipX(false);
            if (!this.renderable.isCurrentAnimation('walk')) {
                this.renderable.setCurrentAnimation('walk');
            }
        } else if (me.input.isKeyPressed('down')) {
            if (!this.renderable.isCurrentAnimation('crouch')) {
                this.renderable.setCurrentAnimation('crouch');
            }
        } else {
            if (!this.renderable.isCurrentAnimation('idle')) {
                this.renderable.setCurrentAnimation('idle');
            }
        }

        if (me.input.isKeyPressed('jump')) {
            this.body.jumping = true;
            if (this.multipleJump <= 2) {
                // easy "math" for double jump
                this.body.vel.y -= (this.body.maxVel.y * this.multipleJump++) * me.timer.tick;
            }
        } else if (!this.body.falling && !this.body.jumping) {
            // reset the multipleJump flag if on the ground
            this.multipleJump = 1;
        } else if (this.body.falling && this.multipleJump < 2) {
            // reset the multipleJump flag if falling
            this.multipleJump = 2;
        }

        if (this.body.jumping || this.body.falling) {
            this.renderable.setCurrentAnimation('jump');
        }

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        //TODO: hole check if neccessary

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
            default:
                // Do not respond to other objects (e.g. coins)
                return false;
        }

        // Make all other objects solid
        return true;
    }
});
