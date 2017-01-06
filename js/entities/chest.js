/**
 * Chest Entity
 */
game.ChestEntity = me.Entity.extend({

    /**
     * constructor
     */
    init : function (x, y, settings) {
        // store the color based on the Tiled color information
        this.color = game.parseColor(settings.color);
        this.chestId = settings.chestId;

        settings.image = "chests";
        settings.framewidth = 32;
        settings.frameheight = 32;
        settings.anchorPoint = new me.Vector2d(0.5, 0.5);

        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);
        this.name = 'chest';

        // close the chest by default
        this.closed = true;

        // fix the chest on the map
        this.body.setVelocity(0, 0);
        this.body.setMaxVelocity(0, 0);
        this.body.garavity = 0;
        this.body.collisionType = me.collision.types.ACTION_OBJECT;

        // ALWAYS update
        this.alwaysUpdate = true;

        // calculate the correct frame line
        this.numberOfFrames = 2;
        this.frameLine = this.numberOfFrames * this.color;

        // add animation
        this.renderable.addAnimation('closed', [0 + this.frameLine]);
        this.renderable.addAnimation('opened', [1 + this.frameLine]);

        this.renderable.setCurrentAnimation('closed');
    },

    /**
     * open the chest
     */
    open : function () {
        var ok = false;
        // if the chest is locked
        if (this.closed) {
            for (var i = game.data.obtainedKeys.length - 1; i >= 0; i--) {
                // if the player has the correct key
                if (game.data.obtainedKeys[i] == this.color) {

                    //remove the key
                    game.data.obtainedKeys.splice(i, 1);
                    ok = true;
                    break;
                }
            }

            if (ok) {
                // open the door
                if (!this.renderable.isCurrentAnimation('opened')) {
                    this.renderable.setCurrentAnimation('opened');
                }
                this.closed = false;
                return true;
            } else {
                //TODO: HUD needed
                return false;
            }
        }

        return false;
    },

    /**
     * update the entity
     */
    update : function (dt) {

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]));
    },

    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        switch (other.body.collisionType) {
            case me.collision.types.PLAYER_OBJECT : {
                if (this.open()) {
                    for (var i = game.keys.length - 1; i >= 0; i--) {

                        // enable the correct key, based on the chest Number
                        if (game.keys[i].chestNumber == this.chestId) {
                            game.keys[i].enableKey();

                            // disable the colliison from this after 500ms
                            me.timer.setTimeout((function () {
                                this.body.collisionType = me.collision.types.NO_OBJECT;
                            }).bind(this), 500);
                            
                            break;
                        }
                    }
                }
            } break;
        }
        // Make all other objects solid
        return false;
    }
});