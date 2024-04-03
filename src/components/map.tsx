import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import LoaderScene from "../js/scenes/LoaderScene";
import GameScene from "../js/scenes/GameScene";
import { createPopper } from "@popperjs/core";
import { useNavigate } from "react-router-dom";

const MapComponent = () => {
  const gameRef = useRef(null);
  const userDetails = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const [hoveredTileInfo, setHoveredTileInfo] = useState(null);
  const [popperInstance, setPopperInstance] = useState(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight - 92,
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
      backgroundColor: "#59f773",
    };

    // Create new Phaser game instance
    //@ts-ignore
    gameRef.current = new Phaser.Game(config);
  }, []);

  useEffect(() => {
    if (hoveredTileInfo) {
      if (popperInstance) {
        popperInstance.destroy();
      }
      // Create the popup container
      const popperContainer = document.createElement("div");
      popperContainer.className =
        "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50";

      // Create the transparent overlay
      const overlay = document.createElement("div");
      overlay.className = "absolute inset-0 pointer-events-none"; // Disable pointer events
      overlay.style.backgroundColor = "transparent"; // Transparent background
     // Append overlay to the container

      // Create the popup content
      const popupContent = document.createElement("div");
      popupContent.className = "modal-content bg-white rounded-lg p-8 relative"; // added relative class for positioning the close icon

      const closeIcon = document.createElement("span");
      closeIcon.className =
        "absolute top-2 text-2xl right-2 cursor-pointer text-gray-500 hover:text-gray-700";
      closeIcon.textContent = "x";
      closeIcon.addEventListener("click", () => {
        if (popperInstance) {
          popperInstance.destroy();
        }
        document.body.removeChild(popperContainer); // remove popper container from the DOM
      });

      // Add title
      const title = document.createElement("h2");
      title.className = "text-2xl text-center font-bold ";
      title.textContent = hoveredTileInfo.mapName;

      // Add position information
      const positionInfo = document.createElement("span");
      positionInfo.className = "text-lg font-bold text-center";
      positionInfo.textContent = `Position: (${hoveredTileInfo.position.x}, ${hoveredTileInfo.position.y})`;

      const playButton = document.createElement("a");
      playButton.href = hoveredTileInfo.redirectUrl;
      playButton.className =
        " px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mx-auto";
      playButton.textContent = "Play";

      // Add building image
      const buildingImage = document.createElement("img");
      buildingImage.src = hoveredTileInfo.image;
      buildingImage.alt = "Building Image";
      buildingImage.className = "mt-2 mx-auto";
      buildingImage.style.width = "148px";
      buildingImage.style.height = "128px";

      // Append elements to popup content
      popupContent.appendChild(closeIcon); // append close icon
      popupContent.appendChild(title);
      popupContent.appendChild(positionInfo);
      popupContent.appendChild(playButton);
      popupContent.appendChild(buildingImage);
      popupContent.appendChild(overlay);

      // Append popup content to container
      popperContainer.appendChild(popupContent);

      // Append container to body
      document.body.appendChild(popperContainer);

      // Position the popup
      // popperContainer.style.left = `${hoveredTileInfo.mousePointer.x}px`;
      // popperContainer.style.top = `${hoveredTileInfo.mousePointer.y}px`;
      popupContent.style.width = "250px";

      // Cleanup function
      return () => {
        if (popperInstance) {
          popperInstance.destroy();
        }
      };
    } else {
      // If there's no hovered tile, destroy the popup instance
      if (popperInstance) {
        popperInstance.destroy();
      }
    }
  }, [hoveredTileInfo]);

  const handleTileClick = (event) => {
    console.log(138, userDetails)
    if(!userDetails){
      navigate('/login');
      return;
    }
    if (popperInstance) {
      popperInstance.destroy();
    }
    console.log(event.detail);
    setHoveredTileInfo(event.detail);
  };

  useEffect(() => {
    window.addEventListener("tileClick", handleTileClick);
    return () => {
      window.removeEventListener("tileClick", handleTileClick);
    };
  }, []);

  return (
    <div className='bg-white'>
      <div id='phaser-game'></div>
    </div>
  );
};

export default MapComponent;
