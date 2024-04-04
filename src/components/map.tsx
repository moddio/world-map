import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import LoaderScene from "../js/scenes/LoaderScene";
import GameScene from "../js/scenes/GameScene";
import { createPopper } from "@popperjs/core";
import { useNavigate } from "react-router-dom";
import { ShoppingBagIcon } from "@heroicons/react/24/solid";
import { Tooltip as ReactTooltip } from 'react-tooltip'

const MapComponent = () => {
  const gameRef = useRef(null);
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [clickedTileInfo, setClickedTileInfo] = useState(null);
  const [hoveredTileInfo, setHoveredTileInfo] = useState(null);
  const [popperInstance, setPopperInstance] = useState(null);
  const [lastPopperContainer, setLastPopperContainer] = useState(null);


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

    
    // Function to disable context menu
    const disableContextMenu = (event) => {
      event.preventDefault();
    };
    window.addEventListener("contextmenu", disableContextMenu);
    return () => {
      window.removeEventListener("contextmenu", disableContextMenu);
    };


  }, []);

  useEffect(() => {
    if (clickedTileInfo) {
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
      title.textContent = clickedTileInfo.mapName;

      // Add position information
      const positionInfo = document.createElement("span");
      positionInfo.className = "text-lg font-bold text-center";
      positionInfo.textContent = `Position: (${clickedTileInfo.position.x}, ${clickedTileInfo.position.y})`;

      const playButton = document.createElement("a");
      playButton.href = clickedTileInfo.redirectUrl;
      playButton.className =
        " px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2 mx-auto";
      playButton.textContent = "Play";

      // Add building image
      const buildingImage = document.createElement("img");
      buildingImage.src = clickedTileInfo.image;
      buildingImage.alt = "Building Image";
      buildingImage.className = "mt-2 mx-auto";
      buildingImage.style.width = "200px";
      buildingImage.style.height = "150px";

      // Append elements to popup content
      popupContent.appendChild(buildingImage);
      popupContent.appendChild(closeIcon); // append close icon
      popupContent.appendChild(title);
      popupContent.appendChild(positionInfo);
      popupContent.appendChild(playButton);
      popupContent.appendChild(overlay);

      // Append popup content to container
      popperContainer.appendChild(popupContent);

      // Append container to body
      document.body.appendChild(popperContainer);

      popupContent.style.width = "250px";

      // Cleanup function
      return () => {
        if (popperInstance) {
          popperInstance.destroy();
        }
      };
    } else {
      if (popperInstance) {
        popperInstance.destroy();
      }
    }
  }, [clickedTileInfo]);

  const handleTileClick = (event) => {
    // console.log(138, userDetails);
    if (!userDetails) {
      navigate("/login");
      return;
    }
    if (popperInstance) {
      popperInstance.destroy();
    }
    console.log(event.detail);
    setClickedTileInfo(event.detail);
  };

  const handleTileHover = (event) => {
    const hoveredTile = event.detail;
  
    // Create popper only if there is hovered tile information
    if (popperInstance) {
      popperInstance.destroy();
    }
  
    // Create popper container
    const popperContainer = document.createElement("div");
    popperContainer.className =
      "fixed inset-0 flex items-center justify-center";
  
    // Create transparent overlay
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 opacity-0 pointer-events-none"; // Transparent background
    overlay.style.transition = "opacity 0.3s ease"; // Smooth transition
    overlay.addEventListener("click", () => {
      if (popperInstance) {
        popperInstance.destroy();
      }
    });
  
    // Create popper content
    const popperContent = document.createElement("div");
    popperContent.className = "modal-content bg-white rounded-lg p-8";
    popperContent.style.width = "250px"; // Set width to 250px
  
    // Add tile name
    const title = document.createElement("h2");
    title.className = "text-2xl text-center font-bold mb-4";
    title.textContent = hoveredTile.mapName;
  
    // Add position information
    const positionInfo = document.createElement("span");
    positionInfo.className = "text-lg font-bold text-center";
    positionInfo.textContent = `Position: (${hoveredTile.position.x}, ${hoveredTile.position.y})`;
  
    // Append elements to popper content
    popperContent.appendChild(title);
    popperContent.appendChild(positionInfo);
  
    // Append popper content to container
    popperContainer.appendChild(popperContent);
    popperContainer.appendChild(overlay);
  
    // Append container to body
    // document.body.appendChild(popperContainer);
    setLastPopperContainer(popperContainer)
    if (!hoveredTile) {
      document.body.removeChild(popperContainer); 
      if (popperInstance) {
        popperInstance.destroy();
      }
      return;
    }
    // Set the popper instance state
    setPopperInstance(
      createPopper(hoveredTile.target, popperContainer, {
        placement: "top",
        modifiers: [
          {
            name: 'eventListeners',
            options: {
              scroll: false,
              resize: false,
            },
          },
        ],
      })
    );
  
    // Fade in the overlay
    setTimeout(() => {
      overlay.style.opacity = "0.5";
    }, 0);
  
    // Cleanup function
    return () => {
      if (popperInstance) {
        popperInstance.destroy();
      }
      document.body.removeChild(popperContainer);
    };
  };
  

  console.log(174, hoveredTileInfo)

  useEffect(() => {
   
  
    window.addEventListener("tileClick", handleTileClick);
    window.addEventListener("tileHover", handleTileHover);
  
    return () => {
      window.removeEventListener("tileClick", handleTileClick);
      window.removeEventListener("tileHover", handleTileHover);
    };
  }, [popperInstance]);
  return (
    <div>
      {/* Phaser Game */}
      <div ref={gameRef}></div>       
    </div>
  );
};

export default MapComponent;
