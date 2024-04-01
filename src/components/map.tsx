// export default MapComponent;
import React, { useEffect, useLayoutEffect, useRef } from "react";
import Phaser from "phaser";
import LoaderScene from "../js/scenes/LoaderScene";
import GameScene from "../js/scenes/GameScene";
import { Tooltip as ReactTooltip } from "react-tooltip";

const MapComponent = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
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
          gravity: {
            y: 500,
          },
        },
      },
      scene: [LoaderScene, GameScene],
    };

    // Create new Phaser game instance
    //@ts-ignore
    gameRef.current = new Phaser.Game(config);
  }, []);

  return (
    <div id='phaser-game'>
      {/* <ReactTooltip /> */}
    </div>
  );
};

export default MapComponent;
