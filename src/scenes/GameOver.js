export class GameOver extends Phaser.Scene{
    constructor(){
        super('GameOver');
    }

    preload(){
        this.load.image('background', 'assets/bg.png');
        this.load.image('bullet', 'assets/bullet.png');
        //lowkey should add a game over screen lolllll
    }

    create(){
        this.background = this.add.sprite(640, 360, 'background');
        this.add.text(100, 300, 'Is that the best you can do', {fontSize: ' 128px', fill: '#FFF', align: "center"});
        //add a restart button. perhaps also also a high score tracker
        this.add.text(640, 500, 'Press R to restart', { fontSize: '40px', fill: '#FFF' }).setOrigin(0.5);
        this.input.keyboard.once('keydown-R', () => {
            this.scene.start('Start');
        });
    }
}