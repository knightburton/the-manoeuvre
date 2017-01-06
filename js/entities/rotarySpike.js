/**
 * RotarySpike Entity
 */
game.RotarySpikeEntity = me.Entity.extend({

    /**
     * constructor
     */
    init : function (x, y, settings) {
        settings.image = "tileset";

        // adjust the size setting information to match the sprite size
        settings.framewidth = settings.width = 32;
        settings.frameheight = settings.height = 32;
        settings.anchorPoint = new me.Vector2d(0.5, 0.5);

        // redefine the shapes
        settings.shapes = [new me.Rect(0, 0, settings.framewidth, settings.frameheight)];

        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);
        this.name = 'rotarySpike';

        // save the start position
        this.startX = this.pos.x;
        this.startY = this.pos.y;

        // fix the spike on the map
        this.body.setVelocity(0, 0);
        this.body.setMaxVelocity(0, 0);
        this.body.garavity = 0;
        this.body.collisionType = me.collision.types.ENEMY_OBJECT;

        // ALWAYS update
        this.alwaysUpdate = true;

        this.renderable.addAnimation('idle', [132]);
        this.renderable.setCurrentAnimation('idle');

        // define the circle path variables
        this.circleAngleStep = 15;
        this.circleAngle = 360 - this.circleAngleStep;
        this.circleRadius = 112;
        this.circleCenterX = this.startX + 128 - 16;
        this.circleCenterY = this.startY + 128 - 16;

        // start moving the spike along the circle path
        me.timer.setInterval((function () {
            this.calculatePosition();
        }).bind(this), 100);
    },

    /**
     * calculate the spike actual position based on the circle path
     */
    calculatePosition : function () {
        this.pos.x = this.circleCenterX + Math.cos(this.circleAngle * Math.PI / 180) * this.circleRadius;
        this.pos.y = this.circleCenterY + Math.sin(this.circleAngle * Math.PI / 180) * this.circleRadius;

        // reset or incriease the angle
        if (this.circleAngle == 0) {
            this.circleAngle = 360 - this.circleAngleStep;
        } else {
            this.circleAngle -= this.circleAngleStep;
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