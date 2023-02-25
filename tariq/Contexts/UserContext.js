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
  const [allCategory, setAllCategory] = useState([]);
  const [allFav, setAllFav] = useState(null);
  const [userName, setUserName] = useState(null);

  const changeUser = useCallback((val) => {
    val && setUserName(val.displayName);
    setUser(val);
  });

  const fetchUserInfo = useCallback(async (userName) => {
    if (userName) {
      try {
        const userData = await getUserInfo(userName);
        setUserInfo(userData);
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
    // console.log(allCategoriesData);
    setAllCategory(allCategoriesData);
    return allCategoriesData;
  }, []);

  const updateAllCategories = useCallback((index, val) => {
    try {
      let newArray = allCategory;
      newArray[index].items = val;
      setAllCategory(newArray);
    } catch (err) {
      throw err;
    }
  });

  const addNewCategory = useCallback((val) => {
    setAllCategory(val);
  }, []);

  const fetchAllFav = useCallback(async (userName) => {
    const allFav = await getFavs(userName);
    console.log('user Favs');
    // console.log(allFav);
    setAllFav(allFav);
    return allFav;
  }, []);

  const updateAllFav = (method, val) => {
    try {
      if (method == 'add') {
        setAllFav([...allFav, val]);
      } else {
        setAllFav(allFav.filter((item) => item.id !== val.id));
      }
    } catch (err) {
      throw err;
    }
  };

  const userValues = useMemo(() => ({
    user,
    userName,
    changeUser,
    userInfo,
    allCategory,
    allFav,
    updateAllCategories,
    addNewCategory,
    updateAllFav,
    fetchUserInfo,
    fetchAllCategory,
    fetchAllFav,
  }));
  return <UserContext.Provider value={userValues}>{children}</UserContext.Provider>;
});

export default function useUser() {
  return useContext(UserContext);
}
