const config = {
  type: Phaser.AUTO,
  width: innerWidth,
  height: 600,
  backgroundColor: '#343333',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true, // Ativado para ver hitboxes
      gravity: { y: 0 }
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.spritesheet('player', 'playera.png', { frameWidth: 96, frameHeight: 96 });
  this.load.spritesheet('player2', 'player2.png', { frameWidth: 96, frameHeight: 96 });
  this.load.spritesheet('poder', 'poder.png', { frameWidth: 96, frameHeight: 96 });
  this.load.spritesheet('poderanimacao', 'poderanimacao.png', { frameWidth: 96, frameHeight: 96 });
  this.load.spritesheet('poderp2', 'poderplayer2.png', { frameWidth: 96, frameHeight: 96 });
  this.load.spritesheet('playera2', 'playera2.png', { frameWidth: 96, frameHeight: 96 });
}

function create() {

  this.podeAtirar = true;

  this.player = this.physics.add.sprite(230, 450, 'player');
  this.player.body.setGravityY(20000);
  this.player.setCollideWorldBounds(true);
  this.player.vida = 15;
  this.player.dano = 5;

  this.player2 = this.physics.add.sprite(460, 450, 'player2');
  this.player2.setCollideWorldBounds(true);
  this.player2.setImmovable(true);
  this.player2.body.setAllowGravity(false);
  this.player2.vida = 100;

  this.vidaTextoPlayer1 = this.add.text(20, 20, `Player 1 Vida: ${this.player.vida}`, { fontSize: '18px', fill: '#ffffff' });
  this.vidaTextoPlayer2 = this.add.text(20, 50, `Player 2 Vida: ${this.player2.vida}`, { fontSize: '18px', fill: '#ffffff' });

  this.poderes = this.physics.add.group();

   this.dispararPoder = () => {
    const poder = this.poderes.create(this.player.x + 50, this.player.y, 'poder');
    poder.acertou = false
    poder.setCollideWorldBounds(true);
    poder.body.onWorldBounds = true;
    poder.body.setAllowGravity(false);


    const velocidade = 300;
    if (this.player.flipX) {
      poder.setVelocityX(-velocidade);
    } else {
      poder.setVelocityX(velocidade);
    }

    this.time.delayedCall(800, () => {
      if (poder.active) poder.destroy();
    });

  // Colisão entre poder e player2
  this.physics.add.overlap(this.poderes, this.player2, (poder1, player2) => {
    if (poder.acertou) return;
    poder.acertou = true;
      const alvo = this.player2;

      poder.destroy(poder)

  console.log('Colisão detectada!', alvo);

    if (alvo.vida >= 0) {
      alvo.vida -= 10;
      alvo.vida = Math.max(0, alvo.vida);


      this.tweens.add({
        targets: alvo,
        tint: 0xff0000,
        duration: 100,
        yoyo: true,
        onComplete: () => alvo.clearTint()
      });

      console.log(`Player2 foi atingido! Vida restante: ${alvo.vida}`);

      if (alvo.vida <= 0) {
        alvo.disableBody(true, true);
        console.log('Player2 foi derrotado!');
      }
    }
  });
}

  this.teclaZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
  this.teclaPoder = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  this.teclaJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  this.pularW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  this.andarD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  this.trasA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  this.atacarS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);


  this.anims.create({
    key: 'andar',
    frames: this.anims.generateFrameNumbers('player', { start: 1, end: 5 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'parado',
    frames: this.anims.generateFrameNumbers('player', { frame: 1 }),
    frameRate: -1,
    repeat: 0
  });

  this.anims.create({
    key: 'poderanimacao',
    frames: this.anims.generateFrameNumbers('poderanimacao', { start: 9, end: 10 }),
    frameRate: 6,
    repeat: 0
  });

  this.player.play('parado');

  this.anims.create({
    key: 'parado20seg',
    frames: this.anims.generateFrameNumbers('player', { start: 1, end: 30 }),
    frameRate: 8,
    repeat: 0
  });

  this.anims.create({
    key: 'parado20segp2',
    frames: this.anims.generateFrameNumbers('playera2', { start: 1, end: 30 }),
    frameRate: 8,
    repeat: 0
  });


  

  this.cursors = this.input.keyboard.createCursorKeys();

  const platform = this.add.rectangle(200, 500, 900, 30, 0x000000).setOrigin(0, 0);
  this.physics.add.existing(platform, true);
  this.physics.add.collider(this.player, platform);
}

function update() {
  const speed = 200;
  this.player.body.setVelocity(0);
  this.player2.body.setVelocity(0)

  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-speed);
    this.player.anims.play('andar', true);
    this.player.setFlipX(true);
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(speed);
    this.player.anims.play('andar', true);
    this.player.setFlipX(false);
  } else if (this.teclaZ.isDown) {
    this.player.anims.play('parado20seg', true);
    this.player2.anims.play('parado20segp2', true);
  } else {
    this.player.anims.play('parado', true);
  }

  if (this.andarD.isDown) {
    this.player2.setVelocityX(speed);
     this.player2.setFlipX(false);
  }
  if (this.trasA.isDown) {
  this.player2.setVelocityX(-speed);
    this.player2.setFlipX(true);
  }

  if (Phaser.Input.Keyboard.JustDown(this.teclaPoder)) {
  console.log('ENTER pressionado!');
  this.dispararPoder();

    this.time.delayedCall(800, () => {
      this.podeAtirar = true;
      console.log('podeAtirar liberado!');
    });
  }

  if (Phaser.Input.Keyboard.JustDown(this.teclaJump)) {
    if (this.player.body.blocked.down) {
      this.player.setVelocityY(-3000);
    }
  }

  this.vidaTextoPlayer1.setText(`Player 1 Vida: ${this.player.vida}`);
  this.vidaTextoPlayer2.setText(`Player 2 Vida: ${this.player2.vida}`);

}