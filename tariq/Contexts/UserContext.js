import React from "react";
import { useState } from "react";
import { useCallback } from "react";
import { useMemo } from "react";
import { memo } from "react";
import { createContext } from "react";
import { useContext } from "react";

import { getAllCategories, getUserInfo } from "../services/firebaseService";

const UserContext = createContext({});

export const UserProvider = memo(({ children }) => {
  /* *************  States  **************** */
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [allCategory, setAllCategory] = useState(null);
  // const [allFav, setAllFav] = useState(null);
  const [userName, setUserName] = useState(null);

  const changeUser = useCallback((val) => {
    val && setUserName(val.displayName);
    setUser(val);
    console.log("changeUser");
  });

  const fetchUserInfo = useCallback(async (userName) => {
    if (userName) {
      try {
        const userData = await getUserInfo(userName);
        setUserInfo(userData);
        console.log("user info ran");
        return "success";
      } catch (err) {
        throw err;
      }
    } else {
      console.log("no username");
    }
  }, []);

  const fetchAllCategory = useCallback(async (userName) => {
    const allCategories = await getAllCategories(userName);
    console.log("user Categories");
    setAllCategory(null);
    setAllCategory(allCategories);
    return allCategories;
  }, []);

  // const refreshAllFav = useCallback(async () => {
  //   try {
  //     const data = await getAllFav(uid);
  //     setAllFav(data);
  //   } catch (err) {
  //     console.log(err.message);
  //   }
  // });

  const userValues = useMemo(() => ({
    user,
    userName,
    changeUser,
    userInfo,
    allCategory,
    fetchUserInfo,
    fetchAllCategory,
  }));
  return (
    <UserContext.Provider value={userValues}>{children}</UserContext.Provider>
  );
});

export default function useUser() {
  return useContext(UserContext);
}
