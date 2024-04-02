import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';

import { useApp } from '../contexts/AppContext';

const Login =  React.lazy(() => import("./Login"));
export default function Auth() {
  //@ts-ignore
  const [ showAuth, setShowAuth ]= useState(true);
console.log(13, showAuth)
  const [rendered, setIsRendered] = useState(false);

  useEffect(() => {
    setIsRendered(true);
  }, []);

  const handleClose = () => {
    setShowAuth(false);
  };

  // console.count('Auth');

  return (
    typeof document !== 'undefined' &&
    rendered &&
    createPortal(
      <Dialog onClose={handleClose} open={showAuth} className="tailwind-layout">
        <div className="fixed z-[200000]">
          <div className="fixed inset-0 bg-opacity-25 " />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Dialog.Panel className="w-full rounded-md max-w-xl transform overflow-hidden border-[1px] border-white  bg-[#000] p-6 text-left align-middle shadow-xl">
                <div className="flex items-center justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-3xl font-medium leading-6 bold text-white"
                  >
                    Log In
                  </Dialog.Title>
                  <button type="button" onClick={handleClose}>
                    <XMarkIcon
                      className="h-5 w-5 text-gray-500 hover:text-gray-400"
                      aria-hidden="true"
                    />
                  </button>
                </div>
                {/*@ts-ignore */}
                <Login handleClose={handleClose} />
              </Dialog.Panel>
            </div>
          </div>
        </div>
      </Dialog>,
      document.body
    )
  );
}
