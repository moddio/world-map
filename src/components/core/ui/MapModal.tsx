import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { siteUrl } from "../../../config";
import { createPopper } from "@popperjs/core";
import { CircleStackIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";

const MapModal = ({ isOpen, onClose }) => {
  const [maps, setMaps] = useState([]);
  const [page, setPage] = useState(1); // Track page number
  const [loading, setLoading] = useState(false); // Track loading state
  const [purchaseSuccessMessage, setPurchaseSuccessMessage] = useState("");

  const popupRef = useRef();
  const confettiRef = useRef();
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  const Toast = ({ message }) => {
    return (
      <div className="fixed inset-0 flex justify-center items-center">
        <div className="bg-white bg-opacity-75 shadow-lg px-6 py-3 rounded-lg">
          <p className="text-center">{message}</p>
        </div>
      </div>
    );
  };

  // Fetch map details from the API
  const fetchMaps = async () => {
    try {
      setLoading(true); // Set loading to true while fetching
      const response = await axios.get(
        `${siteUrl}/api/v1/maps/list-maps/?page=${page}&limit=5`
      );
      if (response && response.data) {
        setMaps((prevMaps) => [...prevMaps, ...response.data]); // Append new maps to existing ones
        setPage((prevPage) => prevPage + 1); // Increment page number
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching maps:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = (mapName) => {
  /*  if (!userDetails) {
      navigate("/login");
      return;
    }
*/

    setPurchaseSuccessMessage(`Map "${mapName}" purchased successfully!`);

    setShowConfetti(true);

    // onClose(true)

    setTimeout(() => {
      setShowConfetti(false);
    }, 6000);

    // You can add your buy now logic here
  };

  // Call fetchMaps when modal is opened or page number changes
  useEffect(() => {
    if (isOpen) {
      fetchMaps();
    }
  }, [isOpen]);

  // Create Popper instance on modal popup
  useEffect(() => {
    if (isOpen) {
      const modal: any = popupRef.current;
      const options = {
        placement: "bottom",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 10],
            },
          },
        ],
      };
      createPopper(null, modal, {});

      // Scroll event listener to detect when user scrolls to the bottom of the popup
      const handleScroll = () => {
        const isAtBottom =
          modal.scrollTop + modal.clientHeight === modal.scrollHeight;
        console.log(78, isAtBottom);
        if (isAtBottom && !loading) {
          fetchMaps();
        }
      };

      modal.addEventListener("scroll", handleScroll);

      return () => {
        modal.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isOpen, loading]);

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 ${
        isOpen ? "" : "hidden"
      }`}>
      <div
        ref={popupRef}
        className='bg-white p-8 rounded-lg shadow-lg'
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
          maxWidth: "90%",
        }}>
        <button
          className='absolute top-4 font-bold right-4 text-gray-600'
          onClick={onClose}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
        <h2 className='text-2xl font-bold mb-4'>Maps</h2>
        <div className='grid grid-cols-3 gap-4'>
          {maps.map((map) => (
            <div
              style={{ border: "1px solid black" }}
              key={map._id}
              className='bg-[#9fcca1] rounded-lg p-4'>
              <img
                src={map.image}
                alt={map.name}
                className='w-full h-32 mb-2 object-cover'
              />
              <h3 className='text-lg font-semibold mb-2'>{map.name}</h3>
              <p className='flex justify-center text-lg text-gray-600 mb-2'>
                <CircleStackIcon className='h-5 w-5 text-yellow-600 mt-1 mr-1' />{" "}
                {map.price}
              </p>
              <p className='text-gray-700'>{map.description}</p>
              <div className='relative inline-flex  group'>
                <div className='absolute transitiona-all duration-1000 opacity-0 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt' />
                <button
                  onClick={() => {
                    handleBuyNow(map.name);
                  }}
                  title={`get ${map.name} now! just for ${map.price} coins`}
                  className='relative inline-flex items-center justify-center px-4 py-2 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900'
                  role='button'>
                  Get it now
                </button>
              </div>
            </div>
          ))}
        </div>
        {loading && <p>Loading...</p>}
      </div>
      {purchaseSuccessMessage && <Toast message={purchaseSuccessMessage} />}

      {showConfetti && <Confetti ref={confettiRef} />}
    </div>
  );
};

export default MapModal;
