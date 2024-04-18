import React, { useEffect, useRef, useState, useCallback } from 'react';
import Phaser from 'phaser';
import LoaderScene from '../js/scenes/LoaderScene';
import GameScene from '../js/scenes/GameScene';
import GameSceneWithMarker from './../js/scenes/GameScene-experimental';

import axios from 'axios';
import { siteUrl } from '../config';
import { Dialog } from '@headlessui/react';
import Tooltip from './core/ui/Tooltip';
import { UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { UsersIcon } from '@heroicons/react/24/outline';

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

const MapComponent = ({showMarker}) => {
  const gameRef = useRef(null); // Reference to the Phaser game instance

  const [clickedTileInfo, setClickedTileInfo] = useState(null); // State to store information about the clicked tile
  // const [popperInstance, setPopperInstance] = useState(null); // State for managing Popper.js instances (unused in this snippet)
  const [mapData, setMapData] = useState<GameDetails | null>(); // State to store fetched map data
  const [isOpen, setIsOpen] = useState(false); // State to control the visibility of the modal
  const [isDefaultOpen, setIsDefaultOpen] = useState(true); // State to control the visibility of the modal
  const [tooltipContent, setTooltipContent] = useState({}); // State to store content for the tooltip
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 }); // State to store the position of the tooltip
  const [tooltipVisible, setTooltipVisible] = useState(false); // State to control the visibility of the tooltip
  const [activePlayCount, setActivePlayCount] = useState(0);

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
      scene: [LoaderScene, showMarker ? GameSceneWithMarker : GameScene],
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
  }, [showMarker]);

  useEffect(() => {
    const anchorTag = document.createElement('a');
    anchorTag.href =
      'https://docs.google.com/document/d/e/2PACX-1vSAPegZPVVZaW5raU8gIQ46CnAU-hseidLMn7SRSI7glTQXfHQ0Ng6rN33uUyWO5_FuLqn_GTn0vBsi/pub';
    anchorTag.classList.add(
      'fixed',
      'bottom-0',
      'left-0',
      'bg-black',
      'text-white',
      'no-underline',
      'hover:no-underline',
      'p-1'
    );
    anchorTag.target = '_blank';
    anchorTag.rel = 'noreferrer';
    anchorTag.textContent = 'Credits';
    document.body.appendChild(anchorTag);
  }, []);

  // Fetches map details from the server

  const fetchMaps = useCallback(
    async (mapDetails) => {
      if (mapDetails && mapDetails.clickedTileInfo) {
        const res = await axios.get(
          `${siteUrl}/api/game/${mapDetails.clickedTileInfo.id}/game-details/`
        );
        if (res && res.data && res.data.data) {
          // Set mapData state with received data
          setIsOpen(true);
          setMapData(res.data.data);

          // If gameId is available in clickedTileInfo
          if (mapDetails.clickedTileInfo.id) {
            try {
              // Fetch totalActivePlayers for the gameId
              const activePlayersCount = await axios.get(
                `${siteUrl}/api/v1/games/active-player-count-by-game-id/?mapId=${mapDetails.clickedTileInfo.id}`
              );
              if (activePlayersCount && activePlayersCount.data) {
                // If totalActivePlayers is greater than 0, set activePlayersCount state
                setActivePlayCount(activePlayersCount.data.totalActivePlayers);
              }
            } catch (error) {
              console.error('Error fetching totalActivePlayers:', error);
            }
          }
        }
      }
    },
    [setIsOpen, setMapData, setActivePlayCount]
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
      if (event && event.detail && event.detail.default) {
        setMapData({
          owner: {
            _id: '59219d1852bf2a167508cc4c',
            username: 'm0dE',
          },
          description: 'Currently in Alpha.',
          mapPosition: {
            x: '16',
            y: '14',
          },
          cover:
            'https://cache.modd.io/asset/spriteImage/1713296865932_cover.png',
          createdAt: '2024-01-22T16:58:03.913Z',
          title: "m0dE's Base",
          gameSlug: 'C0wgR98Wg',
        });
        setIsOpen(true);
        return;
      }
      if (!event.detail.default) {
        await fetchMaps(event.detail);
        setIsDefaultOpen(false);
      }
      setClickedTileInfo(event.detail.clickedTileInfo);
    },
    [fetchMaps, setClickedTileInfo]
  );

  // Handles mouse hover over tiles to show tooltips
  const handleTileHover = useCallback((event) => {
    const hoveredTile = event.detail;
    if (hoveredTile) {
      // Update Tooltip content and position

      setTooltipContent(hoveredTile);
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
  const handleDefaultClose = (e) => setIsDefaultOpen(false);
  return (
    <div>
      <Dialog
        id='modalDefaultPopup'
        open={isDefaultOpen}
        onClose={handleDefaultClose}
        className='fixed inset-y-0 lg:right-3 right-0 max-md:bottom-0 max-sm:bottom-0 lg:overflow-y-auto max-md:w-32 max-sm:w-full max-md:w-32 sm:w-full lg:w-auto flex lg:items-center justify-end lg:top-0 max-md:top-auto md:top-auto max-sm:top-auto'
      >
        <div
          className='backdrop-blur inline-block align-middle rounded-lg max-sm:rounded-none overflow-hidden shadow-xl transform transition-all max-w-md w-full lg:w-[400px] max-md:w-72 md:w-80 max-sm:w-full lg:h-auto max-md:text-sm p-2'
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
        >
          <div className='lg:relative group'>
            <img
              src='https://cache.modd.io/asset/spriteImage/1713296865932_cover.png'
              alt=''
              className='rounded-lg w-full justify-center items-center aspect-[5/3]'
            />
            <div className='absolute max-md:top-10 md:top-10 max-sm:mt-8 max-sm:top-5 left-0 w-full lg:h-full h-auto flex lg:justify-center items-center opacity-0 transition-opacity group-hover:opacity-90'>
              <div className='lg:hidden w-full bg-black bg-opacity-80 px-2 lg:py-4 rounded-md'>
                <div className='text-left mb-2 h-32 overflow-auto text-gray-300 pl-2'>
                  <div className='text-md'>
                    <ul className='list-disc list-inside  leading-5'>
                      <li>
                        <strong>scavenge</strong> the wastelands for loot
                      </li>
                      <li>
                        <strong>survive</strong> against undead hordes
                      </li>
                      <li>
                        <strong>visit</strong> fortresses made by other players
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='p-2 overflow-auto text-white '>
            <div className='sm:flex justify-center sm:items-start'>
              <div className=' w-full'>
                <div className='font-bold h5 text-center'>
                  Welcome to <br />
                  <span className='title'>DOOMR.</span>
                  <span className='subtitle'>IO</span>
                </div>
                <div className='lg:block max-md:hidden md:hidden max-sm:hidden max-xs:hidden'>
                  <div className='text-left mb-1 h-auto max-h-72 overflow-auto text-gray-300 pl-2'>
                    <div className='text-md'>
                      <ul className='list-disc list-inside leading-5'>
                        <li>
                          <strong>scavenge</strong> the wastelands for loot
                        </li>
                        <li>
                          <strong>survive</strong> against undead hordes
                        </li>
                        <li>
                          <strong>visit</strong> fortresses made by other
                          players
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className='flex w-full justify-center lg:mt-3 lg:mb-2 max-md:mb-3 max-sm:mb-2'>
                  <a
                    href='https://www.modd.io/play/LAD?autojoin=true'
                    rel='noreferrer'
                    target='_blank'
                    className='btn-quick w-full text-center focus:outline-none hover:no-underline rounded-md shadow-sm py-3 px-0 text-base text-white hover:bg-[#2c871f] w-full bg-[#459539]'
                  >
                    QUICK START
                  </a>{' '}
                  <br />
                </div>
                <div
                  className='text-center cursor-pointer'
                  onClick={handleDefaultClose}
                >
                  or:
                  <span className='lnk-option ml-1'>
                    SELECT A FORTRESS ON THE MAP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
      {mapData && (
        <>
          {/* <Dialog
            id='modalPopup'
            open={isOpen}
            onClose={handleClose}
            className='fixed inset-y-0 lg:right-3 right-0 max-md:bottom-0 max-sm:bottom-0 lg:overflow-y-auto max-md:w-32 max-sm:w-32 max-md:w-32 w-auto flex lg:items-center justify-end lg:top-0 max-md:top-auto md:top-auto max-sm:top-auto'
          >
            <div className='inline-block align-middle bg-[#0e274f] rounded-tl-lg lg:rounded-bl-lg lg:rounded-br-lg max-sm:rounded-none  overflow-hidden shadow-xl transform transition-all max-w-md w-full lg:w-[400px] max-md:w-72 md:w-80 max-sm:w-full lg:h-auto max-md:text-sm'>
              {mapData && mapData.cover ? (
                <div className='lg:relative group'>
                  <span
                    onClick={handleClose}
                    className='fixed z-9 top-0 right-0 text-white cursor-pointer p-1 bg-[#0e274f] '
                  >
                    <XMarkIcon className='w-6' />
                  </span>
                  <img
                    src={
                      mapData.cover.includes('https://')
                        ? mapData.cover
                        : `https://www.modd.io/${mapData.cover}`
                    }
                    alt=''
                    className='w-full justify-center items-center aspect-[5/3]'
                  />
                  <div className='absolute max-md:top-10 md:top-10 max-sm:mt-8 max-sm:top-5 left-0 w-full lg:h-full h-auto flex lg:justify-center items-center opacity-0 transition-opacity group-hover:opacity-90'>
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
              <div className='p-2 overflow-auto text-white '>
                <div className='sm:flex justify-center sm:items-start'>
                  <div className=' w-full'>
                    <div className='grid grid-cols-4 grid-rows-1 gap-4'>
                      <div>
                        <div className='mt-2 text-gray-300 text-sm'>
                          <div className='text-md '>
                            <div className='flex'>
                              <UserCircleIcon className='h-5 ' />
                              <a
                                href={`${siteUrl}/user/${mapData.owner.username}`}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='ml-1 text-blue-500 font-bold focus:outline-none  hover:no-underline'
                              >
                                @
                                {mapData &&
                                  mapData.owner &&
                                  mapData.owner.username}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-span-2'>
                        <div className='font-bold h4 text-center'>
                          {mapData && mapData.title}
                        </div>
                      </div>
                      <div className='col-start-4'>
                        <div className='flex'>
                          <div className='text-sm mt-2'>
                            {mapData && mapData.mapPosition ? (
                              <div className='flex'>
                                <MapPinIcon className='h-5 ' />
                                <span className='font-bold ml-1'>
                                  {mapData.mapPosition.x},{' '}
                                  {mapData.mapPosition.y}
                                </span>
                              </div>
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr className='border-slate-700 my-1 p-1' />
                    <div className='lg:block max-md:hidden md:hidden max-sm:hidden max-xs:hidden'>
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
                    <hr className='border-slate-700' />
                    <div className='flex justify-center lg:mt-3 lg:mb-2 max-md:mb-3 max-sm:mb-2'>
                      <a
                        href={`${siteUrl}/play/${
                          mapData && mapData.gameSlug
                        }?autojoin=true`}
                        rel='noreferrer'
                        target='_blank'
                        className='text-center hover:no-underline rounded-md shadow-sm px-4 py-2 text-base font-medium text-white hover:bg-pink-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full'
                        style={{
                          border: '1px solid #fff',
                          userSelect: 'none',
                          transition: '0.2s',
                        }}
                      >
                        Enter World
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Dialog> */}
          <Dialog
            id='modalPopup'
            open={isOpen}
            onClose={handleClose}
            className='backdrop-blur fixed p-2 h-full right-0 max-md:bottom-none max-sm:bottom-0 lg:overflow-y-auto max-md:w-32 max-sm:w-full  max-md:w-32 lg:w-auto flex justify-end lg:top-0 max-md:top-0 md:top-0 max-sm:top-auto max-sm:h-[450px]'
            style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
          >
            <div className='inline-block bg-transparent max-sm:rounded-none overflow-hidden shadow-xl transform transition-all max-w-md w-full lg:w-[400px] max-md:w-72 md:w-80 max-sm:w-full max-md:text-sm'>
              {mapData && mapData.cover ? (
                <div className='lg:relative group'>
                  <span
                    onClick={handleClose}
                    className='fixed z-9 top-0 right-0 text-white cursor-pointer p-1 bg-[#000] '
                  >
                    <XMarkIcon className='w-6' />
                  </span>
                  <img
                    src={
                      mapData.cover.includes('https://')
                        ? mapData.cover
                        : `https://www.modd.io/${mapData.cover}`
                    }
                    alt=''
                    className='rounded-lg w-full justify-center items-center aspect-[5/3]'
                  />
                  <div className='absolute max-md:top-10 md:top-10 max-sm:mt-8 max-sm:top-5 left-0 w-full lg:h-full h-auto flex lg:justify-center items-center opacity-0 transition-opacity group-hover:opacity-90'>
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
              <div className='p-2 overflow-auto text-white '>
                <div className='sm:flex justify-center sm:items-start'>
                  <div className=' w-full'>
                    <div className='grid grid-cols-5 grid-rows-1 gap-4'>
                      <div>
                        <div className='lg:mt-2 text-sm'>
                          <div className='text-md '>
                            <div className='flex'>
                              { <UserIcon className='h-5 text-[#6b8bd4]' /> }
                              <a
                                href={`${siteUrl}/user/${mapData.owner.username}`}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='w-6 ml-1 text-blue-500 font-bold focus:outline-none  hover:no-underline'
                              >
                                @
                                {mapData &&
                                  mapData.owner &&
                                  mapData.owner.username}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-start-3'>
                        <div className='lg:mt-2 ml-3 text-sm'>
                          <div className='text-md '>
                            <div className='flex '>
                              {activePlayCount ? (
                                <>
                                  <UsersIcon className='h-5 text-[#6b8bd4]' />
                                  <span className='w-3 ml-1  font-bold focus:outline-none'>
                                    {activePlayCount}
                                  </span>
                                </>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-start-5'>
                        <div className='flex'>
                          <div className='text-sm lg:mt-2'>
                            {mapData && mapData.mapPosition ? (
                              <div className='flex'>
                                <MapPinIcon className='h-5 text-[#6b8bd4]' />
                                <span className='font-bold ml-1'>
                                  {mapData.mapPosition.x},{' '}
                                  {mapData.mapPosition.y}
                                </span>
                              </div>
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-span-2'>
                      <hr className='border-slate-700 my-1 p-1' />
                      <div className='font-bold text-lg text-center'>
                        {mapData && mapData.title}
                      </div>
                    </div>

                    <div className='lg:block max-md:hidden md:hidden max-sm:hidden max-xs:hidden'>
                      {mapData.description && (
                        <div>
                          <b className='text-white text-lg'>Description</b>
                          <br />
                        </div>
                      )}
                      <div
                        className='text-left mb-1 max-h-96 h-auto overflow-y-auto text-gray-300 pl-2'
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
                  </div>
                </div>
              </div>
              <div className='flex justify-center w-full absolute bottom-0 lg:mt-3 lg:mb-2 max-md:mb-3 max-sm:mb-2'>
                <a
                  href={`${siteUrl}/play/${
                    mapData && mapData.gameSlug
                  }?autojoin=true`}
                  rel='noreferrer'
                  target='_blank'
                  className='bg-[#459539] text-center hover:no-underline rounded-md shadow-sm px-4 py-2 text-base font-medium text-white hover:bg-[#4f8635] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full'
                  style={{
                    userSelect: 'none',
                    transition: '0.2s',
                  }}
                >
                  Enter World
                </a>
              </div>
            </div>
          </Dialog>
        </>
      )}
      <div ref={gameRef} className='game-container'>
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
