import { ChakraProvider } from "@chakra-ui/react";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState } from "react";
import { BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import { useColorMode } from "./components/ui/color-mode";
import { toaster, Toaster } from "./components/ui/toaster";
import OfflineDisclosure from "./components/widget/OfflineDisclosure";
import useADM from "./context/useADM";
import useLang from "./context/useLang";
import useOffline from "./context/useOffilne";
import { useThemeConfig } from "./context/useThemeConfig";
import useScrollEffect from "./hooks/useScrollEffect";
import Routing from "./routes/Routing";
import theme from "./theme";
import useStatusBarColor from "./utils/statusBarColor";

const EndpointWrapper = ({ children }: { children: React.ReactNode }) => {
  // Contexts
  const { themeConfig } = useThemeConfig();

  // Utils
  const location = useLocation();
  const navigate = useNavigate();
  const setStatusBarPrimary = useStatusBarColor(
    themeConfig.primaryColorHex,
    themeConfig.primaryColorHex
  );
  const setStatusBarBody = useStatusBarColor("#ffffff", "#101010");
  const setStatusBarDark = useStatusBarColor("#101010", "#101010");

  // Handle notif bar color
  useEffect(() => {
    // Dapatkan endpoint dari lokasi saat ini
    const endpoint = location.pathname;
    switch (endpoint) {
      default:
        setStatusBarBody();
        break;
      case "beranda":
        setStatusBarPrimary();
        break;
      case "employee/foto":
        setStatusBarDark();
        break;
    }
  }, [location, setStatusBarBody, setStatusBarDark]);

  // Handle on refresh remove all query params
  useEffect(() => {
    if (location.search) {
      navigate(location.pathname, { replace: true });
    }
  }, []);

  return <>{children}</>;
};

function App() {
  // Contexts
  const { l } = useLang();
  const { setOffline } = useOffline();
  const { ADM } = useADM();
  const { setColorMode } = useColorMode();

  // States, Refs
  const [firstRender, setFirstRender] = useState<boolean>(true);

  // Utils
  function handleOnline() {
    setOffline(false);
    if (!firstRender) {
      toaster.success({
        title: l.back_online_toast.title,
        description: l.back_online_toast.description,
        action: {
          label: "Close",
          onClick: () => {},
        },
      });
    }
  }
  function handleOffline() {
    setOffline(true);
  }
  function updateDarkMode() {
    const hour = new Date().getHours();
    setColorMode(hour >= 18 || hour < 6 ? "dark" : "light");
  }

  // Handle scroll style
  useScrollEffect();

  // Handle offline online
  useEffect(() => {
    // Tambahkan event listener
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [firstRender]);

  // Hide online toast when first render
  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
    }
  }, [firstRender]);

  // Handle adaptive dark mode (ADM)
  useEffect(() => {
    if (ADM === "true") {
      const interval = setInterval(() => {
        const hour = new Date().getHours();
        if (hour === 6 || hour === 18) {
          updateDarkMode();
        }
      }, 60 * 1000);

      return () => clearInterval(interval);
    }
  }, []);
  useEffect(() => {
    console.log("ADM", ADM);
    if (ADM === "true") {
      updateDarkMode();
    }
  }, [ADM]);

  return (
    <ChakraProvider value={theme}>
      <Toaster />
      <BrowserRouter>
        <OfflineDisclosure />

        <EndpointWrapper>
          <Routing />
        </EndpointWrapper>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
