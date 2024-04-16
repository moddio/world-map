import React, { useEffect, useRef, useState, useCallback } from "react";
import Phaser from "phaser";
import LoaderScene from "../js/scenes/LoaderScene";
import GameScene from "../js/scenes/GameScene";

import axios from "axios";
import { siteUrl } from "../config";
import { Dialog } from "@headlessui/react";
import Tooltip from "./core/ui/Tooltip";
import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  TEPopover,
  TEPopoverToggler,
  TEPopoverContent,
  TERipple,
} from "tw-elements-react";

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
  const gameRef = useRef(null); // Reference to the Phaser game instance
  const popoverRef = useRef(null);

  const [clickedTileInfo, setClickedTileInfo] = useState(null);
  // const [popperInstance, setPopperInstance] = useState(null);
  const [mapData, setMapData] = useState<GameDetails | null>();
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipContent, setTooltipContent] = useState({});
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [popupOffset, setPopupOffset] = useState({ x: 0, y: 0 });

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

    // Create new Phaser game instance if it doesn't already exist
    if (!document.getElementById("phaserGame")) {
      //@ts-ignore
      gameRef.current = new Phaser.Game(config);
      gameRef.current.canvas.id = "phaserGame";
    }

    // Function to disable context menu to prevent right-click options on the game
    const disableContextMenu = (event) => {
      event.preventDefault();
    };
    window.addEventListener("contextmenu", disableContextMenu);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("contextmenu", disableContextMenu);
    };
  }, []);

  const updatePopupPosition = useCallback(
    (mousePointer) => {
      // Calculate the new position of the popup based on the mouse pointer and offset
      const newX = mousePointer.x + popupOffset.x;
      const newY = mousePointer.y + popupOffset.y;

      // Set the new position of the popup
      // setTooltipPosition({ x: newX, y: newY });
    },
    [popupOffset]
  );

  // Fetches map details from the server
  const fetchMaps = useCallback(
    async (mapDetails) => {
      if (mapDetails && mapDetails.clickedTileInfo) {
        const res = await axios.get(
          `${siteUrl}/api/game/${mapDetails.clickedTileInfo.id}/game-details/`
        );
        if (res && res.data && res.data.data) {
          // TODO: set highlight on click. Temp disabled as giving issue on prod
          // mapDetails.hoveredTile.tintFill = true;
          // mapDetails.hoveredTile.tint = 0x209944;
          setIsOpen(true);
          setMapData(res.data.data);
          if (document.getElementById("tooltip")) {
            document.getElementById("tooltip").style.display = "none";
          }
        }
      }
    },
    [setIsOpen, setMapData]
  );

  const handleMapDrag = useCallback(
    (event) => {
      // Update the position of the popup when dragging the map
      if (clickedTileInfo) {
        updatePopupPosition(clickedTileInfo.mousePointer);
      }
    },
    [clickedTileInfo, updatePopupPosition]
  );

  useEffect(() => {
    // Add event listener for map drag
    window.addEventListener("mapDrag", handleMapDrag);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("mapDrag", handleMapDrag);
    };
  }, [handleMapDrag]);

  // Effect to clear text selection when mapData changes or component unmounts
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

  // Handles clicks on tiles by fetching map details
  const handleTileClick = useCallback(
    async (event) => {
      if (event && event.detail && event.detail.default) {
        setMapData({
          owner: {
            _id: "59219d1852bf2a167508cc4c",
            username: "m0dE",
          },
          description: "Currently in Alpha.",
          mapPosition: {
            x: "16",
            y: "14",
          },
          cover: "/assets/images/modd_standard2.png",
          createdAt: "2024-01-22T16:58:03.913Z",
          title: "m0dE's Base",
          gameSlug: "C0wgR98Wg",
        });
        setIsOpen(true);
        return;
      }
      if (event.detail.clickedTileInfo) {
        const offsetX = event.detail.clickedTileInfo.mousePointer.x;
        const offsetY = event.detail.clickedTileInfo.mousePointer.y;
        setPopupOffset({ x: offsetX, y: offsetY });
      }

      if (!event.detail.default) await fetchMaps(event.detail);
      setClickedTileInfo(event.detail.clickedTileInfo);
    },
    [fetchMaps, setClickedTileInfo]
  );

  // Handles mouse hover over tiles to show tooltips
  const handleTileHover = useCallback((event) => {
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
  }, []);

  useEffect(() => {
    window.addEventListener("tileClick", handleTileClick);
    window.addEventListener("tileHover", handleTileHover);
    window.addEventListener("closePopup", handleClose)

    return () => {
      window.removeEventListener("tileClick", handleTileClick);
      window.removeEventListener("tileHover", handleTileHover);
      window.removeEventListener("closePopup", handleClose)

    };
  }, [handleTileClick, handleTileHover]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        handleClose();
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClose = () => {
    // clearTileTintHandler();
    // setIsOpen(false);
    // document.getElementById("modalPopup").style.display = "none";
    if (clickedTileInfo && clickedTileInfo.clicked) {
      clickedTileInfo.clicked = false;
    }
    setClickedTileInfo(null);
    setMapData(null);
  };

  const getFirstTilePosition = () => {
    if (
      gameRef.current &&
      gameRef.current.scene &&
      gameRef.current.scene.scenes.length > 0
    ) {
      const gameScene = gameRef.current.scene.scenes.find(
        (scene) => scene.constructor.name === "GameScene"
      );
      if (gameScene) {
        // Assuming the first layer in the tilemap is the one containing tiles
        const tilemapLayer = gameScene.tilemap.layers[0];
        // Assuming the first tile exists
        const firstTile = tilemapLayer.data[0][0];
        if (firstTile) {
          // Get the world position of the first tile
          const worldPosition = gameScene.tilemap.tileToWorldXY(
            firstTile.x,
            firstTile.y
          );
          console.log(
            "First Tile Position (x, y):",
            worldPosition.x,
            worldPosition.y
          );
          return { x: worldPosition.x, y: worldPosition.y };
        }
      }
    }
    return null;
  };

  console.log(289, clickedTileInfo);

  // const clearTileTintHandler = () => {
  //   setTileTintColor({ tint: 0xffffff, tintFill: false });
  // };

  // const setTileTintColor = (data) => {
  //   if (gameRef.current && gameRef.current.scene.scenes.length > 0) {
  //     const gameScene = gameRef.current.scene.scenes.find(
  //       (scene) => scene.constructor.name === "GameScene"
  //     );
  //     if (gameScene) {
  //       gameScene.buildings.forEach((building) => {
  //         building.tintFill = true;
  //         building.tint = data.tint;
  //       });
  //     }
  //   }
  // };
  return (
    <div>
      <div ref={gameRef} className='game-container' onClick={handleClose}>
        {mapData && (
          // <TEPopover isOpen={true} onClose={handleClose}>
          //   <TEPopoverContent className="absolute" >
          //     <div
          //       id='modalPopup'
          //       className='relative inset-y-0 max-md:bottom-0 max-sm:bottom-0 lg:overflow-y-auto max-md:w-32 max-sm:w-32 max-md:w-32 w-auto flex lg:items-center lg:top-0 max-md:top-auto md:top-auto max-sm:top-auto' style={{ top: clickedTileInfo?.mousePointer?.y || 500, left: clickedTileInfo?.mousePointer?.x || 500 }}>
          //       <div className='inline-block align-middle bg-[#0e274f] lg:rounded-lg overflow-hidden shadow-xl transform transition-all max-w-md w-full lg:w-[350px] max-md:w-72 md:w-80 max-sm:w-full lg:h-auto max-md:text-sm'>
          //         <div className='flex justify-between pl-3 mt-2'>
          //           <span
          //             className='lg:text-xl max-md:text-lg max-sm:text:sm font-medium text-white'
          //             id='modal-headline'>
          //             Map Details
          //           </span>
          //           <span onClick={handleClose} className='text-white cursor'>
          //             <XMarkIcon className='w-5 mr-2' />
          //           </span>
          //         </div>
          //         {mapData && mapData.cover ? (
          //           <div className='lg:relative group'>
          //             <div className='p-2 '>
          //               <img
          //                 src={
          // mapData.cover.includes("https://")
          //   ? mapData.cover
          //   : `https://www.modd.io/${mapData.cover}`
          //                 }
          //                 alt=''
          //                 className='w-full justify-center items-center aspect-[5/3] rounded-sm'
          //                 style={{ border: "2px solid #4f8635" }}
          //               />
          //             </div>
          //             <div className='absolute max-md:top-10 md:top-10 max-sm:mt-8 max-sm:top-5 left-0 w-full lg:h-full h-auto flex lg:justify-center items-center opacity-0 transition-opacity group-hover:opacity-90'>
          //               <div className='lg:hidden w-full bg-black bg-opacity-80 px-2 lg:py-4 rounded-md'>
          //                 <div className='text-white'></div>
          //                 <div className='text-left mb-2 h-32 overflow-auto text-gray-300 pl-2'>
          //                   <div className='text-sm'>
          //                     {mapData && mapData.description}
          //                   </div>
          //                 </div>
          //               </div>
          //             </div>
          //           </div>
          //         ) : (
          //           <></>
          //         )}
          //         <div className='px-4 sm:p-2 overflow-auto'>
          //           <div className='sm:flex justify-center sm:items-start'>
          //             <div className='w-full'>
          //               <div>
          //                 <div className='flex justify-between mb-3 text-gray-300'>
          //                   <div className='text-md '>
          //                     owned by:{" "}
          //                     <a
          //                       href={`${siteUrl}/user/${mapData.owner.username}`}
          //                       target='_blank'
          //                       rel='noopener noreferrer'
          //                       className='text-blue-500 font-bold focus:outline-none'>
          //                       <u>
          //                         {mapData &&
          //                           mapData.owner &&
          //                           mapData.owner.username}
          //                       </u>
          //                     </a>
          //                   </div>
          //                   <div className='text-md '>
          //                     position:
          //                     {mapData && mapData.mapPosition ? (
          //                       <span className='font-bold ml-1'>
          //                         ({mapData.mapPosition.x},{" "}
          //                         {mapData.mapPosition.y})
          //                       </span>
          //                     ) : (
          //                       ""
          //                     )}
          //                   </div>
          //                 </div>
          //                 <div className='lg:block max-md:hidden md:hidden max-sm:hidden max-xs:hidden'>
          //                   <b className='text-white text-lg'>Description</b>{" "}
          //                   <br />
          //                   <div
          //                     className='text-left mb-1 h-auto max-h-72 overflow-auto text-gray-300 pl-2'
          //                     style={{
          //                       paddingRight: "10px",
          //                       borderLeft: "2px solid white",
          //                     }}>
          //                     <div className='text-sm'>
          //                       {mapData && mapData.description}
          //                     </div>
          //                   </div>
          //                 </div>
          //                 <div className='flex justify-center lg:mt-5 max-md:mb-3 max-sm:mb-2'>
          //                   <button
          //                     type='button'
          //                     onClick={() =>
          //                       window.open(
          //                         `${siteUrl}/play/${
          //                           mapData && mapData.gameSlug
          //                         }?autojoin=true`
          //                       )
          //                     }
          //                     className=' rounded-md shadow-sm px-4 py-2 bg-[#459539] text-base font-medium text-white hover:bg-[#4f8635] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full'
          //                     style={{ border: "2px solid #4f8635" }}>
          //                     Enter World
          //                   </button>
          //                 </div>
          //               </div>
          //             </div>
          //           </div>
          //         </div>
          //       </div>
          //     </div>
          //   </TEPopoverContent>
          // </TEPopover>
          <div>
            <TEPopover isOpen={isOpen} >
              <TEPopoverContent className='none' fallbackPlacement={['bottom', 'top', 'left', 'right']} placement='top'>
                <div
                  id='modalPopup'
                  className='relative inset-y-0 max-md:bottom-0 max-sm:bottom-0 lg:overflow-y-auto max-md:w-32 max-sm:w-32 max-md:w-32 w-auto flex lg:items-center lg:top-0 max-md:top-auto md:top-auto max-sm:top-auto'
                  style={{
                    top: clickedTileInfo?.mousePointer?.y
                      ? clickedTileInfo?.mousePointer?.y - 200
                      : 223,
                    left: clickedTileInfo?.mousePointer?.x || 963,
                  }}>
                  <div className='inline-block align-middle bg-[#0e274f] lg:rounded-lg overflow-hidden shadow-xl transform transition-all max-w-md w-full lg:w-[350px] max-md:w-72 md:w-80 max-sm:w-full lg:h-auto max-md:text-sm'>
                    <div className='p-3'>
                      {/* Close button */}
                      <button
                        onClick={handleClose}
                        className='absolute top-0 mb-1 right-0 mt-1 mr-1 text-white hover:text-gray-300 focus:outline-none'>
                        <svg
                          className='h-6 w-6'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M6 18L18 6M6 6l12 12'
                          />
                        </svg>
                      </button>
                      {/* Content */}
                      <div className='flex items-center justify-between mb-2'>
                        <img
                          className='w-16 h-16 rounded-full'
                          src={
                            mapData.cover.includes("https://")
                              ? mapData.cover
                              : `https://www.modd.io/${mapData.cover}`
                          }
                          alt={mapData.title}
                        />
                        <div>
                          <button
                            type='button'
                            onClick={() =>
                              window.open(
                                `${siteUrl}/play/${
                                  mapData && mapData.gameSlug
                                }?autojoin=true`
                              )
                            }
                            className='text-white bg-[#459539] hover:bg-[#4f8635] focus:ring-4 font-medium rounded-lg text-xs px-3 py-1.5 focus:outline-none '>
                            Enter World
                          </button>
                        </div>
                      </div>
                      <p className='text-base font-semibold leading-none text-gray-900 dark:text-white'>
                        <div>{mapData.title}</div>
                      </p>

                      <p className='mb-2 text-sm'>{mapData.description}</p>
                      <div className='flex text-sm'>
                        <div className='me-2'>
                          <div className='text-md '>
                            owned by:{" "}
                            <a
                              href={`${siteUrl}/user/${mapData.owner.username}`}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-blue-500 font-bold focus:outline-none'>
                              <u>
                                {mapData &&
                                  mapData.owner &&
                                  mapData.owner.username}
                              </u>
                            </a>
                          </div>
                        </div>
                        <div>
                          <div className='text-md '>
                            position:
                            {mapData && mapData.mapPosition ? (
                              <span className='font-bold ml-1'>
                                ({mapData.mapPosition.x},{" "}
                                {mapData.mapPosition.y})
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TEPopoverContent>
            </TEPopover>
          </div>
          // <MapPopover isOpen={isOpen} mapData={mapData} close={handleClose} />
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