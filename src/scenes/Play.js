class Play extends Phaser.Scene {
    constructor() {
        super("Play");
    }

    //if you plan on using assets, you can load them here to load it at the start of the scene. Or, you can load them on the fly. https://rexrainbow.github.io/phaser3-rex-notes/docs/site/loader/
    preload() {
        this.load.atlas("clearbutton_red", "./assets/spritesheets/clearbutton_red.png", "./assets/spritesheets/clearbutton_red.json"); //this one is used for testing/debugging purposes
        this.load.atlas("clearbutton", "./assets/spritesheets/clearbutton.png", "./assets/spritesheets/clearbutton.json"); //this one is used as an invisible hitbox
        this.load.atlas("clearbutton_darken", "./assets/spritesheets/clearbutton_darken.png", "./assets/spritesheets/clearbutton_darken.json"); //this one is used as an invisible hitbox
        this.load.atlas("button", "./assets/spritesheets/button_spritesheet.png", "./assets/spritesheets/button_spritesheet.json"); //this one is used as a test button
        this.load.atlas("xbutton_red", "./assets/spritesheets/xbutton_red.png", "./assets/spritesheets/xbutton_red.json");//x button for the report popup
        this.load.atlas("review_button", "./assets/spritesheets/review_button.png", "./assets/spritesheets/review_button.json");
        this.load.atlas("nextday_button", "./assets/spritesheets/nextday_button.png", "./assets/spritesheets/nextday_button.json");  
        this.load.atlas("nextemail_button", "./assets/spritesheets/nextemail_button.png", "./assets/spritesheets/nextemail_button.json");  
        this.load.atlas("exit_button", "./assets/spritesheets/exit_button.png", "./assets/spritesheets/exit_button.json");
        this.load.atlas("checkbox", "./assets/spritesheets/checkbox.png", "./assets/spritesheets/checkbox.json"); //used for the checkboxes in the report menu
        this.load.image("MailBG", "./assets/single_sprites/MailBG.png"); //used as a background for the game
        this.load.image("Report_Menu", "./assets/single_sprites/Report_Menu.png"); //used for reporting the email as fishy
        this.load.image("Mail_Tutorial", "./assets/single_sprites/Mail_Tutorial.png"); //the tutorial that tells you to press the report button
    }

    //runs once, after preload, just as the scene starts
    create() {
        console.log("entered the Play.js scene");

        this.unusedMailReal = //stores all the real mail objects (see Mail.js for a description of the data type)
        [
            new Mail(this, "./assets/single_sprites/Mail/RealEmail_001.png", "./assets/single_sprites/Mail/RealEmail_Preview_001.png", true,      false, false, false, false),
            new Mail(this, "./assets/single_sprites/Mail/RealEmail_002.png", "./assets/single_sprites/Mail/RealEmail_Preview_002.png", true,      false, false, false, false),
            new Mail(this, "./assets/single_sprites/Mail/RealEmail_003.png", "./assets/single_sprites/Mail/RealEmail_Preview_003.png", true,      false, false, false, false),
            new Mail(this, "./assets/single_sprites/Mail/RealEmail_004.png", "./assets/single_sprites/Mail/RealEmail_Preview_004.png", true,      false, false, false, false),
            new Mail(this, "./assets/single_sprites/Mail/RealEmail_005.png", "./assets/single_sprites/Mail/RealEmail_Preview_005.png", true,      false, false, false, false),
        ];
        this.unusedMailFake = //stores all the fake mail objects
        [
            new Mail(this, "./assets/single_sprites/Mail/FakeEmail_001.png", "./assets/single_sprites/Mail/FakeEmail_Preview_001.png", false,      true, false, true, false),
            new Mail(this, "./assets/single_sprites/Mail/FakeEmail_002.png", "./assets/single_sprites/Mail/FakeEmail_Preview_002.png", false,      true, true, false, false),
            new Mail(this, "./assets/single_sprites/Mail/FakeEmail_003.png", "./assets/single_sprites/Mail/FakeEmail_Preview_003.png", false,      true, false, false, true),
            new Mail(this, "./assets/single_sprites/Mail/FakeEmail_004.png", "./assets/single_sprites/Mail/FakeEmail_Preview_004.png", false,      true, false, true, false),
            
        ];
        this.usedMailReal = []; //stores all of the used real mail in the current game session, so that repeat mail will not occur
        this.usedMailFake = []; //stores all of the used fake mail in the current game session, so that repeat mail will not occur

        //all the variables you might want to edit to tweak the difficulty of the game
        this.mailQueueLength = 4; //the length of the mail queue. Must be greater than fakeMailMinimumAmount
        this.fakeMailMinimumAmount = 1; //the minimum amount of fake mail in the queue. If the game generates less than this amount, automatically replaces random real mail with fake mail
        this.fakeMaxVal = 20; //determines the % chance of a fake mail


        this.nextDayButton = 0;
        this.startRound();
        this.tutorialSprite = this.add.sprite(0, 0, "Mail_Tutorial").setOrigin(0,0);
    }

    startRound()
    {
        this.arePreviewsLoaded = false; //variable to keep track of if the previews are loaded
        this.mailSprite = 0; //placeholder to give this a value that exists, but isn't a gameobject.
        this.replyButton = 0;
        this.incorrectEmailsArray = [];
        this.bgSprite = this.add.sprite(0,0, "MailBG").setOrigin(0,0);
        this.emailQueue = this.generateMailQueue(this.mailQueueLength, this.fakeMailMinimumAmount); //the queue of all the mail. needs to be generated by the function generateMailQueue()
        this.emailQueueCopy = [...this.emailQueue];
        this.answerQueue = []; //stores the answers the player gives, so it can be compared to this.emailQueue to score the player
        this.showNewMail(this.emailQueue);//loads the initial email
        this.reportButton = new Button(this, "clearbutton_darken", 765, 2, this.showReportMenu, [])
        this.reportButton.setHeight(59);
        this.reportButton.setWidth(230);
        this.replyButton = new Button(this, "clearbutton_darken", 1002, 2, this.replyToMail, []);
        this.replyButton.setHeight(59);
        this.replyButton.setWidth(195);
        this.resultsTextBox = 0;
        this.resultsLocationX = 300; //chooses the location of the text box for the results text.
        this.resultsLocationY = 300;

        if(this.nextDayButton != 0)
        {
            this.nextDayButton._removeButton();
        }
    }

    update(time, delta) {
        //let deltaMultiplier = (delta / 16.66667); //for refresh rate indepence
    }

    generateMailQueue(queueLength, fakeMailMin)
    {
        let arrayToReturn = [];
        let numFakeMails = 0;

        if(queueLength < fakeMailMin) //check to make sure variables are set properly
        {
            console.log("ERROR in Play.js, generateMailQueue(): You set queueLength less than fakeMailMin");
            this.destroy();
        }
        for(let i = 0; i < queueLength; i++) //generates an array of a length, populated with false=fake, true=real
        {
            let randNum = Math.random() * 100;
            if(randNum <= this.fakeMaxVal) //generates a placeholder fake slot
            {
                arrayToReturn[i] = false;
                numFakeMails++;
                
            }
            else //generates a placeholder real slot
            {
                arrayToReturn[i] = true;
            }
        }
        if(numFakeMails < fakeMailMin) //generates fake mail placeholders in random slots, up to the value of fakeMailMin
        {
            for(let i = 0; i < fakeMailMin - numFakeMails; i++)
            {
                let randNum = Math.floor(Math.random() * queueLength);
                if(arrayToReturn[randNum] == true) //if the index of random number generated is already a real mail, make it fake
                {
                    arrayToReturn[randNum] = false;
                }
                else //if it isn't, loop through the array after the random number until you find one that is.
                {
                    for(let j = 1; j < fakeMailMin + 1; i++)
                    {
                        if(randNum + j <= queueLength)
                        {
                            if(arrayToReturn[j-1] == true)
                            {
                                arrayToReturn[j-1] = false
                                break;
                            }

                        }
                        else
                        {
                            if(arrayToReturn[randNum + j] == true)
                            {
                                arrayToReturn[randNum + j] = false;
                                break;
                            }
                        }
                    }
                }
            }
        }
        //yay, we now have a placeholder mail queue!
    
        for(let i = 0; i < queueLength; i++)
        {
            if(arrayToReturn[i] == false)
            {
                arrayToReturn[i] = this.chooseFakeMail();
            }
            else
            {
                arrayToReturn[i] = this.chooseRealMail();
            }
        }

        return [...arrayToReturn]; //returns a copy of the usedMailFakeArray
    }

    replyToMail() //activates when you press the reply button. sets that spot in the responses array to true
    {
        if(this.tutorialSprite != 0)
        {
            this.tutorialSprite.destroy();
            this.tutorialSprite = 0;
        }
        this.answerQueue.push(new Mail
            (
                this,
                this.emailQueue[0].imagePath,
                this.emailQueue[0].previewImagePath,
                true,
                this.emailQueue[0].reason1, //these need to be changed when reasons are implemented
                this.emailQueue[0].reason2,
                this.emailQueue[0].reason3,
                this.emailQueue[0].reason4,
            ));
        this.nextMailInQueue(this.emailQueue);
    }
    
    confirmReportMail()
    {
        if(this.tutorialSprite != 0)
        {
            this.tutorialSprite.destroy();
            this.tutorialSprite = 0;
        }
        this.answerQueue.push(new Mail
        (
            this,
            this.emailQueue[0].imagePath,
            this.emailQueue[0].previewImagePath,
            false,
            this.reportMenuCheckbox1.getValue(), //these need to be changed when reasons are implemented
            this.reportMenuCheckbox2.getValue(),
            this.reportMenuCheckbox3.getValue(),
            this.reportMenuCheckbox4.getValue(),
        ));
        this.hideReportMenu();
        this.nextMailInQueue(this.emailQueue);
    }

    chooseFakeMail() //give an unused scam email, then moves that to the used mail 
    {
        if(this.unusedMailFake.length > 0) //check to make sure there's at least one element
        {
        }
        else //move all the elements from used array to unused array
        {
            this.unusedMailFake = [...this.usedMailFake];
            this.usedMailFake = [];
        }
        let randomToCheck = Math.floor(Math.random() * this.unusedMailFake.length);
        let randomMail = this.unusedMailFake.splice(randomToCheck, 1);
        this.usedMailFake.push(randomMail[0]);
        return randomMail[0];
    }
    chooseRealMail() //give an unused legitimate email, then moves that to the used mail
    {
        if(this.unusedMailReal.length > 0) //check to make sure there's at least one element
        {
        }
        else //move all the elements from used array to unused array
        {
            this.unusedMailReal = [...this.usedMailReal];
            this.usedMailReal = [];
                
        }
        let randomToCheck = Math.floor(Math.random() * this.unusedMailReal.length);
        let randomMail = this.unusedMailReal.splice(randomToCheck, 1);
        this.usedMailReal.push(randomMail[0]);
        return randomMail[0];
    }

    showNewMail(queue) //shows the current mail + side bar.
    {

        this.load.image(queue[0].imagePath, queue[0].imagePath); //uses the URL as the key
        this.load.on(Phaser.Loader.Events.COMPLETE, () => 
        {
            if(this.mailSprite !== 0)
            {
                this.mailSprite.destroy();
            }
            this.mailSprite = this.add.sprite(0, 0, queue[0].imagePath).setOrigin(0,0);
        });
        this.load.start();
        if(this.arePreviewsLoaded === false) //avoids loading the mail every time
        {
            this.loadMailPreviews(queue);
        }
        else
        {
            this.showMailPreviews(queue);
        }
    }

    nextMailInQueue(queue) //helper function to be placed as an argument for a button
    {
        this.destroyOldPreviews();
        this.previewSlots = new Array();
        if(queue.length <= 1)
        {
            this.endRound();
        }
        else
        {
            queue.shift();
            this.showNewMail(queue);
        }
    }

    loadMailPreviews(queue) //loads and shows mail previews
    {
        //console.log("Loading Previews")
        let numImagesLoaded = 0;
        for( let i = 0; i < queue.length; i++)
        {
            this.load.image(`previewImage${i}`, queue[i].previewImagePath);
            //console.log(`Loading File: ${queue[i].previewImagePath}`);
            this.load.on(Phaser.Loader.Events.COMPLETE, () => 
            {
                numImagesLoaded++;
                if(numImagesLoaded === queue.length)
                {
                    this.showMailPreviews(queue);
                    this.arePreviewsLoaded = true;
                    //console.log("Loading Done");
                }
            });
            this.load.start();
        }
    }

    showMailPreviews(queue)
    {
        let x = 6; //position of the left edge of the first (and all) emails in the list
        let y = 69; //position of the top edge of the first email in the list
        let ySpacing = 100; //spacing between the mail previews in px
        this.previewSlots = new Array();
        for(let i = 0; i < queue.length; i++)
        {
            this.previewSlots.push(this.add.sprite(x, y + ySpacing * i, `previewImage${i + (this.mailQueueLength - queue.length)}`).setOrigin(0,0));
        }
    }

    destroyOldPreviews()
    {
        for(let i = 0; i < this.previewSlots.length; i++ ) //clears out the old mail
        {
            if(this.previewSlots[i] !== 0)
            {
                this.previewSlots[i].destroy();
            }
            
        }
    }

    endRound() //ends the game when the email queue is empty, and shows the results screen
    {
        if(this.reportMenuVisible === true)
        {
            this.hideReportMenu();
        }
        //reset the mail sprite to the way it was at the start and remove the sprite from the stage
        this.mailSprite.destroy();
        this.mailSprite = 0;

        this.replyButton._removeButton();
        this.reportButton._removeButton();
        this.destroyOldPreviews();
        for(let i = 0; i < this.mailQueueLength; i++ ) //clears out the old mail
        {
            this.textures.removeKey(`previewImage${i}`);
        }

        this.arePreviewsLoaded = false;
        this.score = 0;
        this.score = this.calculateScore(this.emailQueueCopy, this.answerQueue);
        this.numCorrect = 0;
        this.numCorrect = this.calculateNumCorrect(this.emailQueueCopy, this.answerQueue);
        
        this.resultsTextBox = this.add.text(0, 0,   
            `Day over. \n\nYour score: ${this.score * 1000}/${this.mailQueueLength * 2 * 1000}\n\nIncorrect deductions: ${this.mailQueueLength - this.numCorrect}`, //This is a template literal https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
        { 
            fontFamily: 'Tahoma, "Goudy Bookletter 1911", Times, serif',
            fontSize: "30px",
            color: "#000000",
        }).setOrigin(0,0);
        this.resultsTextBox.x = this.resultsLocationX;
        this.resultsTextBox.y = this.resultsLocationY;

        this.showIncorrectEmailsButton = new Button(this, "review_button", 450, 600, this.showIncorrectEmails, [this.incorrectEmailsArray]);
        this.nextDayButton = new Button(this, "exit_button", 750, 600, this.endEmailSegment, []);
    }

    showIncorrectEmails(queue)
    {
        if(this.incorrectEmailsArray.length > 1) //then show the next one
        {
            this.resultsTextBox.destroy();
            this.mailSprite = this.add.sprite(0, 0, queue[0].imagePath).setOrigin(0,0);
            this.showIncorrectEmailsButton._removeButton();
            this.nextIncorrectEmailButton = new Button(this, "nextemail_button", 450, 600, this.nextIncorrectEmail, [this.incorrectEmailsArray]);
        }
    }

    nextIncorrectEmail(queue)
    {
        if(this.incorrectEmailsArray.length > 1) //then show the next one
        {
            queue.shift();
            this.mailSprite.destroy();
            this.mailSprite = this.add.sprite(0, 0, queue[0].imagePath).setOrigin(0,0);
        }
        else //show the end game screen.
        {
            this.mailSprite.destroy();
            this.resultsTextBox = this.add.text(0, 0, `Press the button below to exit the computer`, //This is a template literal https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
            { 
                fontFamily: 'Tahoma, "Goudy Bookletter 1911", Times, serif',
                fontSize: "30px",
                color: "#000000",
            }).setOrigin(0,0);
            this.resultsTextBox.x = this.resultsLocationX;
            this.resultsTextBox.y = this.resultsLocationY;
            this.nextIncorrectEmailButton._removeButton();
        }

    }
    
    calculateScore(mailList, answerList)
    {
        let totalScore = 0;
        for(let i = 0; i < mailList.length; i++)
        {
            totalScore += mailList[i].scoreCompareTo(answerList[i]);
        }
        return totalScore;
    }

    calculateNumCorrect(mailList, answerList)
    {
        this.incorrectEmailsArray = new Array();
        let totalCorrect = 0;
        for(let i = 0; i < mailList.length; i++)
        {
            if(mailList[i].legitimate == answerList[i].legitimate)
            {
                totalCorrect++;
            }
            else
            {
                this.incorrectEmailsArray.push(mailList[i]);
            }
        }
        return totalCorrect;
    }

    showReportMenu() //opens the report menu
    {
        if(this.reportMenuVisible !== true)
        {
            this.reportMenuVisible = true;
            this.reportMenu = this.add.sprite(600, 63, "Report_Menu").setOrigin(0,0);
            this.reportMenuCloseButton = new Button(this, "xbutton_red", 963, 65, this.hideReportMenu, []);
            this.reportMenuCloseButton.setHeight(34);
            this.reportMenuCloseButton.setWidth(33);
            this.reportMenuConfirmButton = new Button(this, "clearbutton_darken", 604, 291, this.confirmReportMail, []);
            this.reportMenuConfirmButton.setHeight(66);
            this.reportMenuConfirmButton.setWidth(390);
            let checkbox1Xpos = 607;
            let checkbox1Ypos = 112;
            let checkboxOffset = 46;
            this.reportMenuCheckbox1 = new Checkbox(this, "checkbox", checkbox1Xpos, checkboxOffset * 0 + checkbox1Ypos);
            this.reportMenuCheckbox1.setHeight(25);
            this.reportMenuCheckbox1.setWidth(25);
            this.reportMenuCheckbox2 = new Checkbox(this, "checkbox", checkbox1Xpos, checkboxOffset * 1 + checkbox1Ypos);
            this.reportMenuCheckbox2.setHeight(25);
            this.reportMenuCheckbox2.setWidth(25);
            this.reportMenuCheckbox3 = new Checkbox(this, "checkbox", checkbox1Xpos, checkboxOffset * 2 + checkbox1Ypos);
            this.reportMenuCheckbox3.setHeight(25);
            this.reportMenuCheckbox3.setWidth(25);
            this.reportMenuCheckbox4 = new Checkbox(this, "checkbox", checkbox1Xpos, checkboxOffset * 3 + checkbox1Ypos);
            this.reportMenuCheckbox4.setHeight(25);
            this.reportMenuCheckbox4.setWidth(25);
        }
    }

    hideReportMenu() //closes the report menu and deletes the buttons/assets from the stage
    {
        this.reportMenuVisible = false;
        this.reportMenu.destroy();
        this.reportMenuCloseButton._removeButton();
        this.reportMenuConfirmButton._removeButton();
        this.reportMenuCheckbox1._removeCheckbox();
        this.reportMenuCheckbox2._removeCheckbox();
        this.reportMenuCheckbox3._removeCheckbox();
        this.reportMenuCheckbox4._removeCheckbox();
    }

    endEmailSegment()
    {
        this.startRound();
        this.scene.switch("Pixelroom");
    }
}