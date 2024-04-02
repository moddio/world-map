import { createContext, useContext, useEffect, useState } from 'react';
// import { defaultFeedbackData } from '@/constant';

import { useUser } from '../lib/hooks';
// import { trackEventFromBrowser } from '@/lib/mixpanelBrowser';
//@ts-ignore
const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const { user } = useUser();
  const [showAuth, setShowAuth] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [feedbackData, setFeedbackData] = useState();

  const value = {
    showAuth,
    setShowAuth,
    showRegister,
    setShowRegister,
    feedbackData,
    setFeedbackData,
  };

  function setCookie(name, value, daysToExpire) {
    var expires = '';
    if (daysToExpire) {
      var date = new Date();
      date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
  }

  // Example usage:

  useEffect(() => {
    if (user) {
      setShowAuth(false);
      setShowRegister(false);
    }
  }, [user]);

  useEffect(() => {
    if (showAuth) {
    //   trackEventFromBrowser('login_modal_open');
      // add redirect cookie and dont expire
      setCookie('openlink', window.location.pathname, 1);
    } else {
      // trackEventFromBrowser('login_modal_close');
    }

    if (showRegister) {
    //   trackEventFromBrowser('register_modal_open');
      // add redirect cookie
      setCookie('openlink', window.location.pathname, 1);
    } else {
      // trackEventFromBrowser('register_modal_close');
    }
  }, [showAuth, showRegister]);

  console.count('AppProvider');

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
