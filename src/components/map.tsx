import React, { useEffect, useRef, useState, useCallback } from 'react';
import Phaser from 'phaser';
import LoaderScene from '../js/scenes/LoaderScene';
import GameScene from '../js/scenes/GameScene';

import axios from 'axios';
import { siteUrl } from '../config';
import { Dialog } from '@headlessui/react';
import Tooltip from './core/ui/Tooltip';
import { XMarkIcon } from '@heroicons/react/24/solid';

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

  const [clickedTileInfo, setClickedTileInfo] = useState(null); // State to store information about the clicked tile
  // const [popperInstance, setPopperInstance] = useState(null); // State for managing Popper.js instances (unused in this snippet)
  const [mapData, setMapData] = useState<GameDetails | null>(); // State to store fetched map data
  const [isOpen, setIsOpen] = useState(false); // State to control the visibility of the modal
  const [tooltipContent, setTooltipContent] = useState({}); // State to store content for the tooltip
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 }); // State to store the position of the tooltip
  const [tooltipVisible, setTooltipVisible] = useState(false); // State to control the visibility of the tooltip

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
        default: 'arcade',
        arcade: {
          debug: false,
          gravity: {
            y: 500,
          },
        },
      },
      scene: [LoaderScene, GameScene],
      backgroundColor: '#59f773',
    };

    // Create new Phaser game instance if it doesn't already exist
    if (!document.getElementById('phaserGame')) {
      //@ts-ignore
      gameRef.current = new Phaser.Game(config);
      gameRef.current.canvas.id = 'phaserGame';
    }

    // Function to disable context menu to prevent right-click options on the game
    const disableContextMenu = (event) => {
      event.preventDefault();
    };
    window.addEventListener('contextmenu', disableContextMenu);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('contextmenu', disableContextMenu);
    };
  }, []);

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
          if (document.getElementById('tooltip')) {
            document.getElementById('tooltip').style.display = 'none';
          }
        }
      }
    },
    [setIsOpen, setMapData]
  );

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
    window.addEventListener('tileClick', handleTileClick);
    window.addEventListener('tileHover', handleTileHover);

    return () => {
      window.removeEventListener('tileClick', handleTileClick);
      window.removeEventListener('tileHover', handleTileHover);
    };
  }, [handleTileClick, handleTileHover]);

  const handleClose = (e) => {
    // clearTileTintHandler();
    if (clickedTileInfo && clickedTileInfo.clicked) {
      clickedTileInfo.clicked = false;
    }
    setClickedTileInfo(null);
    setMapData(null);
  };

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
      {mapData && (
        <>
          <Dialog
            id='modalPopup'
            open={isOpen}
            onClose={handleClose}
            className='fixed inset-y-0 lg:right-3 right-0 max-md:bottom-0 max-sm:bottom-0 lg:overflow-y-auto max-md:w-32 max-sm:w-32 max-md:w-32 w-auto flex lg:items-center justify-end lg:top-0 max-md:top-auto max-sm:top-auto'
          >
            <div className='inline-block align-middle bg-[#0e274f] lg:rounded-lg overflow-hidden shadow-xl transform transition-all max-w-md w-full lg:w-[350px] max-md:w-72 max-sm:w-full lg:h-auto max-md:text-sm'>
              <div className='flex justify-between pl-3 mt-2'>
                <span
                  className='lg:text-xl max-md:text-lg max-sm:text:sm font-medium text-white'
                  id='modal-headline'
                >
                  {mapData && mapData.title}
                </span>
                <span onClick={handleClose} className='text-white cursor'>
                  <XMarkIcon className='w-5 mr-2' />
                </span>
              </div>
              {mapData && mapData.cover ? (
                <div className='lg:relative group'>
                  <div className='p-2 '>
                    <img
                      src={
                        mapData.cover.includes('https://')
                          ? mapData.cover
                          : `https://www.modd.io/${mapData.cover}`
                      }
                      alt=''
                      className='w-full justify-center items-center aspect-[5/3] rounded-sm'
                      style={{ border: '2px solid #4f8635' }}
                    />
                  </div>
                  <div className='absolute top-0 max-md:mt-8 max-md:top-5 max-sm:mt-8 max-sm:top-5 left-0 w-full lg:h-full h-auto flex lg:justify-center items-center opacity-0 transition-opacity group-hover:opacity-90'>
                    <div className='lg:hidden w-full bg-black bg-opacity-80 px-2 lg:py-4 rounded-md'>
                      <div className='text-white'></div>
                      <div className='text-left mb-2 h-32 overflow-auto text-gray-300 pl-2'>
                        <div className='text-sm'>
                          {mapData && mapData.description}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className='px-4 sm:p-2 overflow-auto'>
                <div className='sm:flex justify-center sm:items-start'>
                  <div className=' w-full'>
                    <div className=' '>
                      <div className='flex justify-between mb-3 text-gray-300'>
                        <div className='text-md '>
                          owned by:{' '}
                          <a
                            href={`${siteUrl}/user/${mapData.owner.username}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-500 font-bold focus:outline-none'
                          >
                            <u>
                              {mapData &&
                                mapData.owner &&
                                mapData.owner.username}
                            </u>
                          </a>
                        </div>
                        <div className='text-md '>
                          position:
                          {mapData && mapData.mapPosition ? (
                            <span className='font-bold ml-1'>
                              ({mapData.mapPosition.x}, {mapData.mapPosition.y})
                            </span>
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                      <div className='max-lg:block max-md:hidden max-sm:hidden max-xs:hidden'>
                        <b className='text-white text-lg'>Description</b> <br />
                        <div
                          className='text-left mb-1 h-auto max-h-72 overflow-auto text-gray-300 pl-2'
                          style={{
                            paddingRight: '10px',
                            borderLeft: '2px solid white',
                          }}
                        >
                          <div className='text-sm'>
                            {mapData && mapData.description}
                          </div>
                        </div>
                      </div>
                      <div className='flex justify-center lg:mt-5 max-md:mb-3 max-sm:mb-2'>
                        <button
                          type='button'
                          onClick={() =>
                            window.open(
                              `${siteUrl}/play/${mapData && mapData.gameSlug}`
                            )
                          }
                          className=' rounded-md shadow-sm px-4 py-2 bg-[#459539] text-base font-medium text-white hover:bg-[#4f8635] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full'
                          style={{ border: '2px solid #4f8635' }}
                        >
                          Enter World
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
      <div ref={gameRef} className='game-container'>
        {/* Modal for displaying game details */}
        {/* Tooltip for displaying information about the hovered tile */}
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
