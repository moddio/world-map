import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { formatDistanceStrict } from 'date-fns';

import { useUser } from './hooks';

export const fetcher = (url) => {
  return axios.get(url).then((res) => res.data);
};

export function getRandomToken(length) {
  var result = '';

  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

export function getRelativeDate(date, addSuffix = true) {
  return formatDistanceStrict(new Date(date), new Date(), {
    addSuffix: addSuffix,
  });
}

// export const coinHelper = {
//   formatInt: (x) => Math.floor(x),
//   value: (x) => currency(x).value,
//   add: (x, y) => currency(x).add(y).value,
//   subtract: (x, y) => currency(x).subtract(y).value,
//   multiply: (x, y) => currency(x).multiply(y).value,
//   divide: (x, y) => currency(x).divide(y).value,
// };

// export function getRealCoins(coins) {
//   return coinHelper.value(coins);
// }

// export function convertCoinsToUsd(coins) {
//   const usd = coinHelper.divide(
//     coinHelper.multiply(
//       coins,
//       parseInt(process.env.NEXT_PUBLIC_EXCHANGE_RATE_FOR_10K_COINS)
//     ),
//     10000
//   );
//   return isNaN(usd) ? 0.0 : usd;
// }

// export function handleDiscourseSsoLogin(user) {
//   if (!isBrowser() || window.discourseRedirecting) {
//     return;
//   }

//   if (!user || !user._id) {
//     return;
//   }

//   const url = new URL(window.location.href).searchParams;

//   const sig = url.get('sig') || getCookie('d_sig');
//   const sso = url.get('sso') || getCookie('d_sso');

//   if (!sig || !sso) {
//     return;
//   }

//   window.discourseRedirecting = true;
//   window.location.href = `${window.location.origin}/api/v1/auth/discourse?sig=${sig}&sso=${sso}`;
// }

// export function getNewTierName(name, capitalize = false) {
//   if (!name) {
//     return name;
//   }
//   let serverName = name.toString().trim();
//   serverName = serverName.startsWith('t') ? serverName : `t${serverName}`;
//   const TIER_MAPPING = {
//     t1: capitalize ? 'Basic' : 'basic',
//     t2: capitalize ? 'Legacy' : 'legacy',
//     t4: capitalize ? 'Global' : 'global',
//     t5: capitalize ? 'Advanced' : 'advanced',
//   };
//   const serverTier = serverName.split('-')[0];
//   return serverName && serverTier && TIER_MAPPING[serverTier]
//     ? serverName.replace(serverTier, TIER_MAPPING[serverTier])
//     : name;
// }

// export const detectRedirectLoop = (setShowCacheResetModal) => {
//   // a 3s timeout to give browser enough time to load page
//   setTimeout(() => {
//     fetch('/api/v1/user/', { redirect: 'error' })
//       .then((r) => {
//         setShowCacheResetModal(false);
//         const rld = getCookie('rld');
//         if (rld && rld !== 'fixed') {
//           trackEventFromBrowser('Redirect Loop Fixed');
//           setCookie('rld', 'fixed', { maxAge: 90 * 24 * 60 * 60 });
//         }
//       })
//       .catch((e) => {
//         if (e.message === 'Failed to fetch') {
//           // the request failed to fetch that means a redirect was detected which is not expected
//           let rld = getCookie('rld');

//           if (rld !== 'fixed') {
//             let rldCount = rld ? parseInt(rld) + 1 : 1;
//             if (rldCount === 5) {
//               // display alert asking to clear cache
//               setShowCacheResetModal(true);
//               trackEventFromBrowser('Redirect Loop Detected');
//               rldCount = 0;
//             }

//             setCookie('rld', rldCount, { maxAge: 90 * 24 * 60 * 60 });
//           }
//           return;
//         }

//         setShowCacheResetModal(false);
//         const rld = getCookie('rld');
//         if (rld && rld !== 'fixed') {
//           trackEventFromBrowser('Redirect Loop Fixed');
//           setCookie('rld', 'fixed', { maxAge: 90 * 24 * 60 * 60 });
//         }
//         console.log(e.message);
//       });
//   }, 2000);
// };

// export function useOutsideAlerter(ref, onClickOutside) {
//   useEffect(() => {
//     /**
//      * Alert if clicked on outside of element
//      */
//     function handleClickOutside(event) {
//       if (ref.current && !ref.current.contains(event.target)) {
//         onClickOutside();
//       }
//     }
//     // Bind the event listener
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       // Unbind the event listener on clean up
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [ref, onClickOutside]);
// }

