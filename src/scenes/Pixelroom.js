class Pixelroom extends Phaser.Scene {
    constructor() {
        super("Pixelroom");
    }

    //if you plan on using assets, you can load them here to load it at the start of the scene. Or, you can load them on the fly.
    preload() {
        this.load.image("PixelroomBG", "./assets/single_sprites/Pixel_Room_BG.png");
        this.load.image("Figure", "./assets/single_sprites/Figure.png");
        this.load.image("Figure_Pink", "./assets/single_sprites/Figure_Pink.png");
        this.load.atlas("Arrow", "./assets/spritesheets/Arrow.png", "./assets/spritesheets/Arrow.json");
        this.load.atlas("button", "./assets/spritesheets/button_spritesheet.png", "./assets/spritesheets/button_spritesheet.json"); //this one is used as a test button
    }

    //runs once, after preload, just as the scene starts
    create() {
        console.log("entered the Pixelroom.js scene");
        this.anims.create(
            {
                key: "Arrow_Anim",
                frameRate: 2,
                frames: this.anims.generateFrameNames( "Arrow",
                {
                    prefix: "Arrow_0",
                    start: 1,
                    end: 2,
                    first: 1,
                }),
                repeat: -1,
            }
        )
        this.playerScale = 15; //the scale of the player sprite
        this.movespeed = 10; //in pixels per 1/60th of a second
        this.dayOver = false; //has the player checked their emails for today? true/false/"inShopMenu"
        this.dayNumber = 0; //0 is the first day, and includes the whole tutorial
        this.justSwitchedFromPlayScene = false; 
        this.floorheight = 734;
        this.playerPaused = false;
        this.bgSprite = this.add.sprite(0, 0, "PixelroomBG").setOrigin(0, 0);
        this.player = this.add.sprite(900, 734, "Figure").setOrigin(0, 1).setScale(this.playerScale); //sets the default position of the player
        this.arrow = this.add.sprite(0, 0, "Arrow").setOrigin(0, 1).setScale(this.playerScale/2).setAlpha(0,0,0,0);
        this.arrow.play("Arrow_Anim");
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.tutorialText = this.add.text(600, 220, "Welcome to Email Buster!\nUse the left/right arrow keys to move." ,
        { 
            fontFamily: 'Tahoma, "Goudy Bookletter 1911", Times, serif',
            fontSize: "40px",
            color: "#000000",
            align: "center",
        }).setOrigin(0.5,0);
        this.movementArrowLeft = this.add.sprite(this.player.x - 90, this.player.y + 10 - this.player.displayHeight, "Arrow").setOrigin(0,0).setAngle(-90).setScale(this.playerScale/2);
        this.movementArrowLeft.play("Arrow_Anim");
        this.movementArrowRight = this.add.sprite(this.player.x + 90, this.player.y + 10 - this.player.displayHeight, "Arrow").setOrigin(1,1).setAngle(90).setScale(this.playerScale/2);
        this.movementArrowRight.play("Arrow_Anim");
    }

    update(time, delta) {
        let deltaMultiplier = (delta / 16.66667); //for refresh rate indepence

        if(this.justSwitchedFromPlayScene === true) //code in here runs once whenever you come from the play scene.
        {
            this.justSwitchedFromPlayScene = false;
            if(this.dayNumber === 0) //the code that runs the end of day events
            {
                this.delayedCallTimer = this.time.delayedCall(950, this.endOfDayEvent, [0], this);
            }
        }

        //handles the very basic and limited movement
        if(this.playerPaused === false)
        {
            if(keyLEFT.isDown == true && this.player.x > 62)
            {
                this.player.x -= this.movespeed * deltaMultiplier;
                if(this.movementArrowLeft !== 0)
                {
                    this.movementArrowLeft.destroy();
                    this.movementArrowLeft = 0;
                    this.movementArrowRight.destroy();
                    this.movementArrowRight = 0;
                    this.tutorialText.destroy();
                    this.tutorialText = 0;
                }
            }
            if(keyRIGHT.isDown === true && this.player.x < game.config.width - 58 - this.player.width * this.playerScale)
            {
                this.player.x += this.movespeed * deltaMultiplier;
            }
    
            if( this.player.x > 70 && this.player.x < 210 && this.dayOver === false) //if the player is near to their PC and the day isn't over yet
            {
                this.arrow.x = this.player.x;
                this.arrow.y = this.player.y - 300;
                this.arrow.alpha = 1;
                if(keyUP.isDown == true)
                {
                    this.dayOver = true;
                    this.justSwitchedFromPlayScene = true; //switches this to true, the immediately sleeps the scene. Upon switching back the code will execute.
                    this.scene.switch("Play");
                }
            }
            else
            {
                this.arrow.alpha = 0;
            }
    
            if( this.player.x > 810 && this.player.x < 990 && this.dayOver === true) //if the player is near to the door, and the day is over
            {
                this.arrow.x = this.player.x;
                this.arrow.y = this.player.y - 300;
                this.arrow.alpha = 1;
                if(keyUP.isDown == true) //end the day, pause the players movement, and open the shop/nighttime menu
                {
                    this.dayOver = "inShopMenu"
                    this.playerPaused = true;
                    this.cameras.main.fade(1000, 20, 20, 20, true, this.openShopMenu);
                    this.openShopMenu();
                }
            }
        }
    }

    openShopMenu(camera, complete) //this gets called once every frame until the fade effect is done. When it's done, the callback sets "complete" to 1
    {
        if(complete === 1)
        {
            this.cameras.main.fadeFrom(200, 20, 20, 20, true);
            this.shopBG = this.add.rectangle(0, 0, 1200, 900, 0x202020).setOrigin(0,0);
            this.nextDayButton = new Button (this, "button", 575, 620, this.closeShopMenu)
            this.dayOverText = this.add.text(600, 230, "You head home after a long day of work.\nYou wake the next day feeling re-engergized and ready for more.\n\n\n\n\n\nContinue" ,
            { 
                fontFamily: 'Tahoma, "Goudy Bookletter 1911", Times, serif',
                fontSize: "40px",
                color: "#ffffff",
                align: "center",
            }).setOrigin(0.5,0);
        }
    }

    closeShopMenu()
    {
        this.nextDayButton._removeButton();
        this.shopBG.destroy();
        this.dayOverText.destroy();
        this.cameras.main.fadeFrom(200, 20, 20, 20, true);
        this.dayNumber++;
        this.dayOver = false;
        this.playerPaused = false;
        this.removeEndOfDayEvent();
    }

    endOfDayEvent(eventNumber) //runs the event, under the event number specified
    {
        if(eventNumber === 0) //the tutorial event, mainly used to prompt the player into leaving the room
        {
            this.tutorialText = this.add.text(600, 230, "Nice job today! Looks like your shift is over.\nYou can head home now." ,
            { 
                fontFamily: 'Tahoma, "Goudy Bookletter 1911", Times, serif',
                fontSize: "40px",
                color: "#000000",
                align: "center",
            }).setOrigin(0.5,0);
            this.npcSprite = this.add.sprite(900, 734, "Figure_Pink").setOrigin(0, 1).setScale(this.playerScale);
        }
    }

    removeEndOfDayEvent() //just removes all of the end of day event related stuff
    {
        this.tutorialText.destroy();
        this.npcSprite.destroy();
    }
}