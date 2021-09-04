class Checkbox extends Phaser.GameObjects.Sprite {
    //the json file must include 3 frames, named button_neutral, button_hover, button_down
    //you must load the atlas. for example
    //      this.load.atlas("play", "./assets/spritesheets/button_spritesheet.png", "./assets/spritesheets/button_spritesheet.json");
    //in order to use it to go to another scene
    //      this.my_checkbox = new Checkbox(this, "play", 200, 450);
    constructor(scene_, atlas, x, y) {
        super(scene_, atlas, x, y);
        this.scene_ = scene_ //the scene to execute the code in
        this.atlas = atlas; //the sprite atlas to reference for the button
        
        this.checkbox = scene_.add.sprite(x, y, this.atlas).setFrame("button_neutral").setOrigin(0, 0).setInteractive();
        this.mouseButton = false; //true is down, false is up
        this.value = false; //stores the value, whether it's pressed or not

        this.checkbox.on('pointerdown', function () { this.mouseButton = true; }, this)
        this.checkbox.on('pointerup', function () { this.mouseButton = false; }, this)
        
        let update = () => {
            try 
            {
                this.mouseX = this.scene_.input.mousePointer.x;
                this.mouseY = this.scene_.input.mousePointer.y;
                if (this.mouseX > this.checkbox.x
                    && this.mouseX < this.checkbox.x + this.checkbox.displayWidth
                    && this.mouseY > this.checkbox.y
                    && this.mouseY < this.checkbox.y + this.checkbox.displayHeight) {
                    //this.checkbox.setFrame("button_hover");
                    if (this.mouseButton == true && this.value == false) {
                        this.checkbox.setFrame("button_down");
                        this.mouseButton = false;
                        this.value = true;
                    }
                    else if(this.mouseButton == true && this.value == true)
                    {
                        this.checkbox.setFrame("button_neutral");
                        this.mouseButton = false;
                        this.value = false;
                    }
                }

            } 
            catch (error)
            {
                console.log("Error in Checkbox.js: " + error);
            }
            
        }
        this._removeCheckbox = () => 
        {
            this.checkbox.off('pointerdown', function () { this.mouseButton = true; }, this)
            this.checkbox.off('pointerup', function () { this.mouseButton = false; }, this)
            this.checkbox.disableInteractive();
            this.checkbox.destroy();
            this.destroy();
        }
        this.setHeight = (heightPix) =>
        {
            this.checkbox.displayHeight = heightPix;
        }
        this.setWidth = (widthPix) =>
        {
            this.checkbox.displayWidth = widthPix;
        }
        this.getValue = () =>
        {
            return this.value;
        }
        scene_.events.on("update", function () { update(); });
    }
}