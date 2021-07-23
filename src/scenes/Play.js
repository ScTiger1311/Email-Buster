class Play extends Phaser.Scene {
    constructor() {
        super("Play");
    }

    preload() {
        this.load.image("Mail1_Real", "./assets/single_sprites/Mail1_Real.png");
        this.load.image("Mail1_Fake", "./assets/single_sprites/Mail1_Fake.png");
        this.load.atlas("clearbutton_red", "./assets/spritesheets/clearbutton_red.png", "./assets/spritesheets/clearbutton_red.json"); //this one is used for testing/debugging purposes
        this.load.atlas("clearbutton", "./assets/spritesheets/clearbutton.png", "./assets/spritesheets/clearbutton.json"); //this one is used as an invisible hitbox
        this.load.atlas("button", "./assets/spritesheets/button_spritesheet.png", "./assets/spritesheets/button_spritesheet.json"); //this one is used as an actual button
    }

    create() {
        console.log("entered the Play.js scene");
        this.newBg("Mail1_Real");
    }

    update(time, delta) {
        let deltaMultiplier = (delta / 16.66667); //for refresh rate indepence
    }

    newBg(image) //takes a new background image as a string and applies it
    {
        this.bgSprite = this.add.sprite(0, 0, image).setOrigin(0, 0);
        this.nextButton = new Button(this, "button", 1000, 700, this.funct = function(){this.newBg("Mail1_Fake");});
    }
}