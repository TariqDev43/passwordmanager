import Main from "./tariq/Main.js";
import { ThemeProvider } from "./tariq/Contexts/ThemeContext.js";
import { SettingProvider } from "./tariq/Contexts/SettingContext.js";

export default function App() {
  return (
    <>
      <ThemeProvider>
        <SettingProvider>
          <Main />
        </SettingProvider>
      </ThemeProvider>
    </>
  );
}
