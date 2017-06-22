/**
* A HUD container and child items.
*/
game.HUD = game.HUD || {};

game.HUD.Container = me.Container.extend({

  init: function() {
    // Call the constructor.
    this._super(me.Container, 'init');

    // Persistent across level change.
    this.isPersistent = true;

    // Make sure we use screen coordinates.
    this.floating = true;

    // Give a name.
    this.name = "HUD";

    // Add our child score object at the top left corner.
    this.addChild(new game.HUD.DeathItem(5, 5));
    this.addChild(new game.HUD.KeyItem(5, 5));
  }
});


/**
* A basic HUD item to display deaths.
*/
game.HUD.DeathItem = me.Renderable.extend({
  /**
  * Constructor
  */
  init: function(x, y) {

    // Call the parent constructor
    // (size does not matter here).
    this._super(me.Renderable, 'init', [x, y, 5, 5]);

    // Create the font object.
    this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'), 1, "left", "bottom");

    // Local copy of the global score.
    this.dc = -1;
  },

  /**
  * Update function.
  */
  update : function () {
    // We don't do anything fancy here, so just
    // return true if the score has been updated.
    if (this.dc !== game.data.deathCounter) {
      this.dc = game.data.deathCounter;
      return true;
    }
    return false;
  },

  /**
  * Draw the score.
  */
  draw : function (context) {
    // This.pos.x, this.pos.y are the relative position
    // from the screen right bottom.
    this.font.draw (context, "Deaths: " + this.dc, this.pos.x, me.game.viewport.height + this.pos.y - 10);
  }

});

/**
* A basic HUD item to display collected keys.
*/
game.HUD.KeyItem = me.Renderable.extend({
  /**
  * Constructor
  */
  init: function(x, y) {

    // Call the parent constructor
    // (size does not matter here).
    this._super(me.Renderable, 'init', [x, y, 5, 5]);

    // Create the font object.
    this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'), 1, "left", "bottom");

    this.preloadKeySprites = [];
    for (var key in game.colors) {
      var spr = new me.Sprite(0, 0, {
        image : "keys",
        framewidth : 32,
        frameheight : 32,
        anchorPoint : new me.Vector2d(0.5, 0.5)
      });
      this.preloadKeySprites.push(spr);
    }

    // Local copy of the global keys.
    this.keys = [];
  },

  /**
  * Update function.
  */
  update : function (dt) {
    // We don't do anything fancy here, so just
    // return true if the keys array has been updated.
    if (this.keys.length !== game.data.obtainedKeys) {
      this.keys = [];
      for (var i = 0; i < game.data.obtainedKeys.length; i++) {
        this.keys[i] = game.data.obtainedKeys[i];
      }
      return true;
    }
    return false;
  },

  /**
  * Draw the score.
  */
  draw : function (context) {
    // This.pos.x, this.pos.y are the relative position
    // from the screen right bottom.
    this.font.draw (context, "Keys: ", this.pos.x, me.game.viewport.height + this.pos.y - 25);
    for (var i = 0; i < this.keys.length; i++) {
      this.preloadKeySprites[this.keys[i]].pos.x = this.pos.x + 90 + (32 * i);
      this.preloadKeySprites[this.keys[i]].pos.y = me.game.viewport.height + this.pos.y - 30;
      this.preloadKeySprites[this.keys[i]].setAnimationFrame(12 * this.keys[i]);
      this.preloadKeySprites[this.keys[i]].draw(context);
    }
  }

});
