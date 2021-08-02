class Pixelroom extends Phaser.Scene {
    constructor() {
        super("Pixelroom");
    }

    //if you plan on using assets, you can load them here to load it at the start of the scene. Or, you can load them on the fly.
    preload() {
        this.load.image("PixelroomBG", "./assets/single_sprites/Pixel_Room_BG.png");
        this.load.image("Figure", "./assets/single_sprites/Figure.png");
        this.load.image("Arrow", "./assets/single_sprites/Arrow.png");
    }

    //runs once, after preload, just as the scene starts
    create() {
        console.log("entered the Pixelroom.js scene");
        this.playerScale = 15; //the scale of the player sprite
        this.movespeed = 10; //in pixels per 1/60th of a second
        this.floorheight = 734;
        this.bgSprite = this.add.sprite(0, 0, "PixelroomBG").setOrigin(0, 0);
        this.player = this.add.sprite(900, 734, "Figure").setOrigin(0, 1).setScale(this.playerScale); //sets the default position of the player
        this.arrow = this.add.sprite(0, 0, "Arrow").setOrigin(0, 1).setScale(this.playerScale/2).setAlpha(0,0,0,0);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    }

    update(time, delta) {
        let deltaMultiplier = (delta / 16.66667); //for refresh rate indepence

        //handles the very basic and limited movement
        if(keyLEFT.isDown == true && this.player.x > 62)
        {
            this.player.x -= this.movespeed * deltaMultiplier;
        }
        if(keyRIGHT.isDown == true && this.player.x < game.config.width - 58 - this.player.width * this.playerScale)
        {
            this.player.x += this.movespeed * deltaMultiplier;
        }

        if( this.player.x > 60 && this.player.x < 200 )
        {
            this.arrow.x = this.player.x;
            this.arrow.y = this.player.y - 300;
            this.arrow.alpha = 1;
            if(keyUP.isDown == true)
            {
                this.scene.start("Play");
            }
        }
        else
        {
            this.arrow.alpha = 0;
        }
    }
}