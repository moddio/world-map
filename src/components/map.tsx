import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import LoaderScene from "../js/scenes/LoaderScene";
import GameScene from "../js/scenes/GameScene";

import axios from "axios";
import { siteUrl } from "../config";
import { Dialog } from "@headlessui/react";
import Tooltip from "./core/ui/Tooltip";

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
  // const navigate = useNavigate();

  const [clickedTileInfo, setClickedTileInfo] = useState(null);
  const [popperInstance, setPopperInstance] = useState(null);
  const [mapData, setMapData] = useState<GameDetails | null>();
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipContent, setTooltipContent] = useState({});
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);

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
    if (!document.getElementById("phaserGame")) {
      //@ts-ignore
      gameRef.current = new Phaser.Game(config);
      gameRef.current.canvas.id = "phaserGame";
    }

    // Function to disable context menu
    const disableContextMenu = (event) => {
      event.preventDefault();
    };
    window.addEventListener("contextmenu", disableContextMenu);

    return () => {
      window.removeEventListener("contextmenu", disableContextMenu);
    };
  }, []);

  const fetchMaps = async (mapDetails) => {
    const res = await axios.get(
      `${siteUrl}/api/game/${mapDetails.id}/game-details/`
    );
    if (res && res.data && res.data.data) {
      setIsOpen(true);
      setMapData(res.data.data);
    }
  };

  useEffect(() => {
    if (mapData) {
      // Cleanup function
      return () => {
        if (window.getSelection) {
          // Clear the selection
          window.getSelection()!.removeAllRanges();
        } else if ((document as any).selection) {
          // For older versions of IE
          (document as any).selection.empty();
        }
      };
    }
  }, [clickedTileInfo, mapData]);
  const handleTileClick = async (event) => {
    
    const isModalOpen = document.getElementById("modalPopup") !== null;

    if (!isModalOpen) {
      await fetchMaps(event.detail);
      setClickedTileInfo(event.detail);
    }
  };

  const handleTileHover = (event) => {
    const hoveredTile = event.detail;
    if (hoveredTile) {
      // Update Tooltip content and position
      const tooltipText = {
        mapName: hoveredTile.mapName,
        owner: hoveredTile.ownerName,
      };
      setTooltipContent(tooltipText);
      setTooltipPosition(hoveredTile.mousePointer);
      setTooltipVisible(true);
    } else {
      setTooltipVisible(false);
    }

    // Cleanup function
    return () => {
      if (popperInstance) {
        popperInstance.destroy();
      }
    };
  };

  useEffect(() => {
    window.addEventListener("tileClick", handleTileClick);
    window.addEventListener("tileHover", handleTileHover);
  }, []);

  const handleClose = (e) => {

    // document.getElementById("modalPopup").style.display = "none";
    setClickedTileInfo(null);
    setMapData(null);
    clickedTileInfo.clicked = false;
  };
  return (
    <div>
      {/* Phaser Game */}
      <div ref={gameRef}>
        {/* Tailwind CSS Modal */}
        {mapData && (
          <>
            <Dialog
              id='modalPopup'
              open={isOpen}
              onClose={handleClose}
              className='fixed z-50 inset-0 overflow-y-auto flex items-center justify-center'>
              <Dialog.Overlay className='fixed inset-0 bg-gray-900 opacity-85' />

              <div className='inline-block align-middle bg-black opacity-85 rounded-lg overflow-hidden shadow-xl transform transition-all max-w-md w-full lg:w-[350px] lg:h-auto'>
                <img
                  src={mapData.cover}
                  alt=''
                  className='mx-full w-full justify-center items-center h-auto'
                />
                <div className='px-4 sm:p-2  overflow-auto'>
                  <div className='sm:flex justify-center sm:items-start'>
                    <div className='text-center w-full'>
                      <h3
                        className='sm:text-center font-medium text-white'
                        id='modal-headline'>
                        {mapData.title}
                      </h3>
                      <div>
                        <div className='font-bold text-gray-300'>
                          <div className=' text-sm'>
                            Created by:{" "}
                            <a
                              href={`${siteUrl}/user/${mapData.owner.username}`}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-blue-500 focus:outline-none'>
                              <u>{mapData.owner.username}</u>
                            </a>
                          </div>
                          <div className=' text-sm'>
                            Created on:{" "}
                            {new Date(mapData.createdAt).toLocaleDateString()}
                          </div>
                          <div className=' text-sm'>
                            Position: (
                            {mapData.mapPosition
                              ? `${mapData.mapPosition.x}, ${mapData.mapPosition.y}`
                              : ""}
                            )
                          </div>
                        </div>
                        <hr className='border border-gray-900' />
                        <div
                          className='text-justify mb-1 h-56 overflow-auto text-gray-300'
                          style={{ paddingRight: "10px" }}>
                          <div className='text-sm'>{mapData.description}</div>
                        </div>
                        {/* <hr className='border border-gray-900' /> */}
                        <div className='flex justify-between mt-5'>
                          <button
                            type='button'
                            onClick={() =>
                              window.open(`${siteUrl}/play/${mapData.gameSlug}`)
                            }
                            className='inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-green-700 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-3'>
                            Play
                          </button>
                          <button
                            onClick={(e:any) => {
                              e.modalClose = true;
                              handleClose(e);
                            }}
                            type='button'
                            className='inline-flex justify-center bg-red-700 rounded-md shadow-sm px-4 py-2 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Dialog>
          </>
        )}
        {tooltipVisible && (
          <Tooltip
            x={tooltipPosition.x}
            y={tooltipPosition.y}
            content={tooltipContent}
          />
        )}
      </div>
    </div>
  );
};

export default MapComponent;
