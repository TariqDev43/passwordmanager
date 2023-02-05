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
  const [userStatus, setUserStatus] = useState(false);

  const changeUserStatus = useCallback(() => {
    setUserStatus(!userStatus);
  });

  const userValues = useMemo(
    () => ({
      userStatus,
      changeUserStatus,
    }),
    [userStatus]
  );
  return (
    <UserContext.Provider value={userValues}>{children}</UserContext.Provider>
  );
});

export default function useUser() {
  return useContext(UserContext);
}
