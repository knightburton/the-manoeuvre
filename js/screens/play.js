game.PlayScreen = me.ScreenObject.extend({
  /**
  *  Action to perform on state change.
  */
  onResetEvent: function() {
    // Play audio track.
    me.audio.playTrack("arpanauts");

    // Load the first level.
    me.levelDirector.loadLevel("level-one");

    // Reset the score.
    game.data.score = 0;
    
    // Add our HUD to the game world.
    this.HUD = new game.HUD.Container();
    me.game.world.addChild(this.HUD);
  },

  /**
  *  Action to perform when leaving this screen (state change).
  */
  onDestroyEvent: function() {
    // Remove the HUD from the game world.
    me.game.world.removeChild(this.HUD);

    // Stop the current audio track.
    me.audio.stopTrack();
  }
});
