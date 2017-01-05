
/* Game namespace */
var game = {

    // an object where to store game information
    data : {
        // score
        currentLevel : 1,
        deathCounter: 0
    },


    // Run on page load.
    "onload" : function () {
        // Initialize the video.
        if (!me.video.init(960, 640, {
            wrapper : "screen",
            scale : "auto",
            //scaleMethod: "flex-width",
            renderer: me.video.AUTO,
            subPixel: false
        })) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // set and load all resources.
        me.loader.preload(game.resources, this.loaded.bind(this));
    },

    // Run on game resources loaded.
    "loaded" : function () {
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());

        // add our player entity in the entity pool
        me.pool.register("player", game.PlayerEntity);

        // add some global keyboard shortcuts
        me.event.subscribe(me.event.KEYDOWN, function (action, keyCode /*, edge */) {
            // toggle fullscreen on/off
            if (keyCode === me.input.KEY.F) {
                if (!me.device.isFullscreen) {
                    me.device.requestFullscreen();
                } else {
                    me.device.exitFullscreen();
                }
            }
        });

        // Start the game.
        me.state.change(me.state.PLAY);
    }
};
