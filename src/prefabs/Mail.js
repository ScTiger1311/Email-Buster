class Mail extends Phaser.GameObjects.Sprite {
    constructor(scene, imagePath, legitimate, reason1, reason2, reason3, reason4)
    {
        super(scene);
        this.imagePath = imagePath; //the filepath to the mail image
        this.legitimate = legitimate; //boolean, true=don't report, false=report
        this.reason1 = reason1; //boolean, name "reason1" is just a placeholder, replace with a more descriptive variable name later
        this.reason2 = reason2;
        this.reason3 = reason3;
        this.reason4 = reason4;
    }
}