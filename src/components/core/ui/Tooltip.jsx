import React from "react";

const Tooltip = ({ x, y, content }) => {

  return (
      <div
        className={`max-md:hidden max-lg:hidden block absolute left-[${x}px] top-[${y}px] top-0 bg-gray-800 text-left bg-opacity-85 text-white text-md rounded-md shadow-lg z-10 pointer-events-none`}>
        <div className="">
            <img
              src={ content.cover.includes('https://')
              ? content.cover
              : `https://www.modd.io/${content.cover}`}
              alt={''}
              className='w-32 aspect-[5/3] m-2'
            />
          </div>
          <div className='text-center text-white rounded-lg'>
            <div className=' items-center'>
              <div className='text-lg font-semibold'>{content.mapName}</div>
              <div className='text-sm mb-2'>Owner:{'  '}{content.owner}</div>
            </div>
            
        </div>
      </div>
  );
};

export default Tooltip;
