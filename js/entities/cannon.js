/**
 * Cannon Entity
 */
game.CannonEntity = me.Entity.extend({

    /**
     * constructor
     */
    init : function (x, y, settings) {
        // set the correct block image
        settings.image = "cannon";
        settings.framewidth = 32;
        settings.frameheight = 64;
        settings.anchorPoint = new me.Vector2d(0.5, 1);

        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);
        this.name = 'cannon';

        // fix every spring on the map
        this.body.setVelocity(0, 0);
        this.body.setMaxVelocity(0, 0);
        this.body.garavity = 0;
        this.body.collisionType = me.collision.types.ACTION_OBJECT;

        // turn on the updates
        this.alwaysUpdate = true;

        // add an idle and fire animation
        this.renderable.addAnimation('idle', [1]);
        this.renderable.addAnimation('fire', [2, 3, 0], 200);

        this.renderable.setCurrentAnimation('idle');
    },

    /**
     * start a spring specific action
     *  - play the push animation
     */
    action : function () {
        if (!this.renderable.isCurrentAnimation('fire')) {
            this.renderable.setCurrentAnimation('fire', 'idle');
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
        switch (other.body.collisionType) {
            case me.collision.types.ENEMY_OBJECT : {
                // if the cannonSpike is at the start position
                if (other.name === 'cannonSpike') {
                    // use the fire action
                    this.action();
                }
            } break;
        }
        // Make all other objects solid
        return false;
    }
});