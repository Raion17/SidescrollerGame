const gameState = {
    score: 0,
}

var player;

//TODO play around with the ogre generation and variables
//var ogre
//var goblin

function preload () {
    this.load.image('lizard', '../assets/sprites/heroes/lizard_m_idle_anim_f0.png');
    this.load.image('goblin', '../assets/sprites/enemies/goblin_idle_anim_f0.png');
    this.load.image('ogre', '../assets/sprites/enemies/ogre_idle_anim_f0.png');
    this.load.image('platform', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/platform.png');
}

function create () {
    const platforms = this.physics.add.staticGroup();

    platforms.create(320, 350, 'platform').setScale(2, 0.5).refreshBody();

    gameState.scoreText = this.add.text(320, 340, 'Score: 0', { fontSize: '15px', fill: '#000' });

    player = this.physics.add.sprite(90, 300, 'lizard').setScale(1);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms);

    //TODO Do not delete this code we are using it to refactor the ogreGeneration function
    //Goblin and ogre sprite test starts
    // this.goblin = this.physics.add.sprite(200, 200, 'goblin');
    // this.goblin.flipX = true;
    // this.physics.add.collider(this.goblin, platforms);
    // this.orc = this.physics.add.sprite(250, 200, 'ogre');
    // this.orc.flipX = true;
    // this.physics.add.collider(this.orc, platforms);
    //Goblin and ogre sprite test ends

    const ogres = this.physics.add.group();

    const ogreList = ['goblin', 'ogre'];

    const ogreGeneration = () => {
        const xCoord = 650;
        const yCoord = 310;
        let randomOgre = ogreList[Math.floor(Math.random() * 2)];
        ogres.create(xCoord, yCoord, randomOgre);
    };

    const ogreGenLoop = this.time.addEvent({
        delay: 1200,
		callback: ogreGeneration,
        loop: true,
    });

    const scoreAdd = () => {
        gameState.score += 1;
        gameState.scoreText.setText(`Score: ${gameState.score}`);
    }

    const scoreLoop = this.time.addEvent({
        delay: 100,
        callback: scoreAdd,
        loop: true,
    });

    this.physics.add.collider(player, ogres, () => {
        ogreGenLoop.destroy();
        scoreLoop.destroy();
        this.physics.pause();

        this.add.text(200, 150, 'Game Over \n Click to Restart', { fontSize: '30px', fill: '#000' });
        gameState.score = 0;

        this.input.on('pointerup', () => {
            this.scene.restart();
        });
    });

    this.physics.add.collider(ogres, platforms, function (ogre){
        ogre.setVelocityX(-100);
    });

}

function update () {
    const cursors = this.input.keyboard.createCursorKeys();

    //TODO Jump & dash-jump interaccion por player character need tweaks
    if(cursors.left.isDown){
        player.setVelocityX(-150);
    } else if (cursors.right.isDown){
        player.setVelocityX(150);
    } else if (cursors.up.isDown && player.body.touching.down){
        player.setVelocityY(-150);
    } else {
        player.setVelocityX(0);
    }

}

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    backgroundColor: "6c6c6c",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            enableBody: true,
            debug: false,
        }
    },
    scene: {
        preload,
        create,
        update,
    }
}

const game = new Phaser.Game(config);