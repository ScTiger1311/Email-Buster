class Button extends Phaser.GameObjects.Sprite {
    //the json file must include 3 frames, named button_neutral, button_hover, button_down
    //you must load the atlas. for example
    //      this.load.atlas("play", "./assets/spritesheets/button_spritesheet.png", "./assets/spritesheets/button_spritesheet.json");
    //in order to use it to go to another scene
    //      this.startButton = new Button(this, "play", 200, 450, function(){this.scene.start("Play");});
    constructor(scene_, atlas, x, y, funct) {
        super(scene_, atlas, x, y);
        this.scene_ = scene_
        this.atlas = atlas;
        this.funct = funct;
        this.startButton = scene_.add.sprite(x, y, this.atlas).setFrame("button_neutral").setOrigin(0, 0).setInteractive();
        this.mouseButton = false; //true is down, false is up

        this.startButton.on('pointerdown', function () { this.mouseButton = true; }, this)
        this.startButton.on('pointerup', function () { this.mouseButton = false; }, this)
        
        let update = () => {
            try 
            {
                this.mouseX = this.scene.input.mousePointer.x;
                this.mouseY = this.scene.input.mousePointer.y;
                if (this.mouseX > this.startButton.x
                    && this.mouseX < this.startButton.x + this.startButton.width
                    && this.mouseY > this.startButton.y
                    && this.mouseY < this.startButton.y + this.startButton.height) {
                    this.startButton.setFrame("button_hover");
                    if (this.mouseButton == true) {
                        this.startButton.setFrame("button_down");
                        this.mouseButton = false;
                        this.scene_.funct();
                    }
                }
                else {
                    this.startButton.setFrame("button_neutral");
                }
            } 
            catch (error)
            {
                console.log("Error in Button.js: " + error);
            }
            
        }
        this._removeButton = () => 
        {
            this.scene_.events.removeListener("update");
            this.startButton.destroy();
            this.destroy();
        }
        scene_.events.on("update", function () { update(); });
    }
}