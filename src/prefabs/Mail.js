/*
    todo: 
    add a new argument to the constructor. It should be a string that has the filepath of a "preview"
    of the mail, for use on the left sidebar of the game. The files should each be the same dimension.
    Also, in Play.js, implement the usage of these.
*/

class Mail extends Phaser.GameObjects.Sprite {
    constructor(scene, imagePath, legitimate, reason1, reason2, reason3, reason4)
    {
        super(scene);
        this.imagePath = imagePath; //the filepath to the mail image
        this.legitimate = legitimate; //boolean, true=don't report, false=report
        this.reason1 = reason1; //Sender is posing as someone they aren't
        this.reason2 = reason2; //Email contains link to a suspicious website
        this.reason3 = reason3; //Email requests personal info
        this.reason4 = reason4; //Email contains suspicious attachment
    }

    toString()
    {
        return("Mail Object: legitimate: " + this.legitimate + " imagepath: " + this.imagePath);
    }

    /*
    A flawed scoring method because it gives the same amount of points if the mail is real, and detected (easy, 1 input)
    as when the mail is fake, and all reasons are reported correctly, (hard, up to 5 inputs)

    gives 2 points .. for getting all the reasons correct ALONG WITH the validity (also compares the imagepath, not used for gameplay but rather for testing purposes)
    gives 1 point ... for getting the validity correct, and not all the reasons correct
    gives 0 points .. for getting the validity wrong
    */
    scoreCompareTo(mailToCompare)
    {
        if
        (
            this.imagePath === mailToCompare.imagePath &&
            this.legitimate === mailToCompare.legitimate &&
            this.reason1 === mailToCompare.reason1 &&
            this.reason2 === mailToCompare.reason2 &&
            this.reason3 === mailToCompare.reason3 &&
            this.reason4 === mailToCompare.reason4
        )
        {
            return 2; //score for getting all the reasons correct ALONG WITH the validity (also compares the imagepath, not used for gameplay but rather for testing purposes)
        }
        else if( this.legitimate === mailToCompare.legitimate )
        {
            return 1; //score for getting the validity correct, and not all the reasons correct
        }
        else
        {
            return 0; //score for getting the validity wrong
        }
    }
}