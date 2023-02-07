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

  const changeUser = useCallback((val) => {
    setUser(val);
  });

  const userValues = useMemo(
    () => ({
      user,
      changeUser,
    }),
    [user]
  );
  return (
    <UserContext.Provider value={userValues}>{children}</UserContext.Provider>
  );
});

export default function useUser() {
  return useContext(UserContext);
}
