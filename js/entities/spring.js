/**
 * Spike Entity
 */
game.SpringEntity = me.Entity.extend({

    /**
     * constructor
     */
    init : function (x, y, settings) {
        // set the type based on Tiled information
        if (settings.isRegularBlock) {
            this.type = 0;
        } else {
            this.type = 1;
        }
        
        settings.image = "springs";
        settings.framewidth = 32;
        settings.frameheight = 32;
        settings.anchorPoint = new me.Vector2d(0, 1);

        // change the hitbox
        settings.shapes = [new me.Rect(0, 19, 32, 13)];

        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);
        this.name = 'spring';

        // fix every spring on the map
        this.body.setVelocity(0, 0);
        this.body.setMaxVelocity(0, 0);
        this.body.garavity = 0;
        this.body.collisionType = me.collision.types.ACTION_OBJECT;
        this.alwaysUpdate = true;

        this.numberOfFrames = 6;
        this.animationLine = this.numberOfFrames * this.type;

        // set renderable animations
        this.renderable.addAnimation('idle', [0 + this.type * 6]);
        this.renderable.addAnimation('push', [
            1 + this.animationLine,
            2 + this.animationLine,
            3 + this.animationLine,
            4 + this.animationLine,
            5 + this.animationLine
        ], 50);

        // set the current animation
        this.renderable.setCurrentAnimation('idle');
    },

    /**
     * start a spring specific action
     * play the push animation
     */
    action : function () {
        if (!this.renderable.isCurrentAnimation('push')) {
            this.renderable.setCurrentAnimation('push', 'idle');
        }
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
        // Make all other objects solid
        return false;
    }
});