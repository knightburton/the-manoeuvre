/**
 * Padlock entitiy
 */
game.PadlockEntity = me.CollectableEntity.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        this.color = game.parseColor(settings.color);

        settings.image = "padlocks";
        settings.framewidth = 32;
        settings.frameheight = 32;
        // set the renderable position to center
        settings.anchorPoint = new me.Vector2d(0.5, 0.5);
        settings.shapes = [new me.Rect(6, 4, 20, 24)];

        // call the super constructor
        this._super(me.CollectableEntity, "init", [x, y , settings]);
        this.body.collisionType = me.collision.types.COLLECTABLE_OBJECT;

        // calculate the correct frame line
        this.numberOfFrames = 6;
        this.animationLine = this.numberOfFrames * this.color;

        // add an idle animation
        this.renderable.addAnimation('idle', [
            0 + this.animationLine,
            1 + this.animationLine,
            2 + this.animationLine,
            3 + this.animationLine,
            4 + this.animationLine,
            5 + this.animationLine,
        ], 200);

        // set the default animation
        this.renderable.setCurrentAnimation('idle');
    },

    /**
     * collision handling
     */
    onCollision : function (response, other) {
        switch (other.body.collisionType) {
            case me.collision.types.PLAYER_OBJECT: {
                for (var i = game.data.obtainedKeys.length - 1; i >= 0; i--) {
                    if (game.data.obtainedKeys[i] === this.color) {

                        // avoid further collision
                        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
                        
                        this.renderable.flicker(400, (function () {
                            // remove the padlock from the map
                            me.game.world.removeChild(this);
                        }).bind(this));
                    }
                }
            } break;
        }

        return false;
    }
});