// export const useMixpanelUserIdentify = () => {
//   const { user } = useUser();
//   const isUserIdentifiedRef = useRef(false);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       if (isUserIdentifiedRef.current) {
//         return;
//       }

//       let userId = getUserIdFromStorage();

//       if (user && user._id) {
//         userId = user._id;
//         isUserIdentifiedRef.current = true;
//       }

//       if (userId) {
//         mixpanel.identify(userId);
//         mixpanel.people.set({});
//         posthog.identify(userId);
//       }
//     }
//   }, [user]);
// };

export const getUserIdFromStorage = () => {
  if (typeof window !== 'undefined') {
    const userData = window.localStorage.getItem('userData');
    const userId = userData ? JSON.parse(userData)?._id : null;
    // console.log('userid ', userId);
    return userId;
  }
  return null;
};

// export const getCachedUserCommunities = () => {
//   if (typeof window === 'undefined') {
//     return [];
//   }
//   const userCommunities = localStorage.getItem('userCommunities');
//   if (userCommunities) {
//     return JSON.parse(userCommunities) || [];
//   }
//   return [];
// };

export function limitString(str, length = 16) {
  return str.length > length ? str.substring(0, length) + '...' : str;
}

export function useHasHydrated() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
}

export function useUserPresent() {
  const [localUserId, setLocalUserId] = useState();
  const { user, isLoading } = useUser();

  useEffect(() => {
    setLocalUserId(getUserIdFromStorage());
  }, []);

  return { isUserPresent: isLoading ? !!localUserId : !!user };
}

export const USER_INTENT_TYPES = {
  making: 0,
  playing: 1,
  dismissed: 2,
};

export const rolesTypesMap = {
  CONTRIBUTOR: 1,
  MODERATOR: 2,
  COMMUNITY_MEMBER: 3,
  LOGGED_IN_USER: 4,
  GUEST_USERS: 5,
};

export const disabledNameTypes = [
  rolesTypesMap.COMMUNITY_MEMBER,
  rolesTypesMap.LOGGED_IN_USER,
  rolesTypesMap.GUEST_USERS,
];
export const disabledAddingMembers = [
  rolesTypesMap.COMMUNITY_MEMBER,
  rolesTypesMap.LOGGED_IN_USER,
  rolesTypesMap.GUEST_USERS,
];

export const formatNumber = (num) => {
  if (!num) {
    return 0;
  }

  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
};

export const formatNumberWithCommas = (num) => {
  if (!num) {
    return 0;
  }

  return parseInt(num).toLocaleString('en-US');
};

export const getValueFromGameJsonDefaultData = (gameJson, field) => {
  if (gameJson?.data?.defaultData) {
    return gameJson?.data?.defaultData[field];
  } else {
    return null;
  }
};

export async function getImageDimensionsFromFile(file) {
  let img = new Image();
  img.src = URL.createObjectURL(file);
  await img.decode();
  let width = img.width;
  let height = img.height;
  return {
    width,
    height,
  };
}

