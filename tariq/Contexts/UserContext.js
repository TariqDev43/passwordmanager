import React from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import { useMemo } from 'react';
import { memo } from 'react';
import { createContext } from 'react';
import { useContext } from 'react';

import {
  getUserData,
  getAllCategories,
  getCategoryByName,
  getAllFav,
} from '../services/firebaseService';

const UserContext = createContext({});

export const UserProvider = memo(({ children }) => {
  /* *************  States  **************** */
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [allCategories, setAllCategories] = useState(null);
  const [allCategoryInfo, setAllCategoryInfo] = useState(null);
  const [allFav, setAllFav] = useState(null);
  const [uid, setUid] = useState(null);

  const changeUser = useCallback((val) => {
    val && setUid(val.uid);
    setUser(val);
    console.log('changeUser');
  });
  const getUserInfo = useCallback(async () => {
    try {
      const userData = await getUserData(uid);
      setUserInfo(userData.data());
      return 'success';
    } catch (err) {
      throw err;
    }
  });
  const refreshAllCategories = useCallback(async () => {
    try {
      const data = await getAllCategories(uid);
      setAllCategories(data);
      console.log('categories');
      return data;
    } catch (err) {
      console.log(err.message);
    }
  });
  const refreshAllCategoryInfo = useCallback(async () => {
    const categgories = await refreshAllCategories();
    const allCategoryInfoList = await categgories.reduce(async (promisedValue, item) => {
      const newItem = await promisedValue;
      const { category } = item;

      newItem[category] = await getCategoryByName(uid, category);
      return newItem;
    }, {});
    console.log(allCategoryInfoList);
    setAllCategoryInfo(allCategoryInfoList);
    return allCategoryInfoList;
  }, [allCategoryInfo]);
  const refreshAllFav = useCallback(async () => {
    try {
      const data = await getAllFav(uid);
      setAllFav(data);
      console.log('favasdfsa');
    } catch (err) {
      console.log(err.message);
    }
  });

  const userValues = useMemo(() => ({
    user,
    uid,
    userInfo,
    allCategories,
    allCategoryInfo,
    allFav,

    changeUser,
    getUserInfo,
    refreshAllCategories,
    refreshAllCategoryInfo,
    refreshAllFav,
  }));
  return <UserContext.Provider value={userValues}>{children}</UserContext.Provider>;
});

export default function useUser() {
  return useContext(UserContext);
}
