// Configuração inicial do jogo
const config = {
  type: Phaser.AUTO,
  width: innerWidth,
  height: 600,
  backgroundColor: '#343333',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
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
  this.player = this.physics.add.sprite(230, 450, 'player');
  this.player.body.setGravityY(15000);
  this.player.setCollideWorldBounds(true);
  this.player.vida = 100;

  this.player2 = this.physics.add.sprite(460, 450, 'player2');
  this.player2.setCollideWorldBounds(true);
  this.player2.setImmovable(true);
  this.player2.body.setAllowGravity(false);
  this.player2.vida = 100;

  this.vidaTextoPlayer1 = this.add.text(20, 20, '', { fontSize: '18px', fill: '#ffffff' });
  this.vidaTextoPlayer2 = this.add.text(20, 50, '', { fontSize: '18px', fill: '#ffffff' });

  this.poderesP1 = this.physics.add.group();
  this.poderesP2 = this.physics.add.group();

  this.dispararPoder = (jogador) => {
    if (jogador === 1) {
      const poder = this.poderesP1.create(this.player.x + 50, this.player.y, 'poder');
      poder.acertou = false;
      poder.setCollideWorldBounds(true);
      poder.body.onWorldBounds = true;
      poder.body.setAllowGravity(false);
      poder.setVelocityX(this.player.flipX ? -300 : 300);

      this.time.delayedCall(800, () => {
        if (poder.active) poder.destroy();
      });
    }

    if (jogador === 2) {
      const poder = this.poderesP2.create(this.player2.x + 50, this.player2.y, 'poderp2');
      poder.acertou = false;
      poder.setCollideWorldBounds(true);
      poder.body.onWorldBounds = true;
      poder.body.setAllowGravity(false);
      poder.setVelocityX(this.player2.flipX ? -300 : 300);

      this.time.delayedCall(800, () => {
        if (poder.active) poder.destroy();
      });
    }
  };

  this.physics.add.overlap(this.poderesP1, this.player2, (poder, alvo) => {

    if (poder.acertou) return;
    poder.acertou = true;
    poder.destroy();

    this.player2.vida -= 10;
    this.player2.vida = Math.max(0, this.player2.vida);

    this.tweens.add({
      targets: this.player2,
      tint: 0xff0000,
      duration: 100,
      yoyo: true,
      onComplete: () => this.player2.clearTint()
    });

    console.log(`Player2 foi atingido! Vida: ${this.player2.vida}`);
  });

  this.physics.add.overlap(this.poderesP2, this.player, (poder) => {

    if (poder.acertou) return;
    poder.acertou = true;
    poder.destroy();

    this.player.vida -= 10;
    this.player.vida = Math.max(0, this.player.vida);

    this.tweens.add({
      targets: this.player,
      tint: 0xff0000,
      duration: 100,
      yoyo: true,
      onComplete: () => this.player.clearTint(p)
    });

    console.log(`Player1 foi atingido! Vida: ${this.player.vida}`);
  });

  // Teclas
  this.teclaPoder = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  this.AtaqueP2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  this.teclaJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  this.trasA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  this.andarD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  this.cursors = this.input.keyboard.createCursorKeys();

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
  this.player.play('parado');

  const platform = this.add.rectangle(200, 500, 900, 30, 0x000000).setOrigin(0, 0);
  this.physics.add.existing(platform, true);
  this.physics.add.collider(this.player, platform);
}

function update() {
  const speed = 200;

  if (!this.player || !this.player.active || !this.player2 || !this.player2.active) return;

  this.player.body.setVelocity(0);
  this.player2.body.setVelocity(0);

  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-speed);
    this.player.anims.play('andar', true);
    this.player.setFlipX(true);
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(speed);
    this.player.anims.play('andar', true);
    this.player.setFlipX(false);
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

  if (Phaser.Input.Keyboard.JustDown(this.teclaJump)) {
    if (this.player.body.blocked.down) {
      this.player.setVelocityY(-8000);
    }
  }

  if (Phaser.Input.Keyboard.JustDown(this.teclaPoder)) {
    this.dispararPoder(1);
  }
  if (Phaser.Input.Keyboard.JustDown(this.AtaqueP2)) {
    this.dispararPoder(2);
  }

  this.vidaTextoPlayer1.setText(`Player 1 Vida: ${this.player.vida}`);
  this.vidaTextoPlayer2.setText(`Player 2 Vida: ${this.player2.vida}`);
}
