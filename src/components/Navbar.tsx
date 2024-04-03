import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../lib/hooks";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon, CurrencyDollarIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import { CircleStackIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(()=>{
    if(userDetails){
      navigate('/');
    }
  },[])
  return (
    <nav className='bg-[#b7f7bb] flex justify-between items-center focus:outline-none p-4 border-black border-l border-r border-b relative'>
    <div className='text-white'></div>
    <div>
      {userDetails ? (
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button
                className='flex focus:outline-none bg-[#b7f7bb] mb-1 text-white py-1 rounded mr-2'>
                <div className='flex items-center'>
                  <CircleStackIcon className='h-5 w-5 text-gray-600 mr-1' />
                  <span className='text-gray-600 font-bold mr-3'>
                    {userDetails.coins}
                  </span>
                  {userDetails.local.profilePicture ? (
                    <img
                      src={userDetails.local.profilePicture}
                      alt={userDetails.local.username}
                      width='40'
                      height='40'
                      className='rounded w-[40px] h-[40px] object-contain'
                    />
                  ) : (
                    <div className='flex items-center'>
                      <div className='w-[30px] h-[30px] mt-1 flex items-center justify-center rounded-full bg-blue-200 text-blue-600'>
                        <UserCircleIcon className='h-4 w-4' />
                      </div>
                      <span className='ml-1 text-xl text-gray-600 font-bold'>
                        {userDetails.local.username}
                      </span>
                    </div>
                  )}
                </div>
              </Disclosure.Button>
              <Disclosure.Panel className='flex justify-end bg-[#6eef7b] absolute mt-1 mr-7 right-0'>
                <div className='space-y-1 px-2'>
                  <button
                    onClick={() => {
                      localStorage.removeItem("user");
                      navigate("/");
                    }}
                    className='flex justify-end rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-primary-50 hover:text-primary-800'>
                    Logout
                  </button>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ) : (
        <>
          <div className='w-fit rounded-xl'>
            <button
              onClick={() => {
                navigate("login");
              }}
              className='px-4 py-2 rounded-l-xl text-white m-0 bg-green-600 hover:bg-green-700 transition'>
              Login
            </button>
            <button
              onClick={() => {
                navigate("signup");
              }}
              className='px-4 py-2 text-white rounded-r-xl bg-green-800 hover:bg-green-900 transition'>
              Register
            </button>
          </div>
        </>
      )}
    </div>
  </nav>
  
  );
};

export default Navbar;
