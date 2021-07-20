class Play extends Phaser.Scene {
    constructor() {
        super("Play");
    }

    preload() {
        this.load.image("play_image", "./assets/single_sprites/Play.png");
    }

    create() {
        console.log("entered the Play.js scene");
        this.menuSprite = this.add.sprite(0, 0, "menu_image").setOrigin(0, 0);
    }

    update(time, delta) {
        let deltaMultiplier = (delta / 16.66667); //for refresh rate indepence
    }
}