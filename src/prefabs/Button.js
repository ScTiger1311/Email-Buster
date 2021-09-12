class Button extends Phaser.GameObjects.Sprite {
    /*
    the json file must include 3 frames, named button_neutral, button_hover, button_down
    you must load the atlas. for example
          this.load.atlas("play", "./assets/spritesheets/button_spritesheet.png", "./assets/spritesheets/button_spritesheet.json");
    in order to use it to go to another scene
         this.startButton = new Button(this, "play", 200, 450, this.nextScene, ["Pixelroom"]);
    
        nextScene(sceneName)
        {
            this.scene.start(sceneName);
        }
    */
    constructor(scene_, atlas, x, y, funct, args) {
        super(scene_, atlas, x, y);
        this.scene_ = scene_ //the scene to execute the code in
        this.atlas = atlas; //the sprite atlas to reference for the button
        this.funct_ = funct; //the function name to run (don't place parenthesis after it)
        this.args_ = args; //the arguments, as an array
        this.startButton = scene_.add.sprite(x, y, this.atlas).setFrame("button_neutral").setOrigin(0, 0).setInteractive();
        this.mouseButton = false; //true is down, false is up

        this.startButton.on('pointerdown', function () { this.mouseButton = true; }, this)
        this.startButton.on('pointerup', function () { this.mouseButton = false; }, this)
        
        let update = () => {
            /*try 
            {*/
                this.mouseX = this.scene_.input.mousePointer.x;
                this.mouseY = this.scene_.input.mousePointer.y;
                if (this.mouseX > this.startButton.x
                    && this.mouseX < this.startButton.x + this.startButton.displayWidth
                    && this.mouseY > this.startButton.y
                    && this.mouseY < this.startButton.y + this.startButton.displayHeight) {
                    this.startButton.setFrame("button_hover");
                    if (this.mouseButton == true) {
                        this.startButton.setFrame("button_down");
                        this.mouseButton = false;
                        this.funct_.apply(this.scene_, this.args_);
                    }
                }
                else {
                    this.startButton.setFrame("button_neutral");
                }
            /*} 
            catch (error)
            {
                console.log("Error in Button.js: " + error);
            }*/
            
        }
        this._removeButton = () => 
        {
            this.startButton.off('pointerdown', function () { this.mouseButton = true; }, this)
            this.startButton.off('pointerup', function () { this.mouseButton = false; }, this)
            this.startButton.disableInteractive();
            this.startButton.destroy();
            this.destroy();
        }
        this.setHeight = (heightPix) =>
        {
            this.startButton.displayHeight = heightPix;
        }
        this.setWidth = (widthPix) =>
        {
            this.startButton.displayWidth = widthPix;
        }
        scene_.events.on("update", function () { update(); });
    }
}