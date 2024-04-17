import { UsersIcon } from "@heroicons/react/20/solid";
import { PlayIcon } from "@heroicons/react/24/solid";
import React from "react";

const Tooltip = ({ x, y, content }) => {
  return (
    <div
      className={`max-md:hidden max-lg:hidden block absolute left-[${x}px] top-[${y}px] top-0 bg-gray-800 text-left bg-opacity-85 text-white text-md rounded-md shadow-lg z-10 pointer-events-none`}>
      <div className=''>
        <img
          src={
            content.cover.includes("https://")
              ? content.cover
              : `https://www.modd.io/${content.cover}`
          }
          alt={""}
          className='w-32 aspect-[5/3] m-2'
        />
      </div>
      <div className='text-center text-white rounded-lg'>
        <div className=' items-center'>
          <div className='text-lg font-semibold mb-2 px-1'>{content.mapName}</div>
          <div className='text-sm mb-2'>
            Owner:{"  "}
            {content.ownerName}
          </div>
          {content.totalActivePlayers > -1 ? (
            <div className='flex justify-center text-sm mb-2'>
              <PlayIcon className='h-5 w-5 text-center mr-1' />
              <div>{' '} {content.totalActivePlayers}</div>
              {/* <div >10</div> */}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
