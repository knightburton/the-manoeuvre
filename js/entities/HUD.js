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
    this.addChild(new game.HUD.ScoreItem(5, 5));
  }
});


/**
* A basic HUD item to display score.
*/
game.HUD.ScoreItem = me.Renderable.extend({
  /**
  * Constructor
  */
  init: function(x, y) {

    // Call the parent constructor
    // (size does not matter here).
    this._super(me.Renderable, 'init', [x, y, 10, 10]);

    // Local copy of the global score.
    this.score = -1;
  },

  /**
  * Update function.
  */
  update : function () {
    // We don't do anything fancy here, so just
    // return true if the score has been updated.
    if (this.score !== game.data.score) {
      this.score = game.data.score;
      return true;
    }
    return false;
  },

  /**
  * Draw the score.
  */
  draw : function (context) {
    // Draw it baby!
  }

});
