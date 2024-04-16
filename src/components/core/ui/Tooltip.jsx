import React from 'react';

const Tooltip = ({ x, y, content }) => {
  // Function to convert camel case to sentence
  const camelToSentence = (str) => {
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
  };

  // Render the key-value pairs on new lines
  const renderedText = Object.entries(content).map(([key, value]) => {
    if (key === 'mapName') {
      return (
        <div key={key}>
          <span className='font-bold text-xl'>{value}</span>
        </div>
      );
    } else {
      return (
        <div key={key}>
          <span className='font-bold'>{camelToSentence(key)}:</span> {value}
        </div>
      );
    }
  });

  return (
    <div
      id='tooltip'
      className={`max-md:hidden md:hidden absolute left-[${x}px] top-[${y}px] top-0 bg-gray-800 text-left bg-opacity-85 text-white text-md px-2 py-1 rounded-md shadow-lg z-10 pointer-events-none`}
    >
      {renderedText}
    </div>
  );
};

export default Tooltip;
