import { GameObjects, Physics, Scene } from "phaser";

import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    star: Physics.Arcade.Sprite;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    wasd: {
        up: Phaser.Input.Keyboard.Key;
        down: Phaser.Input.Keyboard.Key;
        left: Phaser.Input.Keyboard.Key;
        right: Phaser.Input.Keyboard.Key;
    };
    tv: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
    tvZone: Phaser.GameObjects.Rectangle;
    spaceKey: Phaser.Input.Keyboard.Key;
    dimLayer: Phaser.GameObjects.Rectangle;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.background = this.add.image(0, 0, "background").setOrigin(0, 0);
        this.star = this.physics.add
            .sprite(0, 720, "star")
            .setDepth(2)
            .setOrigin(0, 1);
        this.logo = this.add.image(512, 300, "logo").setDepth(0);
        this.tv = this.physics.add.staticSprite(700, 630, "tv").setDepth(1);
        this.tvZone = this.add.rectangle(700, 630, 64, 400, 0x0000ff, 0.2); // Semi-transparent for debugging
        this.physics.add.existing(this.tvZone, true);
        this.physics.add.overlap(
            this.star,
            this.tvZone,
            this.handleInteraction,
            undefined,
            this
        );

        this.title = this.add
            .text(512, 460, "Main Menu", {
                fontFamily: "Arial Black",
                fontSize: 38,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(0);
        this.cursors = this.input.keyboard!.createCursorKeys();

        this.wasd = {
            up: this.input.keyboard!.addKey("W"),
            down: this.input.keyboard!.addKey("S"),
            left: this.input.keyboard!.addKey("A"),
            right: this.input.keyboard!.addKey("D"),
        };
        this.spaceKey = this.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        this.cameras.main.startFollow(this.star, true, 0.1, 0.1);
        this.cameras.main.setBounds(0, 0, 2442, 1080);
        EventBus.emit("current-scene-ready", this);
    }

    handleInteraction() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            console.log("Player interacted with the TV!");
            // emit event from scene
            this.events.emit("showVideoPlayer", {
                playlistId: "PLCK_Hwh3LTgFM4BH5R4zgYR5uTPTnT_o0",
            });
            this.createDimLayer();
        }
    }

    createDimLayer() {
        this.dimLayer = this.add.rectangle(
            0,
            0,
            this.scale.width,
            this.scale.height,
            0x000000,
            0.5
        );
        this.dimLayer.setOrigin(0, 0);
        this.dimLayer.setDepth(3);
        this.dimLayer.setInteractive();
    }

    removeDimLayer() {
        this.dimLayer.destroy();
    }

    update() {
        if (this.cursors) {
            if (
                (this.cursors.left.isDown || this.wasd.left.isDown) &&
                (this.cursors.right.isDown || this.wasd.right.isDown)
            ) {
                return;
            } else if (this.cursors.left.isDown || this.wasd.left.isDown) {
                this.star.setX(this.star.x - 4);
            } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
                this.star.setX(this.star.x + 4);
            }
        }
        // If the star is touching the tv, console log
        if (this.star.getBounds().contains(this.tv.x, this.tv.y)) {
            console.log("Star is touching the TV!");
        }
    }

    changeScene() {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start("Game");
    }

    moveLogo(reactCallback: ({ x, y }: { x: number; y: number }) => void) {
        if (this.logoTween) {
            if (this.logoTween.isPlaying()) {
                this.logoTween.pause();
            } else {
                this.logoTween.play();
            }
        } else {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: "Back.easeInOut" },
                y: { value: 80, duration: 1500, ease: "Sine.easeOut" },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (reactCallback) {
                        reactCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y),
                        });
                    }
                },
            });
        }
    }
}

