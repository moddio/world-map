import React, { useEffect, useRef, useState, useCallback } from 'react';
import Phaser from 'phaser';
import LoaderScene from '../js/scenes/LoaderScene';
import GameScene from '../js/scenes/GameScene';

import axios from 'axios';
import { siteUrl } from '../config';
import { Dialog } from '@headlessui/react';
import Tooltip from './core/ui/Tooltip';
import { XMarkIcon } from '@heroicons/react/24/solid';

// Interface for game details received from the API
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
      const res = await axios.get(
        `${siteUrl}/api/game/${mapDetails.id}/game-details/`
      );
      if (res && res.data && res.data.data) {
        setIsOpen(true);
        setMapData(res.data.data);
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
      await fetchMaps(event.detail);
      setClickedTileInfo(event.detail);
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
    setClickedTileInfo(null);
    setMapData(null);
    clickedTileInfo.clicked = false;
  };
  return (
    <div>
      <div ref={gameRef} className='game-container'>
        {/* Modal for displaying game details */}
        {mapData && (
          <>
            <Dialog
              id='modalPopup'
              open={isOpen}
              onClose={handleClose}
              className='fixed z-50 inset-3 overflow-y-auto flex items-center justify-end'
            >
              <Dialog.Overlay className='fixed inset-0' />

              <div className='inline-block align-middle bg-[#0e274f] rounded-lg overflow-hidden shadow-xl transform transition-all max-w-md w-full lg:w-[350px] lg:h-auto'>
                <div className='flex justify-between pl-3 mt-2'>
                  <span className='text-white text-lg font-bold'>
                    Map Details
                  </span>
                  <span onClick={handleClose} className='text-white cursor'>
                    <XMarkIcon className='w-5 mr-2' />
                  </span>
                </div>
                {mapData && mapData.cover ? (
                  <div className='p-2 '>
                    <img
                      src={mapData.cover}
                      alt=''
                      className='w-full justify-center items-center h-auto rounded-sm'
                      style={{ border: '2px solid #4f8635' }}
                    />
                  </div>
                ) : (
                  <></>
                )}
                <div className='px-4 sm:p-2 overflow-auto'>
                  <div className='sm:flex justify-center sm:items-start'>
                    <div className=' w-full'>
                      <h3
                        className=' font-medium text-white'
                        id='modal-headline'
                      >
                        {mapData && mapData.title}
                      </h3>
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
                                ({mapData.mapPosition.x},{' '}
                                {mapData.mapPosition.y})
                              </span>
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
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
                        <div className='flex justify-center mt-5'>
                          <button
                            type='button'
                            onClick={() =>
                              window.open(
                                `${siteUrl}/play/${mapData && mapData.gameSlug}`
                              )
                            }
                            className=' rounded-md shadow-sm px-4 py-2 bg-[#1d491c] text-base font-medium text-white hover:bg-[#4f8635] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full'
                            style={{ border: '2px solid #4f8635' }}
                          >
                            Visit {mapData && mapData.title}
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
