import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import LoaderScene from "../js/scenes/LoaderScene";
import GameScene from "../js/scenes/GameScene";
import { createPopper } from "@popperjs/core";
import { useNavigate } from "react-router-dom";
import {
  PlayIcon,
  ShoppingBagIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { NoSymbolIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { siteUrl, worldMapId } from "../config";

interface GameDetails {
  owner: {
    _id: string;
    username: string;
  };
  description: string;
  mapPosition: {
    x: string;
    y: string;
  };
  cover: string;
  createdAt: string;
  title: string;
  gameSlug: string;
}

const MapComponent = () => {
  const gameRef = useRef(null);
  // const userDetails = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [clickedTileInfo, setClickedTileInfo] = useState(null);
  const [popperInstance, setPopperInstance] = useState(null);
  const [mapData, setMapData] = useState<GameDetails | null>();

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
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoRound: true,
        resolution: window.devicePixelRatio,
      },
      render: {
        pixelArt: true,
        antialias: false,
        antialiasGL: false,
        autoResize: true,
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
    if (!document.getElementById('phaserGame')) {
      //@ts-ignore
      gameRef.current = new Phaser.Game(config);
      gameRef.current.canvas.id = 'phaserGame';
    }

    // Function to disable context menu
    const disableContextMenu = (event) => {
      event.preventDefault();
    };
    window.addEventListener("contextmenu", disableContextMenu);
    window.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        document.getElementById("modalPopup").style.display = "none"; // Call your function to close the modalPopup
      }
    });
    return () => {
      window.removeEventListener("contextmenu", disableContextMenu);
    };
  }, []);

  const fetchMaps = async (mapDetails) => {
    const res = await axios.get(
      `${siteUrl}/api/game/${mapDetails.id}/game-details/`
    );
    if (res && res.data && res.data.data) {
      setMapData(res.data.data);
    }
  };

  useEffect(() => {
    const modalPopup = document.getElementById("modalPopup");
    if (mapData) {
      if (modalPopup) {
        const mapImage = document.querySelector("#mapImage");
        if (mapImage instanceof HTMLImageElement) {
          mapImage.src = `${mapData.cover}`;
        }
        document.querySelector("#mapName").innerHTML =
          "<u>" + mapData.title + "</u>";
        // document.querySelector("#mapType").innerHTML = `Type - ${clickedTileInfo.type}`;
        document.querySelector(
          "#mapOwner"
        ).innerHTML = `Created by: <a href='${siteUrl}/user/${mapData?.owner?.username}' target='_blank' rel='noopener noreferrer'> ${mapData?.owner?.username}</a>`;
        document.querySelector(
          "#dateCreated"
        ).innerHTML = `Created on: ${new Date(
          mapData?.createdAt
        ).toLocaleDateString()}`;
        document.querySelector("#mapPosition").innerHTML = mapData?.mapPosition
          ? `Position: (${mapData?.mapPosition?.x}, ${mapData?.mapPosition?.y})`
          : "";
        document.querySelector("#description").innerHTML = mapData?.description;
        modalPopup.style.display = "flex";
        modalPopup.classList.add("fadeInAnimation");
      }
      // Cleanup function
      return () => {
        modalPopup.style.display = "none";
        modalPopup.classList.remove("fadeInAnimation");
        if (window.getSelection) {
          // Clear the selection
          window.getSelection()!.removeAllRanges();
        } else if ((document as any).selection) {
            // For older versions of IE
            (document as any).selection.empty();
        }
      };
    } else {
      modalPopup.style.display = "none";
    }
  }, [clickedTileInfo, mapData]);

  const handleTileClick = async (event) => {
    // console.log(138, userDetails);
    /*  if (!userDetails) {
      navigate("/login");
      return;
    }*/
    await fetchMaps(event.detail);
    if (popperInstance) {
      popperInstance.destroy();
    }
    // console.log(event.detail);
    setClickedTileInfo(event.detail);
  };

  const handleTileHover = (event) => {
    const hoveredTile = event.detail;

    // Create popper only if there is hovered tile information
    if (popperInstance) {
      popperInstance.destroy();
    }
    if (!hoveredTile) {
      return;
    }

    // Create popper container
    const popperContainer = document.createElement("div");
    popperContainer.className =
      "fixed inset-0 flex items-center justify-center";

    if (!hoveredTile) {
      document.body.removeChild(popperContainer);
      if (popperInstance) {
        popperInstance.destroy();
      }
      return;
    }

    const handleNoTileHover = (e) => {
      // console.log(220, e);
    };

    window.removeEventListener("noTileHover", handleNoTileHover);

    // Set the popper instance state
    setPopperInstance(
      createPopper(event.currentTarget, popperContainer, {
        // placement: "top",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [
                hoveredTile.mousePointer.x + 500,
                hoveredTile.mousePointer.y,
              ],
            },
          },
        ],
      })
    );

    // Cleanup function
    return () => {
      if (popperInstance) {
        popperInstance.destroy();
      }
      document.body.removeChild(popperContainer);
    };
  };

  useEffect(() => {
    const handleNoTileHover = (e) => {
      // console.log(220, e);
    };

    window.addEventListener("tileClick", handleTileClick);
    window.addEventListener("tileHover", handleTileHover);
    window.addEventListener("noTileHover", handleNoTileHover);

    return () => {
      window.removeEventListener("tileClick", handleTileClick);
      window.removeEventListener("tileHover", handleTileHover);
      window.removeEventListener("noTileHover", handleNoTileHover);
    };
  }, []);

  const handleClose = () => {
    document.getElementById("modalPopup").style.display = "none";
    setClickedTileInfo(null);
    setMapData(null);
  };

  let gameExists = true;
  let gameIsPublished = true;
  
  return (
    <div>
      {/* Phaser Game */}
      <div ref={gameRef}>
        <div
          id='modalPopup'
          className='fixed flex items-center justify-center h-full w-full bg-black bg-opacity-70'
          style={{ transition: "all 1s ease 0s", display: "none" }}>
          <div
            className='bg-white rounded-xl w-[1080px] h-[576px] relative grid grid-cols-2 grid-rows-1 gap-0 flex align-middle'
            style={{ margin: "0 auto", boxShadow: "0px 20px 50px 0px black" }}>
            <div className='left-section col-span-1 flex items-center justify-center'>
              <img
                src=''
                alt='Building Image'
                className=' rounded-l-xl popup-image h-full w-full'
                id='mapImage'
              />
            </div>
            <div className='right-section p-3 flex flex-col justify-center items-center relative'>
              <XCircleIcon
                onClick={handleClose}
                className='absolute top-2 right-2 w-10 h-10 text-[#000] cursor-pointer'
              />
              <h2
                className='text-2xl text-center font-bold row-span-1'
                id='mapName'></h2>
              <span
                className='text-lg font-bold block row-span-1'
                id='mapOwner'></span>
              <span
                className='text-lg font-bold block row-span-1'
                id='dateCreated'></span>
              <span
                className='popup-position text-lg font-bold block row-span-1'
                id='mapPosition'></span>
              <span
                className='text-lg font-bold block row-span-1'
                id='mapType'></span>
              <div className='popup-description overflow-auto h-72 mt-3 text-justify pr-2'>
                <span className='text-md text-gray-700' id='description'></span>
              </div>
              <div className='m-3'>                
                {gameExists && gameIsPublished && (
                  <button
                    onClick={() => window.open(clickedTileInfo.redirectUrl)}                 
                    className='inline-flex items-center bg-[#1e721a] hover:bg-[#045112] text-[#fff] font-bold border-2 border-[#1e721a] hover:border-[#045112] p-2 rounded-md shadow-md' style={{transition:'0.3s'}}>
                    <span className='mr-2'>Play</span>
                    <PlayIcon className="w-5 h-5 text-[#fff] cursor-pointer" />
                  </button>
                )}
                {!gameExists && (
                  <button
                    onClick={() => alert('Error: Game not found!')}                 
                    className='inline-flex items-center bg-gray-600 hover:cursor-not-allowed hover:bg-gray-700 text-white font-bold border-2 border-gray-600 hover:border-gray-700 p-2 rounded-md shadow-md' style={{transition: '0.3s'}}>
                    <span className='mr-2'>Play</span>
                    <NoSymbolIcon className="w-5 h-5 text-[#fff]" />
                  </button>              
                )}
                {gameExists && !gameIsPublished && (
                  <button
                    onClick={() => alert('Error: Game is unpublished!')}                 
                    className='inline-flex items-center bg-gray-600 hover:cursor-not-allowed hover:bg-gray-700 text-[#fff] font-bold border-2 border-gray-600 hover:border-gray-700 p-2 rounded-md shadow-md' style={{transition:'0.3s'}}>
                    <span className='mr-2'>Play</span>
                    <NoSymbolIcon className="w-5 h-5 text-[#fff]" />
                  </button>
                )}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
