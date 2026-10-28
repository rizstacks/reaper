export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/bg.png');
        this.load.image('character', 'assets/char.png');
    }

    create() {
        //sprites
        this.background = this.add.sprite(640, 320, 'background');
        this.player = this.add.sprite(640, 320, 'character');

        //player attributes
        this.player.hp = 100;
        this.player.speed = 300;
        this.physics.add.existing(this.player);

        //this is to listen for movement, i added arrows cus i want to use them
        this.upW = this.input.keyboard.addKey("W", false, true);
        this.downS = this.input.keyboard.addKey("S", false, true);
        this.leftA = this.input.keyboard.addKey("A", false, true);
        this.rightR = this.input.keyboard.addKey("D", false, true);
        this.upArr = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP, false, true);
        this.downArr = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN, false, true);
        this.leftArr = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT, false, true);
        this.rightArr = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT, false, true);


        this.last_time = 0;
    }

    update(time, delta) {
        let dt = delta/1000;

        if (this.upW.isDown  || this.upArr.isDown) this.player.y -= this.player.speed*dt;
        if (this.downS.isDown || this.downArr.isDown) this.player.y += this.player.speed*dt;
        if (this.leftA.isDown || this.leftArr.isDown) this.player.x -= this.player.speed*dt;
        if (this.rightR.isDown || this.rightArr.isDown) this.player.x += this.player.speed*dt;
        
        this.last_time = time;
    }
    
}
