class Play extends Phaser.Scene {
    constructor() {
        super("Play");
    }

    //if you plan on using assets, you can load them here to load it at the start of the scene. Or, you can load them on the fly. https://rexrainbow.github.io/phaser3-rex-notes/docs/site/loader/
    preload() {
        this.load.atlas("clearbutton_red", "./assets/spritesheets/clearbutton_red.png", "./assets/spritesheets/clearbutton_red.json"); //this one is used for testing/debugging purposes
        this.load.atlas("clearbutton", "./assets/spritesheets/clearbutton.png", "./assets/spritesheets/clearbutton.json"); //this one is used as an invisible hitbox
        this.load.atlas("clearbutton_darken", "./assets/spritesheets/clearbutton_darken.png", "./assets/spritesheets/clearbutton_darken.json"); //this one is used as an invisible hitbox
        this.load.atlas("button", "./assets/spritesheets/button_spritesheet.png", "./assets/spritesheets/button_spritesheet.json"); //this one is used as an actual button
        this.load.image("MailBG", "./assets/single_sprites/MailBG.png"); //used as a background for the game
    }

    //runs once, after preload, just as the scene starts
    create() {
        console.log("entered the Play.js scene");
        this.unusedMailReal = //stores all the real mail objects (see Mail.js for a description of the data type)
        [
            new Mail(this, "./assets/single_sprites/Mail1_Real.png", true,  true, true, false, false),
            new Mail(this, "./assets/single_sprites/Mail1_Real.png", true,  true, true, false, false),
            new Mail(this, "./assets/single_sprites/Mail1_Real.png", true,  true, true, false, false),
            new Mail(this, "./assets/single_sprites/Mail1_Real.png", true,  true, true, false, false),
            new Mail(this, "./assets/single_sprites/Mail1_Real.png", true,  true, true, false, false),
        ];
        this.unusedMailFake = //stores all the fake mail objects
        [
            new Mail(this, "./assets/single_sprites/Mail1_Fake.png", false,  true, true, false, false),
            new Mail(this, "./assets/single_sprites/Mail1_Fake.png", false,  true, true, false, false),
            new Mail(this, "./assets/single_sprites/Mail1_Fake.png", false,  true, true, false, false),
            new Mail(this, "./assets/single_sprites/Mail1_Fake.png", false,  true, true, false, false),
            new Mail(this, "./assets/single_sprites/Mail1_Fake.png", false,  true, true, false, false),
            new Mail(this, "./assets/single_sprites/Mail1_Fake.png", false,  true, true, false, false),
            
        ];

        //this.reportButton = new Button(this, "clearbutton_darken", )
        this.mailSprite = 0; //placeholder to give this a value that exists, but isn't a gameobject.
        this.nextButton = 0;
        this.bgSprite = this.add.sprite(0,0, "MailBG").setOrigin(0,0);
        this.usedMailReal = []; //stores all of the used real mail in the current game session, so that repeat mail will not occur
        this.usedMailFake = []; //stores all of the used fake mail in the current game session, so that repeat mail will not occur
        this.displayNewMail(this.chooseNewMail());//loads the initial email
    }

    update(time, delta) {
        let deltaMultiplier = (delta / 16.66667); //for refresh rate indepence
    }

    chooseNewMail()
    {
        let randNum = Math.random() * 100;
        let fakeMaxVal = 20; //determines the % chance of a fake mail                                                                 /* ######## Important line here ########## */
        console.log(randNum);
        if(randNum <= fakeMaxVal)
        {
            if(this.unusedMailFake.length > 0) //check to make sure there's at least one element
            {
            }
            else //move all the elements from used array to unused array
            {
                this.unusedMailFake = [...this.usedMailFake];
                this.usedMailFake = [];
            }
            return this.chooseFakeMail();
            
        }
        else
        {
            
            if(this.unusedMailReal.length > 0) //check to make sure there's at least one element
            {
            }
            else //move all the elements from used array to unused array
            {
                this.unusedMailReal = [...this.usedMailReal];
                this.usedMailReal = [];
                
            }
            return this.chooseRealMail();
        }
    }

    chooseFakeMail() //give an unused scam email, then moves that to the used mail 
    {
        let randomToCheck = Math.floor(Math.random() * this.unusedMailFake.length);
        let randomMail = this.unusedMailFake.splice(randomToCheck, 1);
        this.usedMailFake.push(randomMail[0]);
        return randomMail[0];
    }
    chooseRealMail() //give an unused legitimate email, then moves that to the used mail
    {
        let randomToCheck = Math.floor(Math.random() * this.unusedMailReal.length);
        let randomMail = this.unusedMailReal.splice(randomToCheck, 1);
        this.usedMailReal.push(randomMail[0]);
        return randomMail[0];
    }

    displayNewMail(mail) //the code that loads/unloads images, and sets up the new email.
    {
        console.log(mail.imagePath);
        this.load.image(mail.imagePath, mail.imagePath); //uses the URL as a key
        this.load.on(Phaser.Loader.Events.COMPLETE, () => 
        {
            if(this.mailSprite != 0 )
            {
               this.mailSprite.destroy();
            }
            if(this.nextButton != 0 )
            {
                this.nextButton._removeButton();
            }
            this.mailSprite = this.add.sprite(0, 0, mail.imagePath).setOrigin(0,0);
            this.nextButton = new Button(this, "button", 1000, 700, this.funct = function(){this.displayNewMail(this.chooseNewMail())});
        });
        this.load.start();
        
    }

    showReportMenu()
    {
        console.log("showed report menu");
    }
}