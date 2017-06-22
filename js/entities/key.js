/**
 * Key entitiy
 */
game.KeyEntity = me.CollectableEntity.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        this.color = game.parseColor(settings.color);
        this.isHidden = settings.isHidden;
        this.chestNumber = settings.chestNumber;

        settings.image = "keys";
        settings.framewidth = 32;
        settings.frameheight = 32;

        // redefine the shapes ans renderable position
        settings.anchorPoint = new me.Vector2d(0.5, 0.5);
        settings.shapes = [new me.Rect(5, 11, 22, 10)];

        // call the super constructor
        this._super(me.CollectableEntity, "init", [x, y , settings]);
        this.name = "key";

        // set the collision based on the hidden property
        if (this.isHidden) {
            this.body.collisionType = me.collision.types.NO_OBJECT;
        } else {
            this.body.collisionType = me.collision.types.COLLECTABLE_OBJECT;
        }

        // calculate the correct frame line
        this.numberOfFrames = 12;
        this.animationLine = this.numberOfFrames * this.color;

        if (this.isHidden) {
            this.renderable.alpha = 0;
        }

        // add an idle animation
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
            11 + this.animationLine
        ], 200);

        // set the default animation
        this.renderable.setCurrentAnimation('idle');
    },

    /**
     * enable the key
     */
    enableKey : function () {
        this.renderable.alpha = 1;
        this.renderable.flicker(500);
        this.body.collisionType = me.collision.types.COLLECTABLE_OBJECT;
    },

    /**
     * collision handling
     */
    onCollision : function (/*response*/) {
        if (game.data.obtainedKeys.indexOf(this.color) === -1) {
            game.data.obtainedKeys.push(this.color);

            // Play a key collected sound.
            me.audio.play("collect");
        }

        //avoid further collision and delete it
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);

        // remove the key from the map
        me.game.world.removeChild(this);

        return false;
    }
});
