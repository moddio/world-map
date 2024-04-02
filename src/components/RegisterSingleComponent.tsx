import React, { useEffect, useState } from "react";
import {
  faApple,
  faDiscord,
  faFacebook,
  faGoogle,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useTranslation } from "react-i18next";
// import { generateUsername } from "unique-username-generator";

// import { trackEventFromBrowser } from '@/lib/mixpanelBrowser';
import { useApp } from "../contexts/AppContext";
import Button from "./core/ui/Button";
import Checkbox from "./core/ui/Checkbox";
import { siteUrl } from "../config";
// import { siteUrl } from './../config';

export default function RegisterSingleComponent({}) {
  const [username, setUsername] = useState("");
  const [state, setState] = useState({
    checked: false,
    isUsernameValid: false,
    error: false,
    message: "",
  });

  //@ts-ignore
  // const {  setShowAuth, setShowRegister } = useApp();

  const [tos, setTos] = useState(false);
  const [updates, setUpdates] = useState(false);

  const spanLinkClass = "text-blue-600 font-semibold cursor-pointer";

  function checkUsername() {
    // Configure Axios instance with CORS headers
    const instance = axios.create({
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:5000', // Update with your frontend URL
        'Content-Type': 'application/json',
      },
    });
  
    // Make the API request
    instance.get(`${siteUrl}/api/v1/check-username/?username=${username}`)
      .then((res) => {
        if (res.data.status === "success") {
          setState({
            ...state,
            error: false,
            //@ts-ignore
            pos: 1,
            checked: true,
            isUsernameValid: true,
          });
        } else {
          setState({
            ...state,
            checked: true,
            isUsernameValid: false,
            error: true,
            message: res.data.message,
          });
        }
      })
      .catch((error) => {
        // Handle error
        console.error('Error fetching data:', error);
      });
  }

  const { t } = useTranslation("login");

  const [showEditUsername, setShowEditUsername] = useState(false);

  useEffect(() => {
    setUsername('test');
    setShowEditUsername(true);
  }, []);

  const authProviders = [
    {
      name: 'Google',
      slug: "google",
      icon: faGoogle,
    },
    {
      name: 'Discord',
      slug: "discord",
      icon: faDiscord,
    },
    {
      name: 'Twitter',
      slug: "twitter",
      icon: faTwitter,
    },
    {
      name: 'Facebook',
      slug: "facebook",
      icon: faFacebook,
    },
    {
      name: "Apple",
      slug: "apple",
      icon: faApple,
    },
  ];

  var referer = `?referer=${encodeURIComponent("/create")}`;
  useEffect(() => {
    if (state.checked) {
      setState({
        checked: false,
        isUsernameValid: false,
        error: false,
        //@ts-ignore
        pos: 1,
        message: "",
      });
    }

    // wait if user is not typing for 2 seconds and check username
    const timeoutId = setTimeout(() => {
      if (username.length > 0) {
        checkUsername();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [username]);

  const register = (link) => {
    if (!state.checked) {
      //   trackEventFromBrowser('Signup Error', {
      //     error: 'username not entered',
      //   });

      setState(() => {
        return {
          ...state,
          error: true,
          isUsernameValid: false,
          pos: 1,
          message: "Please choose a username",
        };
      });
      return;
    }

    if (state.checked && !state.isUsernameValid) {
      return;
    }

    if (!tos) {
      //   trackEventFromBrowser('Signup Error', {
      //     error: 'tos not agreed',
      //   });

      setState(() => {
        return {
          ...state,
          error: true,
          pos: 2,
          message:
            "Agree to the Terms of Service and Privacy Policy to continue.",
        };
      });
      return;
    }

    if (state.checked && username.length < 4) {
      //   trackEventFromBrowser('Signup Error', {
      //     error: 'username too short',
      //   });

      setState(() => {
        return {
          ...state,
          error: true,
          isUsernameValid: false,
          pos: 1,
          message: "Username must be at least 3 characters long",
        };
      });
      return;
    }

    // remove the cookie if it exists
    document.cookie = `username=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    document.cookie = `tos=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    document.cookie = `updates=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;

    // add a cookie to the user's browser for username, tos and updates
    document.cookie = `username=${username}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
    document.cookie = `tos=${tos}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
    document.cookie = `updates=${updates}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;

    // go to the link
    window.open(`${siteUrl}/link`, "auth", "width=500,height=600");

    window.addEventListener("message", (event) => {
      console.log("event.data", event);

      if (event.data.code === 200) {
        // reload page
        document.location.reload();
      } else if (event.data.code === 400) {
        setState(() => {
          return {
            ...state,
            error: true,
            pos: 1,
            message: event.data.message,
          };
        });
      }
    });
  };

  return (
    <div className='mt-8'>
      <div className=''>
        <p className='font-medium text-white md:text-lg'>
          Ready to Play and Bring your Ideas to Life?
        </p>
        <p className='text-white mb-2'>
          Sign up now to save your progress and start creating games.
        </p>
        {/*@ts-ignore*/}
        {state.error && state.pos === 1 && (
          <div className=' rounded-sm text-sm text-red-500'>
            <b>{state.message}</b>
          </div>
        )}

        <div
          className={`relative text-gray-900 mt-2 mb-2 ${
            showEditUsername ? "block" : "hidden"
          } `}>
          <input
            type='username'
            placeholder={"choose a username"}
            value={username}
            maxLength={12}
            // check if enter is pressed
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                checkUsername();
              }
            }}
            onChange={(e) => setUsername(e.target.value)}
            className={`block h-10 w-full rounded-md border-transparent
             ${
               state.checked
                 ? state.isUsernameValid
                   ? "bg-green-500"
                   : "bg-red-500"
                 : "bg-gray-100"
             }  pl-2 pr-10 text-black placeholder-gray-700
              focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
          />
          {state.checked && (
            <ArrowPathIcon
              className='absolute w-7 h-7 text-white right-0 top-1 mr-8 cursor-pointer'
              onClick={() => {
                setUsername('test');
              }}
            />
          )}
          {state.checked ? (
            state.isUsernameValid ? (
              <CheckIcon className='absolute w-7 h-7 text-white right-1 top-1' />
            ) : (
              <XMarkIcon
                className='absolute w-7 h-7 text-white right-1 top-1'
                onClick={() => {
                  setUsername("");
                }}
              />
            )
          ) : null}
        </div>
        <div className='mt-4'>
          {/*@ts-ignore*/}
          {state.error && state.pos === 2 && (
            <div className=' rounded-sm text-md animate-pulse text-red-500'>
              <b>{state.message}</b>
            </div>
          )}
          <p
            className='text-white flex flex-row mt-1 cursor-pointer'
            onClick={() => {
              setTos(!tos);
            }}>
            {
              <Checkbox
                color={
                  //@ts-ignore
                  state.error && state.pos === 2 && !tos ? "#ff0000" : "#D1D5DB"
                }
                checked={tos}
                //@ts-ignore
                pulse={state.error && state.pos === 2 && !tos}
                onClick={() => {
                  setTos(!tos);
                }}
              />
            }
            <p className='ml-2'>
              I agree to the{" "}
              <span className={spanLinkClass}>Terms of Service</span> and{" "}
              <span className={spanLinkClass}>Privacy Policy</span>
            </p>
          </p>
          <p
            className='text-white flex flex-row mt-2 cursor-pointer'
            onClick={() => {
              setUpdates(!updates);
            }}>
            {/*@ts-ignore*/}
            <Checkbox
              checked={updates}
              onClick={() => {
                setUpdates(!updates);
              }}
            />
            <p className='ml-2'>
              I would like to receive updates about new games and product news
            </p>
          </p>
        </div>
      </div>

      <div className='mt-4 w-full'>
        {/*@ts-ignore*/}
        <Button
          className={"w-full sso-signup-button"}
          color='alternate'
          key={authProviders[0].name}
          onClick={() => {
            register(`/api/v1/auth/${authProviders[0].slug}`);
          }}>
          <FontAwesomeIcon
            icon={authProviders[0].icon}
            size='lg'
            className='mr-2'
          />
          {authProviders[0].name}
        </Button>
      </div>
      <div className='mt-2.5 grid grid-cols-2 gap-3'>
        {authProviders.map((provider, index) => {
          if (index == 0) return;
          return (
            /*@ts-ignore*/
            <Button
              key={provider.name}
              color='alternate'
              onClick={() => {
                register(
                  index === 4
                    ? "/auth/apple/login"
                    : `/api/v1/auth/${provider.slug}`
                );
              }}
              className={"sso-signup-button"}>
              <FontAwesomeIcon
                icon={provider.icon}
                size='lg'
                className='mr-2'
              />
              {provider.name}
            </Button>
          );
        })}
      </div>
      <div className='flex flex-row justify-between mt-6 items-center'>
        <p
          className='text-white hover:underline cursor-pointer'
          onClick={() => {
            // setShowRegister(false);
            // setShowAuth(true);
          }}>
          already have an account? <b>Log In</b>
        </p>
      </div>
    </div>
  );
}
