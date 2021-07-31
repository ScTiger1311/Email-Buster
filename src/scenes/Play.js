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
        this.unusedMailReal = //stores all the real mail objects (see Mail.js for a description of the data type)
        [
            new Mail(this, "./assets/single_sprites/Mail1_Real.png", true,  true, true, false, false),
        ];
        this.unusedMailFake = //stores all the fake mail objects
        [
            new Mail(this, "./assets/single_sprites/Mail1_Fake.png", false,  true, true, false, false),
        ];

        this.usedMailReal = []; //stores all of the used real mail in the current game session, so that repeat mail will not occur
        this.usedMailFake = []; //stores all of the used fake mail in the current game session, so that repeat mail will not occur
    }

    update(time, delta) {
        let deltaMultiplier = (delta / 16.66667); //for refresh rate indepence
    }

    newBg(image) //takes a new background image as a string and applies it
    {
        this.bgSprite = this.add.sprite(0, 0, image).setOrigin(0, 0);
        this.nextButton = new Button(this, "button", 1000, 700, this.funct = function(){this.newBg("Mail1_Fake");});
    }

    chooseNewMail()
    {
        let randNum = Math.random * 100;
        let fakeMaxVal = 10; //determines the % chance of a fake mail
        if(randNum <= fakeMaxVal) //give an unused scam email, then moves that to the used mail
        {
            if(this.unusedMailFake.length < 0) //check to make sure there's at least one element
            {
                let randomToCheck = Math.floor(Math.Random() * this.mailFake.length);
                let randomMail = unusedMailFake.splice(randomToCheck, 1);
                this.usedMailFake.push(randomMail);
                return randomMail;
            }
            else //move all the elements from used array to unused array
            {
                console.log("Play.js -> chooseNewMail() -- Ran else(), fake")
                for(i = 0; i < this.usedMailFake.length; i++)
                {
                    this.unusedMailFake.push(this.usedMailFake.splice(i, 1));
                }
                let randomToCheck = Math.floor(Math.Random() * this.unusedMailFake.length);
                let randomMail = unusedMailFake.splice(randomToCheck, 1);
                this.usedMailFake.push(randomMail);
                return randomMail;
            }
            
        }
        else //give an unused legitimate email, then moves that to the used mail
        {
            if(this.unusedMailReal.length < 0) //check to make sure there's at least one element
            {
                let randomToCheck = Math.floor(Math.Random() * this.mailReal.length);
                let randomMail = unusedMailReal.splice(randomToCheck, 1);
                this.usedMailReal.push(randomMail);
                return randomMail;
            }
            else //move all the elements from used array to unused array
            {
                console.log("Play.js -> chooseNewMail() -- Ran else(), real")
                for(i = 0; i < this.usedMailReal.length; i++)
                {
                    this.unusedMailReal.push(this.usedMailReal.splice(i, 1));
                }
                let randomToCheck = Math.floor(Math.Random() * this.unusedMailReal.length);
                let randomMail = unusedMailReal.splice(randomToCheck, 1);
                this.usedMailReal.push(randomMail);
                return randomMail;
            }
        }
    }

    displayNewMail(mail)
    {
        this.load.image( "mailCurr", mail.imagePath );
        this.bgSprite = this.add.sprite(0, 0, "mailCurr");
    }
}