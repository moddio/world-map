import React, { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
import { Dialog } from "@headlessui/react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
// import posthog from "posthog-js";
import { createPortal } from "react-dom";

// import { trackEventFromBrowser } from "@/lib/mixpanelBrowser";
import { useApp } from "../contexts/AppContext";

// const RegisterSingleComponent = dynamic(
//   () => import('./RegisterSingleComponent'),
//   {
//     ssr: false,
//   }
// );
// const RegisterComponent = dynamic(() => import('./RegisterComponent'), {
//   ssr: false,
// });
const RegisterSingleComponent = React.lazy(
  () => import("./RegisterSingleComponent")
);
const RegisterComponent = React.lazy(() => import("./RegisterComponent"));

export default function RegisterModal() {
  //@ts-ignore
  const [ showRegister, setShowRegister ] = useState(false);

  const [showSingleComponent, setShowSingleComponent] = useState(true);

  const [page, setPage] = useState(1);
  const [isUsernameValid, setIsUsernameValid] = useState(false);

  const [rendered, setIsRendered] = useState(false);

  const handleClose = () => {
    setShowRegister(false);
  };

  useEffect(() => {
    // trackEventFromBrowser('register_modal_open');
    setPage(1);
    setIsRendered(true);
  }, []);

  useEffect(() => {
    if (isUsernameValid) {
      // trackEventFromBrowser("register_modal_step_2");
    }
  }, [isUsernameValid]);

  // console.count('RegisterModal');

  return (
    typeof document !== "undefined" &&
    rendered &&
    createPortal(
      <Dialog
        onClose={()=>handleClose}
        open={true}
        className='tailwind-layout'>
        <div className='fixed z-[200000]'>
          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Dialog.Panel className='w-full max-w-xl transform overflow-hidden rounded-md border-[1px] border-white  bg-[#000] p-6 text-left align-middle'>
                <div className='flex items-center justify-between'>
                  <Dialog.Title
                    as='h3'
                    className='text-3xl flex flex-row font-medium bold leading-6 text-white'>
                    {page == 2 && (
                      <ChevronLeftIcon
                        className='h-6 w-6 mr-2 cursor-pointer'
                        onClick={() => {
                          setPage(1);
                        }}
                      />
                    )}
                    {page == 1 ? "Sign Up" : "Verify Account"}
                  </Dialog.Title>

                  {!showSingleComponent && (
                    <div className='flex flex-row'>
                      <button
                        className={`pl-2 pr-2 ${
                          page == 1
                            ? "bg-blue-600 text-white"
                            : "bg-white text-black"
                        } rounded-full `}
                        onClick={() => setPage(1)}>
                        <b>1</b>
                      </button>
                      <div className='text-blue-600 flex justify-center items-center'>
                        <div className='bg-blue-600 h-[2px] w-6'></div>
                      </div>
                      <button
                        className={`pl-2 pr-2 ${
                          page == 2
                            ? "bg-blue-600 text-white"
                            : "bg-white text-black"
                        } rounded-full`}
                        // onClick={() => isUsernameValid && setPage(2)}
                      >
                        <b>2</b>
                      </button>
                    </div>
                  )}
                </div>
                {showSingleComponent ? (
                  <RegisterSingleComponent />
                ) : (
                  <RegisterComponent
                    /*@ts-ignore*/
                    setIsUsernameValid={setIsUsernameValid}
                    handleClose={handleClose}
                    setPage={setPage}
                    page={page}
                  />
                )}
              </Dialog.Panel>
            </div>
          </div>
        </div>
      </Dialog>,
      document.body
    )
  );
}
