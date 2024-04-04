import { useEffect, useState } from "react";
import {
  faApple,
  faDiscord,
  faFacebook,
  faGoogle,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ArrowDownIcon,
  ChevronDoubleRightIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  LockClosedIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { EnvelopeIcon, LockOpenIcon } from "@heroicons/react/24/solid";
import axios from "axios";
// import { deleteCookie } from "cookies-next";
// import { useTranslation } from "react-i18next";
import { useSWRConfig } from "swr";

// import { trackEventFromBrowser } from '@/lib/mixpanelBrowser';
// import { useApp } from "@/contexts/AppContext";
import { isBrowser } from "./core/generic/is-browser";
import Button from "./core/ui/Button";
//@ts-ignore
import { useNavigate } from "react-router-dom";
import { siteUrl } from "../config";

export default function Login({ handleClose, referer }) {
  const history = useNavigate();
  const { mutate } = useSWRConfig();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formLogin, setFormLogin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // const isCreatePage = history.pathname.includes("/create");

  const authProviders = [
    {
      name: "Google",
      slug: "google",
      icon: faGoogle,
    },
    {
      name: "Discord",
      slug: "discord",
      icon: faDiscord,
    },
    {
      name: "Twitter",
      slug: "twitter",
      icon: faTwitter,
    },
    {
      name: "Facebook",
      slug: "facebook",
      icon: faFacebook,
    },
    {
      name: "Apple",
      slug: "apple",
      icon: faApple,
    },
  ];

  // referer = referer
  //   ? `?referer=${encodeURIComponent(referer)}`
  //   : isCreatePage
  //   ? `?referer=${encodeURIComponent("/create")}`
  //   : "";

  referer = ''

  //   const { setShowAuth, setShowRegister } = useApp();

  const [authStore, setAuthStore] = useState(undefined);

  useEffect(() => {
    setAuthStore(parseInt(localStorage.getItem("authProvider")));

    if (isBrowser()) {
      const url = new URL(window.location.href).searchParams;
      const err = url.get("error");
      if (err) {
        setError(err);
      }

      // delete cookie on page reload or navigation
      //   deleteCookie("authReVerificationInitiated");
    }
  }, []);

  //   useEffect(() => {
  //     if (error) {
  //       trackEventFromBrowser('Login Error', {
  //         error: error,
  //       });
  //     }
  //   }, [error]);

  const showForgotPassword = () => {
    handleClose && handleClose();
    history("/forgot-password");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please fill out all the required fields.");
      return;
    }

    try {
      const { data: result } = await axios.post(`${siteUrl}/api/v1/login/`, {
        username,
        password,
      });

      if (result.status === "error") {
        throw new Error(result.message || "Error");
      }
      console.log(126, result.data);
      const user = result.data;
      if (result && result.data) {
        // navigate("/");
        window.location.reload()
      }
      localStorage.setItem("user", JSON.stringify(user));
      console.log(127, `${siteUrl}/api/v1/user/`);
      mutate(`${siteUrl}/api/v1/user/`, user);

      // if in play page, reload page
      //   if (router.pathname.includes('/play') && !window.preventPlayAuthReload) {
      //     router.reload();
      //   }

      //   if (window.preventPlayAuthReload) {
      //     window.preventPlayAuthReload = false;
      //   }
    } catch (err) {
      setError("Incorrect username or password.");
    }
  };

  return (
    <div className='tailwind-layout mt-4 '>
      <div className='mb-6'>
        <p className='font-medium text-white md:text-lg'>
          log in to your account using one of these providers:
        </p>
        <div className='mt-4 w-full'>
          {
            // check if localstorage has item.name
            authStore ? (
              //@ts-ignore
              <Button
                className={"w-full"}
                key={authProviders[authStore].name}
                color='primary'
                onClick={() => {
                  window.open(
                    authStore === 4
                      ? "/auth/apple/login"
                      : `/api/v1/auth/${authProviders[authStore].slug}${referer}`,
                    "auth",
                    "width=500,height=600"
                  );

                  window.addEventListener("message", (event) => {
                    console.log("event.data", event);
                    if (event.data.code === 200) {
                      // reload page
                      document.location.reload();
                    } else if (event.data.code === 400) {
                      setError(event.data.message);
                    }
                  });
                }}>
                <FontAwesomeIcon
                  icon={authProviders[authStore].icon}
                  size='lg'
                  className='mr-2'
                />
                {authProviders[authStore].name}
              </Button>
            ) : (
              //@ts-ignore
              <Button
                className={"w-full"}
                key={authProviders[0].name}
                onClick={() => {
                  // add localstorage for item.name
                  //@ts-ignore
                  localStorage.setItem("authProvider", 0);

                  window.open(
                    `/api/v1/auth/${authProviders[0].slug}${referer}`,
                    "auth",
                    "width=500,height=600"
                  );

                  window.addEventListener("message", (event) => {
                    console.log("event.data", event);

                    if (event.data.code === 200) {
                      localStorage.setItem('user', event.data)
                      // reload page
                      document.location.reload();
                    } else if (event.data.code === 400) {
                      setError(event.data.message);
                    }
                  });
                }}
                color='primary'>
                <FontAwesomeIcon
                  icon={authProviders[0].icon}
                  size='lg'
                  className='mr-2'
                />
                {authProviders[0].name}
              </Button>
            )
          }
        </div>
        <div className='mt-3 grid grid-cols-4 gap-3'>
          {authProviders.map((provider, index) => {
            if (index == authStore) return;
            if (index == 0 && !authStore) return;
            return (
              //@ts-ignore
              <Button
                key={provider.name}
                onClick={() => {
                  // add localstorage for item.name
                  //@ts-ignore
                  localStorage.setItem("authProvider", index);

                  // open link in pop up window
                  window.open(
                    index === 4
                      ? "/auth/apple/login"
                      : `/api/v1/auth/${provider.slug}${referer}`,
                    "auth",
                    "width=500,height=600"
                  );

                  window.addEventListener("message", (event) => {
                    console.log("event.data", event);

                    if (event.data.code === 200) {
                      // reload page
                      document.location.reload();
                    } else if (event.data.code === 400) {
                      setError(event.data.message);
                    }
                  });

                  // open link in current window
                }}
                color='alternate'>
                <FontAwesomeIcon icon={provider.icon} size='xl' />
              </Button>
            );
          })}
        </div>
      </div>
      <div>
        <>
          {error && (
            <div className='mt-2 rounded-md bg-red-600 px-4 py-2.5 text-sm text-white'>
              {error}
            </div>
          )}{" "}
          <p className=' text-white md:text-lg'>
            log in using username and password{" "}
            <ChevronDownIcon className='w-5 h-5 inline-block' />
          </p>
          <form onSubmit={handleSubmit} className='mt-4'>
            <div className='mb-4 space-y-3'>
              <div className='relative'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <EnvelopeIcon
                    //@ts-ignore
                    soli
                    className='h-5 w-5 text-gray-700'
                    aria-hidden='true'
                  />
                </div>
                <input
                  type='text'
                  placeholder={"Username"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className='block w-full py-2 rounded-sm border-transparent bg-gray-100 pl-10 text-gray-900 placeholder-gray-700 focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                  required
                />
              </div>
              <div className='relative flex flex-row'>
                <div className='w-[90%] pr-2'>
                  <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                    <LockClosedIcon
                      className='h-5 w-5 text-gray-700'
                      aria-hidden='true'
                    />
                  </div>
                  <input
                    type='password'
                    placeholder={"Password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='block w-full py-2 rounded-sm border-transparent bg-gray-100 pl-10 text-gray-900 placeholder-gray-700 focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                    required
                  />
                </div>
                {/*@ts-ignore*/}
                <Button type='submit' className={"w-[10%]"}>
                  <ChevronDoubleRightIcon className=' fixed w-6 h-6 text-white' />
                </Button>
              </div>
            </div>
          </form>
          <div>
            <a href='/forgot-password'>
              <h2 className='text-white text-sm -mt-2 text-right mb-4'>
                Forgot your password?
              </h2>
            </a>
          </div>
        </>
        <div className='flex items-center justify-between'>
          <button
            type='button'
            onClick={() => {
              //   setShowRegister(true);
              //   setShowAuth(false);
            }}
            className='text-sm font-medium text-white hover:underline focus:underline focus:outline-none flex flex-row'>
            <div>Not registered yet?</div>
            <b>&nbsp; Create an account</b>
            <ChevronRightIcon className='w-5 h-5 text-white' />
          </button>
        </div>
      </div>
    </div>
  );
}
