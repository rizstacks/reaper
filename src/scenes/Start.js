export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/bg.png');
        this.load.image('character', 'assets/char.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('enemyA', 'assets/enemyA.png');
        this.load.image('enemyB', 'assets/enemyB.png');
    }

    create() {
        //sprites
        this.background = this.add.sprite(640, 360, 'background');
        this.player = this.add.sprite(640, 360, 'character');

        //player attributes
        this.player.hp = 1000;
        this.player.speed = 300;
        this.physics.add.existing(this.player);
        this.player.setScale(2);

        //score and hp display
        this.score = 0;
        this.scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
        this.hpText = this.add.text(20, 60, 'HP: 1000', { fontSize: '32px', fill: '#FFF' });

        //this is to listen for movement, i addded arrows cus i want to use them
        this.upW = this.input.keyboard.addKey("W", false, true);
        this.downS = this.input.keyboard.addKey("S", false, true);
        this.leftA = this.input.keyboard.addKey("A", false, true);
        this.rightR = this.input.keyboard.addKey("D", false, true);
        this.upArr = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP, false, true);
        this.downArr = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN, false, true);
        this.leftArr = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT, false, true);
        this.rightArr = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT, false, true);

        //cannon
        this.aimDir = 1 // 1 is right and -1 is left
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE, false, true);

        //groups (all created BEFORE any overlap uses them)
        this.bullets = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.enemyBullets = this.physics.add.group();
        this.lastShot = 0;

        // player bullet hits enemy
        this.physics.add.overlap(this.bullets, this.enemies, (bullet, enemy) => {
            this.score += enemy.points;
            this.scoreText.setText('Score: ' + this.score);
            bullet.destroy();
            enemy.destroy();
        });

        // enemy bullet hits player
        this.physics.add.overlap(this.player, this.enemyBullets, (player, bullet) => {
            bullet.destroy();
            if (this.time.now < this.invulnUntil) return;   // still protected
            this.invulnUntil = this.time.now + 500;   // 0.5s of protection
            player.hp -= 85;   // tweak damage here
            this.hpText.setText('HP: ' + player.hp);
            player.setAlpha(0.5);
            this.time.delayedCall(500, () => player.setAlpha(1));
        });

        //waves
        this.waveActive = false;
        this.waves = [
            { a: 2, b: 0 },
            { a: 3, b: 2 },
            { a: 4, b: 4 },
        ];
        this.waveText = this.add.text(640, 360, '', { fontSize: '64px', fill: '#FFF' }).setOrigin(0.5);

        //enemy shooting timer
        this.time.addEvent({
            delay: 100,
            loop: true,
            callback: () => this.enemiesShoot()
        });

        this.init_game();   // must stay last
    }
    shoot() {
        const bullet = this.bullets.create(this.player.x + this.aimDir * 40, this.player.y, 'bullet');
        bullet.body.setVelocityX(this.aimDir * 600);
        bullet.setFlipX(this.aimDir === -1);
    }
    enemiesShoot() {
        this.enemies.getChildren().forEach(e => {
            const dir = this.player.x > e.x ? 1 : -1;  
            const b = this.enemyBullets.create(e.x, e.y, 'bullet');
            b.setTint(0xff0000); 
            b.body.setVelocityX(dir * 150);
        });
    }
    spawnEnemyA(side) {
        const x = side === -1 ? 0 : 1280;
        const y = Phaser.Math.Between(50, 670);
        const enemy = this.enemies.create(x, y, 'enemyA');
        enemy.setScale(2);
        enemy.body.setVelocityX(-side * 100);   // moves toward the middle
        enemy.setFlipX(side === 1);
        enemy.points = 10;
    }
    spawnEnemyB(side) {
        const x = side === -1 ? 10 : 1270;
        const y = Phaser.Math.Between(50, 670);
        const enemy = this.enemies.create(x, y, 'enemyB');
        enemy.setScale(2);
        enemy.type = 'B';                           
        enemy.points = 20;                          
        enemy.phase = Phaser.Math.FloatBetween(0, 6);   
        enemy.body.setVelocityX(-side * 180);      
        enemy.setFlipX(side === 1);
    }
    startWave() {
        const cfg = this.waves[this.wave];
        this.waveText.setText('Wave ' + (this.wave + 1));   

        this.time.delayedCall(1500, () => {   
            this.waveText.setText('');
            for (let i = 0; i < cfg.a; i++) this.spawnEnemyA(i % 2 === 0 ? -1 : 1);   // alternates sides
            for (let i = 0; i < cfg.b; i++) this.spawnEnemyB(i % 2 === 0 ? -1 : 1);
            this.waveActive = true;
        });
    }
    init_game() {
        this.player.hp = 1000;
        this.player.y = 360;
        this.score = 0;
        this.wave = 0;
        this.aimDir = 1;
        this.invulnUntil = 0;
        this.lastShot = 0;
        this.waveActive = false;
        this.scoreText.setText('Score: 0');
        this.hpText.setText('HP: 1000');
        this.startWave();
    }
    update(time, delta) {
        let dt = delta/1000;
        //player movement
        if (this.upW.isDown  || this.upArr.isDown) this.player.y -= this.player.speed*dt;
        if (this.downS.isDown || this.downArr.isDown) this.player.y += this.player.speed*dt;
        this.physics.world.wrap(this.player, 0); //infinite loop thing

        //cannon aim and fire
        if (this.leftA.isDown || this.leftArr.isDown) this.aimDir = -1;
        if (this.rightR.isDown || this.rightArr.isDown) this.aimDir = 1;
        this.player.setFlipX(this.aimDir === -1);

        if (Phaser.Input.Keyboard.JustDown(this.space) && time > this.lastShot + 200) {
            this.shoot();
            this.lastShot = time;
        }

        this.bullets.getChildren().forEach(b => {
            this.physics.world.wrap(b, 0);
        });
        this.enemies.getChildren().forEach(e => {
            if (e.type === 'B') {
                e.body.setVelocityY(Math.cos(time / 400 + e.phase) * 150);
            }
            this.physics.world.wrap(e, 0);
        });
                // enemy bullets wrap like everything else
        this.enemyBullets.getChildren().forEach(b => {
            this.physics.world.wrap(b, 0);
        });
        this.checkWaveEnd();
        this.checkEndGame();
    }
    checkWaveEnd() {
        if (this.waveActive && this.enemies.countActive() === 0) {
            this.waveActive = false;
            this.bullets.clear(true, true);
            this.enemyBullets.clear(true, true);
            this.wave = (this.wave + 1) % this.waves.length;   
            this.startWave();
        }
    }
    checkEndGame(){
        if(this.player.hp < 1){
            this.scene.stop('Start');
            this.scene.start('GameOver')
        }
    }
}
