export class GameOver extends Phaser.Scene{
    constructor(){
        super('GaameOver');
    }

    preload(){
        this.preload.image('background', 'assests/bg.png');
        //lowkey should add a game over screen lolllll
    }

    create(){
        this.background = this.add.sprite(640, 320, 'background');
        this.add.text(100, 300, 'Is that the best you can do', {fontSize: ' 128px', fill: '#FFF', align: "center"});
        //add a restart button. perhaps also also a high score tracker
    }
}