/**
 * CannonSpike Entity
 */
game.CannonSpikeEntity = me.Entity.extend({

    /**
     * constructor
     */
    init : function (x, y, settings) {
        // store the are size defined in Tiled
        var width = settings.width;
        var height = settings.height;

        // store the slow mode
        this.slowMode = settings.slowMode;

        // load the tileset image
        settings.image = "tileset";

        // adjust the size setting information to match the sprite size
        settings.framewidth = settings.width = 32;
        settings.frameheight = settings.height = 32;
        settings.anchorPoint = new me.Vector2d(0.5, 0.5);

        // redefine the shapes
        settings.shapes = [new me.Rect(0, 0, settings.framewidth, settings.frameheight)];

        // call the parent constructor
        this._super(me.Entity, 'init', [x, y , settings]);
        this.name = 'cannonSpike';
        this.body.collisionType = me.collision.types.ENEMY_OBJECT;

        // set the entity's velocity based on the slowMode option
        if (this.slowMode) {
            this.body.setVelocity(0, 2);
        } else {
            this.body.setVelocity(0, 4);
        }
        
        // reverse the gravity
        this.body.gravity = -this.body.gravity;

        // set the start/end position based on stored size
        this.startY = y + height - settings.frameheight;
        this.endY = y;

        // set the position
        this.pos.y = this.startY;

        // ALWAYS update
        this.alwaysUpdate = true;


        this.renderable.addAnimation('invisible', [164]);
        this.renderable.addAnimation('move', [132, 148], 150);

        this.renderable.setCurrentAnimation('move');
    },

    /**
     * update the entity
     */
    update : function (dt) {
        // if the spike at the end of the line
        if (this.pos.y <= this.endY) {
            // go back to the start position
            this.pos.y = this.startY;
        }

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