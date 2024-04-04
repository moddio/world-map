import "phaser";
import LoaderScene from "./scenes/LoaderScene";
import GameScene from "./scenes/GameScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  zoom: 1,
  input: {
    keyboard: true,
    gamepad: true,
  },
  render: {
    pixelArt: true,
    antialias: false,
    antialiasGL: false,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      //@ts-ignore
      gravity: {
        y: 500,
      },
    },
  },
  scene: [LoaderScene, GameScene],
};

window.addEventListener("load", () => new Phaser.Game(config));
