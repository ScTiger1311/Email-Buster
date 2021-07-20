//code by Ethan Rafael. Written for Secusolutions Summer 2021
let config =
{
    type: Phaser.WEBGL,
    width: 1200,
    height: 900,
    zoom: 1,
    antialias: false,
    pixelArt: true,
    scene: [Menu, Play],
    physics:{
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x: 0,
                y: 0
            },
            debug: false
        }
    },
    
}

let game = new Phaser.Game(config);

//reserve keyboard bindings
let keyF, keyR, keyLEFT, keyRIGHT, keyUP, keyDOWN, keySPACE, keyX;

