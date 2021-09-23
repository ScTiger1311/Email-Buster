class Pixelroom extends Phaser.Scene {
    constructor() {
        super("Pixelroom");
    }

    //if you plan on using assets, you can load them here to load it at the start of the scene. Or, you can load them on the fly.
    preload() {
        this.load.image("Pixelroom_BG_Default",     "./assets/single_sprites/Pixelroom_BG_Default.png");
        this.load.image("Pixelroom_BG_Upgrade",     "./assets/single_sprites/Pixelroom_BG_Upgrade.png");
        this.load.image("Pixelroom_Border",         "./assets/single_sprites/Pixelroom_Border.png");
        this.load.image("Pixelroom_Desk_Default",   "./assets/single_sprites/Pixelroom_Desk_Default.png");
        this.load.image("Pixelroom_Desk_Upgrade",   "./assets/single_sprites/Pixelroom_Desk_Upgrade.png");
        this.load.image("Pixelroom_Door",           "./assets/single_sprites/Pixelroom_Door.png");
        this.load.image("Pixelroom_Monitor",        "./assets/single_sprites/Pixelroom_Monitor.png");
        this.load.image("Pixelroom_Plant",          "./assets/single_sprites/Pixelroom_Plant.png");
        this.load.image("Pixelroom_Window",         "./assets/single_sprites/Pixelroom_Window.png");

        this.load.image("Figure", "./assets/single_sprites/Figure.png");
        this.load.image("Figure_Pink", "./assets/single_sprites/Figure_Pink.png");
        this.load.atlas("Arrow", "./assets/spritesheets/Arrow.png", "./assets/spritesheets/Arrow.json");
        this.load.atlas("nextday_button", "./assets/spritesheets/nextday_button.png", "./assets/spritesheets/nextday_button.json");
        this.load.atlas("upgrade_button", "./assets/spritesheets/upgrade_button.png", "./assets/spritesheets/upgrade_button.json");
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
        this.moneyPerDay = 200; //how much money the player gets per day. 
        this.upgradeCostIncrement = 100; //how much the cost of each successive office upgrade is. Also adds a random number 1-10 for giggles
        this.currentUpgradeCost = 100; //how much the cost is, currently. Also sets the initial cost.
        this.plantLevel = 0;
        this.bgLevel = 0;
        this.deskLevel = 0;
        this.windowLevel = 0;
        this.playerScale = 13; //the scale of the player sprite
        this.movespeed = 7; //in pixels per 1/60th of a second
        this.dayOver = false; //has the player checked their emails for today? true/false/"inShopMenu"
        this.dayNumber = 0; //0 is the first day, and includes the whole tutorial
        this.justSwitchedFromPlayScene = false; 
        this.floorheight = 690;
        this.playerPaused = false;
        this.moneyCount = 0; //tracks how much money the player has. Was originally intended to get bonus money from doing well in the email segments, but I don't have time to implement that. Instead, you get a fixed amount per day.

        this.layer_bg = this.add.layer( [this.add.sprite(0, 0, "Pixelroom_BG_Default").setOrigin(0, 0)] ).setDepth(0);
        this.layer_border = this.add.layer( [this.add.sprite(0, 0, "Pixelroom_Border").setOrigin(0, 0)] ).setDepth(1);
        this.layer_door = this.add.layer( [this.add.sprite(0, 0, "Pixelroom_Door").setOrigin(0, 0)] ).setDepth(2);
        this.layer_desk = this.add.layer( [this.add.sprite(0, 0, "Pixelroom_Desk_Default").setOrigin(0, 0)] ).setDepth(3);
        this.layer_monitor = this.add.layer( [this.add.sprite(0, 0, "Pixelroom_Monitor").setOrigin(0, 0)] ).setDepth(4);
        this.layer_window = this.add.layer().setDepth(5);
        this.layer_plant = this.add.layer().setDepth(6);
        this.layer_npc = this.add.layer().setDepth(7);
        this.layer_player = this.add.layer([this.add.sprite(845, this.floorheight, "Figure").setOrigin(0, 1).setScale(this.playerScale)]).setDepth(8); //sets the default position of the player
            this.player = this.layer_player.getAt(0);
        this.layer_text = this.add.layer().setDepth(9);
        this.layer_arrows = this.add.layer([
            this.add.sprite(0, 0, "Arrow").setScale(this.playerScale/2).setAlpha(0,0,0,0).setOrigin(0, 1).play("Arrow_Anim"),
            this.add.sprite(this.player.x - 90, this.player.y + 10 - this.player.displayHeight, "Arrow").setOrigin(0,0).setAngle(-90).setScale(this.playerScale/2).play("Arrow_Anim"),
            this.add.sprite(this.player.x + 90, this.player.y + 10 - this.player.displayHeight, "Arrow").setOrigin(1,1).setAngle(90).setScale(this.playerScale/2).play("Arrow_Anim"),
        ]).setDepth(10);
            this.arrow = this.layer_arrows.getAt(0);
            this.movementArrowLeft = this.layer_arrows.getAt(1);
            this.movementArrowRight = this.layer_arrows.getAt(2);
        this.layer_shop = this.add.layer().setDepth(11);


        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.layer_text.add(
            this.add.text(600, 250, "Welcome to Email Buster!\nUse the left/right arrow keys to move." ,
            { 
                fontFamily: 'Tahoma, "Goudy Bookletter 1911", Times, serif',
                fontSize: "35px",
                color: "#000000",
                align: "center",
            }).setOrigin(0.5,0)).setName("tutorialText");
        this.tutorialText = this.layer_text.getByName("tutorialText");
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
            else if(this.dayNumber === 1)
            {
                this.delayedCallTimer = this.time.delayedCall(950, this.endOfDayEvent, [1], this);
            }
        }

        //handles the very basic and limited movement
        if(this.playerPaused === false)
        {
            if(keyLEFT.isDown == true && this.player.x > 146) // if player presses left, and they aren't too far to the left
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
            if(keyRIGHT.isDown === true && this.player.x < game.config.width - 148 - this.player.width * this.playerScale) // if player presses right, and they aren't too far to the right
            {
                this.player.x += this.movespeed * deltaMultiplier;
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
    
            if( this.player.x > 150 && this.player.x < 260 && this.dayOver === false) //if the player is near to their PC and the day isn't over yet
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
            this.moneyCount += this.moneyPerDay;
            this.cameras.main.fadeFrom(200, 20, 20, 20, true);
            this.layer_shop.add(this.add.rectangle(0, 0, 1200, 900, 0x202020).setOrigin(0,0)).setName("shopBG");
            this.shopBG = this.layer_shop.getByName("shopBG");
            this.layer_shop.add(new Button (this, "nextday_button", 500, 710, this.closeShopMenu, [])).setName("nextDayButton");
            this.nextDayButton = this.layer_shop.getByName("nextDayButton");
            this.nextDayButton.startButton.setDepth(100000); //I just wanna display this on top

            //upgrade Plant
            if(this.plantLevel === 0)
            {
                this.layer_shop.add(new Button (this, "upgrade_button", 300, 375, this.upgradeOffice, ["Plant"])).setName("upgradePlantButton");
                this.upgradePlantButton = this.layer_shop.getByName("upgradePlantButton");
                this.upgradePlantButton.startButton.setDepth(100001);
            }

            //upgrade BG
            if(this.bgLevel === 0)
            {
                this.layer_shop.add(new Button (this, "upgrade_button", 700, 375, this.upgradeOffice, ["BG"])).setName("upgradeBGButton");
                this.upgradeBGButton = this.layer_shop.getByName("upgradeBGButton");
                this.upgradeBGButton.startButton.setDepth(100002);
            }
            
            //upgrade Desk
            if(this.deskLevel === 0)
            {
                this.layer_shop.add(new Button (this, "upgrade_button", 300, 515, this.upgradeOffice, ["Desk"])).setName("upgradeDeskButton");
                this.upgradeDeskButton = this.layer_shop.getByName("upgradeDeskButton");
                this.upgradeDeskButton.startButton.setDepth(100003);
            }
            
            //upgrade Window
            if(this.windowLevel === 0)
            {
                this.layer_shop.add(new Button (this, "upgrade_button", 700, 515, this.upgradeOffice, ["Window"])).setName("upgradeWindowButton");
                this.upgradeWindowButton = this.layer_shop.getByName("upgradeWindowButton");
                this.upgradeWindowButton.startButton.setDepth(100004);
            }
            
            this.layer_shop.add(this.add.text(600, 40, `You head home after a long day of work.\nYou wake the next day feeling re-engergized and ready for more.\n\nCurrent Money: ${this.moneyCount}\nUpgrade Cost: ${this.currentUpgradeCost}\n\nUpgrade Plant      Upgrade Background\n\n\nUpgrade Desk      Upgrade Window\n\n\n\nContinue` ,
            { 
                fontFamily: 'Tahoma, "Goudy Bookletter 1911", Times, serif',
                fontSize: "40px",
                color: "#ffffff",
                align: "center",
            }).setOrigin(0.5,0)).setName("dayOverText");
            this.dayOverText = this.layer_shop.getByName("dayOverText");
        }
    }

    closeShopMenu()
    {
        if(this.plantLevel === 0){this.upgradePlantButton._removeButton();} 
        if(this.bgLevel === 0){this.upgradeBGButton._removeButton();} 
        if(this.deskLevel === 0){this.upgradeDeskButton._removeButton();} 
        if(this.windowLevel === 0){this.upgradeWindowButton._removeButton();} 
        this.nextDayButton._removeButton();
        this.shopBG.destroy();
        this.dayOverText.destroy();
        this.layer_shop.removeAll();
        this.cameras.main.fadeFrom(200, 20, 20, 20, true);
        this.dayNumber++;
        this.dayOver = false;
        this.playerPaused = false;
        this.removeEndOfDayEvent();
    }

    upgradeOffice(partToUpgrade) //each time this is run, the office is upgraded 1 stage
    {
        this.dayOverText.destroy();
        if(partToUpgrade === "Plant" && this.moneyCount >= this.currentUpgradeCost && this.plantLevel === 0)
        {
            this.moneyCount -= this.currentUpgradeCost;
            this.layer_plant.add(this.add.sprite(0, 0, "Pixelroom_Plant").setOrigin(0, 0));
            this.plantLevel++;
            this.currentUpgradeCost += this.upgradeCostIncrement + Math.floor(Math.random() * 10);
            this.upgradePlantButton._removeButton();
        }
        else if(partToUpgrade === "BG" && this.moneyCount >= this.currentUpgradeCost && this.bgLevel === 0)
        {
            this.moneyCount -= this.currentUpgradeCost;
            this.layer_bg.replace(this.layer_bg.getAt(0), this.add.sprite(0, 0, "Pixelroom_BG_Upgrade").setOrigin(0, 0));
            this.bgLevel++;
            this.currentUpgradeCost += this.upgradeCostIncrement + Math.floor(Math.random() * 10);
            this.upgradeBGButton._removeButton();
        }
        else if(partToUpgrade === "Desk" && this.moneyCount >= this.currentUpgradeCost && this.deskLevel === 0)
        {
            this.moneyCount -= this.currentUpgradeCost;
            this.layer_desk.replace(this.layer_desk.getAt(0), this.add.sprite(0, 0, "Pixelroom_Desk_Upgrade").setOrigin(0, 0));
            this.deskLevel++;
            this.currentUpgradeCost += this.upgradeCostIncrement + Math.floor(Math.random() * 10);
            this.upgradeDeskButton._removeButton();
        }
        else if(partToUpgrade === "Window" && this.moneyCount >= this.currentUpgradeCost && this.windowLevel === 0)
        {
            this.moneyCount -= this.currentUpgradeCost;
            this.layer_window.add(this.add.sprite(0, 0, "Pixelroom_Window").setOrigin(0, 0));
            this.windowLevel++;
            this.currentUpgradeCost += this.upgradeCostIncrement + Math.floor(Math.random() * 10);
            this.upgradeWindowButton._removeButton();
        }
        /*else if(this.officeLevel === 4 && this.moneyCount >= this.currentUpgradeCost)   you can use these if you want to implement more office levels.
        {
            this.officeLevel++;
        }
        else if(this.officeLevel === 5 && this.moneyCount >= this.currentUpgradeCost)
        {
            this.officeLevel++;
        }*/
        this.layer_shop.add(this.add.text(600, 40, `You head home after a long day of work.\nYou wake the next day feeling re-engergized and ready for more.\n\nCurrent Money: ${this.moneyCount}\nUpgrade Cost: ${this.currentUpgradeCost}\n\nUpgrade Plant      Upgrade Background\n\n\nUpgrade Desk      Upgrade Window\n\n\n\nContinue` ,
            { 
                fontFamily: 'Tahoma, "Goudy Bookletter 1911", Times, serif',
                fontSize: "40px",
                color: "#ffffff",
                align: "center",
            }).setOrigin(0.5,0)).setName("dayOverText");
            this.dayOverText = this.layer_shop.getByName("dayOverText");
    }

    endOfDayEvent(eventNumber) //runs the event, under the event number specified
    {
        if(eventNumber === 0) //the tutorial event, mainly used to prompt the player into leaving the room
        {
            this.layer_text.add(
                this.add.text(600, 250, "Nice job today! Looks like your shift is over.\nYou can head home now." ,
                { 
                    fontFamily: 'Tahoma, "Goudy Bookletter 1911", Times, serif',
                    fontSize: "35px",
                    color: "#000000",
                    align: "center",
                }).setOrigin(0.5,0)
            ).setName("endOfDayText");
            this.tutorialText = this.layer_text.getByName("endOfDayText");
            this.layer_npc.add(this.add.sprite(845, this.floorheight, "Figure_Pink").setOrigin(0, 1).setScale(this.playerScale)).setName("npcSprite");
            this.npcSprite = this.layer_npc.getByName("npcSprite");
        }

        else if(eventNumber === 1)
        {
            this.layer_text.add(
                this.add.text(600, 250, "If you haven't already noticed, you can use\n MegaRapidBucks that you get after each\nshift to upgrade the look of your office!" ,
                { 
                    fontFamily: 'Tahoma, "Goudy Bookletter 1911", Times, serif',
                    fontSize: "35px",
                    color: "#000000",
                    align: "center",
                }).setOrigin(0.5,0)
            ).setName("endOfDayText");
            this.tutorialText = this.layer_text.getByName("endOfDayText");
            this.layer_npc.add(this.add.sprite(845, this.floorheight, "Figure_Pink").setOrigin(0, 1).setScale(this.playerScale)).setName("npcSprite");
            this.npcSprite = this.layer_npc.getByName("npcSprite");
        }
    }

    removeEndOfDayEvent() //just removes all of the end of day event related stuff
    {
        this.tutorialText.destroy();
        this.npcSprite.destroy();
    }
}