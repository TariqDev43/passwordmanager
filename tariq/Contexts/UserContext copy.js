import React from "react";
import { useState } from "react";
import { useCallback } from "react";
import { useMemo } from "react";
import { memo } from "react";
import { createContext } from "react";
import { useContext } from "react";

const UserContext = createContext({});

export const UserProvider = memo(({ children }) => {
  /* *************  States  **************** */
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [allCategories, setAllCategories] = useState(null);
  const [allCategoryInfo, setAllCategoryInfo] = useState(null);
  const [allFav, setAllFav] = useState(null);

  const changeUser = useCallback((val) => {
    setUser(val);
  });
  const changeUserInfo = useCallback((val) => {
    setUserInfo(val);
  });
  const changeAllCategories = useCallback((val) => {
    setAllCategories(val);
  });
  const changeAllCategoryInfo = useCallback((val) => {
    setAllCategoryInfo(val);
  });
  const changeAllFav = useCallback((val) => {
    setAllFav(val);
  });

  const userValues = useMemo(
    () => ({
      user,
      userInfo,
      allCategories,
      allCategoryInfo,
      allFav,
      changeUser,
      changeUserInfo,
      changeAllCategories,
      changeAllCategoryInfo,
      changeAllFav,
    }),
    [user, userInfo, allCategories, allCategoryInfo, allFav]
  );
  return (
    <UserContext.Provider value={userValues}>{children}</UserContext.Provider>
  );
});

export default function useUser() {
  return useContext(UserContext);
}
