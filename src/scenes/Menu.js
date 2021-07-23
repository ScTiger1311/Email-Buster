class Menu extends Phaser.Scene {
    constructor() {
        super("Menu");
    }

    preload() {
        this.load.image("menu_image", "./assets/single_sprites/Menu.png");

        //3 frames, named button_neutral, button_hover, button_down
        this.load.atlas("play", "./assets/spritesheets/button_spritesheet.png", "./assets/spritesheets/button_spritesheet.json");

    }

    create() {
        console.log("entered the Menu.js scene");
        this.bgSprite = this.add.sprite(0, 0, "menu_image").setOrigin(0, 0);

        //its cursed but you have to use this.scene.scene.start() >:O https://stackoverflow.com/questions/55264077/phaser-3-clickable-sprite-cant-start-scene
        this.startButton = new Button(this, "play", 200, 450, this.funct = function(){this.scene.start("Play");});
    }

    update(time, delta) {
        let deltaMultiplier = (delta / 16.66667); //for refresh rate indepence
    }
}