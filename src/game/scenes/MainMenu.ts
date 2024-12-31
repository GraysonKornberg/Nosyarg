import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    star: GameObjects.Sprite;
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

    constructor() {
        super("MainMenu");
    }

    create() {
        this.background = this.add.image(0, 0, "background").setOrigin(0, 0);
        this.star = this.add
            .sprite(0, 720, "star")
            .setDepth(100)
            .setOrigin(0, 1);
        this.logo = this.add.image(512, 300, "logo").setDepth(100);

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
            .setDepth(100);

        this.cursors = this.input.keyboard!.createCursorKeys();
        this.wasd = {
            up: this.input.keyboard!.addKey("W"),
            down: this.input.keyboard!.addKey("S"),
            left: this.input.keyboard!.addKey("A"),
            right: this.input.keyboard!.addKey("D"),
        };
        this.cameras.main.startFollow(this.star, true, 0.1, 0.1);
        this.cameras.main.setBounds(0, 0, 2442, 1080);
        EventBus.emit("current-scene-ready", this);
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