// export function CoinWhiteIcon({ width, height, ...props }) {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width={width || '20'}
//       height={height || '20'}
//       version="1.1"
//       viewBox="0 0 109.478 109.71"
//       {...props}
//     >
//       <g transform="translate(-391.034 -133.128)">
//         <path
//           fill="#fff"
//           fillOpacity="1"
//           strokeWidth="0.265"
//           d="M443.94 133.128c-5.144.004-7.393.786-8.496 2.783-.309.56-1.238 3.339-2.065 6.175-.949 3.257-1.74 5.468-2.145 6-.747.98-3.351 2.306-4.077 2.075-.272-.086-2.2-1.18-4.286-2.433-6.52-3.914-7.863-4.354-9.991-3.268-2.98 1.52-9.643 8.003-10.781 10.488-1.092 2.386-.904 3.109 2.383 9.133 3.129 5.734 3.279 6.305 2.325 8.816-.578 1.523-.716 1.59-5.72 2.79-5.069 1.215-7.42 2.04-8.29 2.91-1.349 1.35-1.763 3.71-1.763 10.058-.001 5.805.158 6.78 1.368 8.401.878 1.176 1.437 1.423 6.724 2.974 2.534.743 4.964 1.484 5.4 1.645 1.2.443 2.19 1.485 2.911 3.062l.65 1.42-.646 1.275c-.355.702-1.501 2.683-2.546 4.404-3.775 6.212-3.926 7.095-1.762 10.33.76 1.138 2.755 3.452 4.431 5.142 4.112 4.145 6.093 5.244 8.486 4.706.59-.132 3.24-1.421 5.887-2.865 2.648-1.443 5.14-2.704 5.54-2.802 1.071-.262 4.597 1.072 4.818 1.824.092.313.692 2.617 1.334 5.12 1.347 5.257 2.022 6.984 3.077 7.871.843.71 2.754 1.183 5.92 1.467 7.047.632 11.854-.186 13.205-2.247.352-.538.943-2.34 3.037-9.261.44-1.455.955-2.858 1.145-3.117.19-.26 1.266-.871 2.39-1.36l2.044-.888 2.187 1.262c1.202.695 3.305 1.927 4.672 2.74 2.917 1.734 4.743 2.406 5.933 2.183 1.516-.285 4.214-2.313 7.758-5.833 6.032-5.991 6.13-6.683 2.013-14.221-1.478-2.706-2.764-5.223-2.857-5.595-.116-.46.106-1.35.694-2.79l.865-2.113 2.137-.545c9.618-2.454 10.675-2.876 11.5-4.592.813-1.692 1.145-4.36 1.162-9.317.02-6.231-.594-8.173-2.965-9.383-.545-.278-3.063-1.107-5.597-1.844-6.585-1.914-6.478-1.854-7.55-4.206-.492-1.08-.894-2.048-.894-2.152 0-.103 1.024-1.904 2.275-4.001 3.993-6.692 4.44-7.853 3.7-9.625-1.292-3.09-7.565-9.777-10.553-11.248-2.6-1.28-3.122-1.16-9.11 2.113-5.733 3.135-6.538 3.349-8.903 2.368-1.006-.417-1.544-.816-1.736-1.289-.154-.377-.82-2.819-1.48-5.427-1.28-5.053-1.99-6.828-3.04-7.596-1.197-.876-3.65-1.31-8.331-1.472a67.52 67.52 0 00-2.387-.045zm-9.05 28.896c.148-.005.245-.004.284.006.374.094.979.438 1.343.764s2.23 3.57 4.147 7.208c4.163 7.901 4.273 8.07 5.266 8.07.91 0 .732.272 5.145-7.906 1.836-3.403 3.57-6.512 3.854-6.91 1.084-1.523 1.233-1.525 11.564-.154 5.176.687 9.84 1.389 10.364 1.56 1.866.612 1.818-.72.871 24.61-.902 24.128-.873 23.804-2.24 25.268-.32.344-1.058.881-1.64 1.194-.993.534-1.424.57-6.926.57-5.537 0-5.91-.031-6.615-.553-1.255-.929-1.533-1.808-1.628-5.157-.101-3.56.163-4.529 2.701-9.9 1.438-3.043 1.789-4.59 1.09-4.803-.145-.045-1.514 1.717-3.042 3.914-4.811 6.919-6.893 9.524-8.316 10.404-1.292.798-1.323.803-5.157.803-5.58 0-5.67-.063-11.104-7.734a4824.904 4824.904 0 00-4.15-5.849c-.99-1.393-1.258-1.623-1.579-1.357-.212.176-.386.504-.386.729 0 .224.978 2.442 2.174 4.929l2.173 4.52.094 3.44c.086 3.179.047 3.529-.52 4.63-.396.768-.942 1.354-1.54 1.653-.79.395-1.68.46-6.085.445-6.765-.023-8.32-.508-9.483-2.96-.678-1.43-.731-2.242-1.375-20.702-.29-8.295-.64-17.468-.78-20.386-.347-7.234-.3-7.365 2.907-8.025 2.617-.538 16.369-2.24 18.59-2.322z"
//         ></path>
//       </g>
//     </svg>
//   );
// }

// export const defaultGameDetails = {
//   show: false,
//   title: 'New Game',
//   region: 'any',
//   parentGameSlug: '',
// };

