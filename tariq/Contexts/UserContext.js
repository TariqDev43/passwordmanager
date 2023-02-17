import React from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import { useMemo } from 'react';
import { memo } from 'react';
import { createContext } from 'react';
import { useContext } from 'react';

import { getAllCategories, getFavs, getUserInfo } from '../services/firebaseService';

const UserContext = createContext({});

export const UserProvider = memo(({ children }) => {
  /* *************  States  **************** */
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [allCategory, setAllCategory] = useState(null);
  const [allFav, setAllFav] = useState(null);
  const [userName, setUserName] = useState(null);

  const changeUser = useCallback((val) => {
    val && setUserName(val.displayName);
    setUser(val);
    console.log('changeUser');
  });

  const fetchUserInfo = useCallback(async (userName) => {
    if (userName) {
      try {
        const userData = await getUserInfo(userName);
        setUserInfo(userData);
        console.log('user info ran');
        return 'success';
      } catch (err) {
        throw err;
      }
    } else {
      console.log('no username');
    }
  }, []);

  const fetchAllCategory = useCallback(async (userName) => {
    const allCategoriesData = await getAllCategories(userName);
    console.log('user Categories');
    setAllCategory(null);
    setAllCategory(allCategoriesData);
    return allCategoriesData;
  }, []);

  const fetchAllFav = useCallback(async (userName) => {
    const allFav = await getFavs(userName);
    console.log('user Favs');
    setAllFav(null);
    setAllFav(allFav);
    return allFav;
  }, []);

  const userValues = useMemo(() => ({
    user,
    userName,
    changeUser,
    userInfo,
    allCategory,
    allFav,
    fetchUserInfo,
    fetchAllCategory,
    fetchAllFav,
  }));
  return <UserContext.Provider value={userValues}>{children}</UserContext.Provider>;
});

export default function useUser() {
  return useContext(UserContext);
}
