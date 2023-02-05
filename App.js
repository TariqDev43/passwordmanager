import Main from "./tariq/Main.js";
import { ThemeProvider } from "./tariq/Contexts/ThemeContext.js";
import { UserProvider } from "./tariq/Contexts/UserContext";
import { SettingProvider } from "./tariq/Contexts/SettingContext.js";

export default function App() {
  return (
    <>
      <ThemeProvider>
        <UserProvider>
          <SettingProvider>
            <Main />
          </SettingProvider>
        </UserProvider>
      </ThemeProvider>
    </>
  );
}