// export const createGame = async ({
//   gameDetailsForm,
//   gameTitleError,
//   setCreatingGame,
//   setGameDetailsForm,
//   setError,
// }) => {
//   try {
//     let title = gameDetailsForm?.title || 'New Game';
//     let slug = gameDetailsForm?.parentGameSlug;
//     let region = gameDetailsForm?.region;

//     if (gameTitleError || !slug) {
//       return;
//     }

//     setCreatingGame(slug);
//     setGameDetailsForm(defaultGameDetails);

//     const gameData = {
//       title: title,
//       sandboxMode: 'advanced',
//       preferredRegion: region === 'any' ? '' : region,
//     };

//     const { data: res } = await axios.post(`/api/v1/games/custom`, {
//       game: gameData,
//       templateInfo: {
//         templateSlug: slug,
//       },
//     });

//     if (res.status === 'error') {
//       throw new Error(res.message || 'Error creating game');
//     }

//     const newGame = res.data;

//     if (newGame && newGame._id) {
//       const publishConfig = {
//         maxPlayers: 32,
//         release: {
//           release: newGame.releases[0].release,
//         },
//       };

//       await axios.post(`/api/v1/games/${newGame._id}/publish/`, publishConfig);

//       // TODO: Use event() from lib/gtag.js
//       if (window.gtag) {
//         window.gtag('event', 'conversion', {
//           event_label: `Game created: ${gameData.title}`,
//           transaction_id: newGame._id,
//           send_to: 'AW-628155506/Hu68CJO59IQYEPLIw6sC',
//           event_callback: () => {
//             console.log(
//               'gtag',
//               `Game created: ${gameData.title}`,
//               `/play/${newGame.gameSlug}?autojoin=true`
//             );

//             window.location.href = `/play/${newGame.gameSlug}?autojoin=true`;
//           },
//         });

//         setTimeout(() => {
//           console.log(
//             'gtag',
//             `Game created: ${gameData.title}`,
//             `/play/${newGame.gameSlug}?autojoin=true`
//           );
//           window.location.href = `/play/${newGame.gameSlug}?autojoin=true`;
//         }, 1500);
//       } else {
//         // // SENDING TO SANDBOX AFTER CREATING A NEW GAME.
//         // router.push(`/sandbox/game/${newGame.gameSlug}?firstTime=true`);
//         // UNCOMMENT IF YOU WANT TO SEND PLAY GAME AND USE LASTEST EDITOR
//         window.location.href = `/play/${newGame.gameSlug}?autojoin=true`;
//       }
//     }

//     setCreatingGame('');
//   } catch (err) {
//     console.log('create game error : ', err);
//     setCreatingGame('');

//     if (err.response?.data || err.message) {
//       setError(err.message || err.response.data?.message || err.response.data);
//       // alert(err.response.data);
//     } else {
//       console.error(err);
//     }
//   }
// };

// export const loadEditor = ({ constants, gameDetails }) => {
//   if (constants?.editorUrl?.includes(':3001')) {
//     const scriptEl = window.document.createElement('script');
//     scriptEl.src = `${constants.editorUrl}/bundle.js`;
//     scriptEl.id = 'editor-script';
//     window.document.body.appendChild(scriptEl);
//   } else {
//     fetch(`/client/${gameDetails.engineVersion}`)
//       .then((res) => {
//         return res.json();
//       })
//       .then((res) => {
//         const { styles, scripts } = res;
//         styles.forEach((style) => {
//           const linkEl = window.document.createElement('link');
//           linkEl.rel = 'stylesheet';
//           linkEl.href = `/${gameDetails.engineVersion}/static/css/` + style;
//           window.document.head.appendChild(linkEl);
//         });
//         scripts.forEach((script) => {
//           const scriptEl = window.document.createElement('script');
//           scriptEl.src = `/${gameDetails.engineVersion}/static/js/` + script;
//           window.document.body.appendChild(scriptEl);
//         });
//       })
//       .catch((err) => {
//         console.log('error loading editor data: ', err.message);
//       });
//   }

//   const gameEditor = document.getElementById('game-editor');
//   if (gameEditor) {
//     gameEditor.style.display = 'block';
//     gameEditor.style.zIndex = 1035;
//   }
//   if (document.getElementById('menu-wrapper')) {
//     document.getElementById('menu-wrapper').style.zIndex = 10;
//   }
// };
