import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import FeedbackNotFound from "@/components/ui-custom/FeedbackNotFound";
import FloatingContainer from "@/components/ui-custom/FloatingContainer";
import HelperText from "@/components/ui-custom/HelperText";
import NumberInput from "@/components/ui-custom/NumberInput";
import SearchInput from "@/components/ui-custom/SearchInput";
import { useColorMode } from "@/components/ui/color-mode";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Tooltip } from "@/components/ui/tooltip";
import { Interface__Gens } from "@/constants/interfaces";
import MAP_STYLES from "@/constants/mapStyles";
import useAdminSearchAddress from "@/constants/useSearchAddress";
import useCurrentLocation from "@/context/useCurrentLocation";
import useDisplayedData from "@/context/useDisplayedData";
import useLang from "@/context/useLang";
import useLayout from "@/context/useLayout";
import useMapStyle from "@/context/useMapsStyle";
import useMapsZoom from "@/context/useMapsZoom";
import { useThemeConfig } from "@/context/useThemeConfig";
import useClickOutside from "@/hooks/useClickOutside";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import DISPLAYED_DATA_LIST from "@/static/displayedDataList";
import getLocation from "@/utils/getLocation";
import pluck from "@/utils/pluck";
import {
  Box,
  Center,
  Group,
  HStack,
  Icon,
  Image,
  PopoverPositioner,
  Portal,
  Spinner,
  Stack,
  StackProps,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconClock,
  IconCurrentLocation,
  IconCurrentLocationFilled,
  IconFlag,
  IconMapPin,
  IconMapPin2,
  IconMinus,
  IconPlus,
  IconSearch,
  IconStack,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import TheLayoutMenu from "../LayoutMenu";
import MenuHeaderContainer from "../MenuHeaderContainer";
import useSearchMode from "./useSearchMode";

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface OverlayItemContainerProps extends StackProps {
  children?: any;
}
const OverlayItemContainer = ({
  children,
  ...props
}: OverlayItemContainerProps) => {
  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <Stack
      p={1}
      w={"fit"}
      bg={"body"}
      border={"1px solid"}
      borderColor={"border.muted"}
      borderRadius={themeConfig.radii.container}
      pointerEvents={"auto"}
      transition={"100ms"}
      gap={0}
      {...props}
    >
      {children}
    </Stack>
  );
};

const LayoutMenu = () => {
  return (
    <OverlayItemContainer>
      <TheLayoutMenu
        pointerEvents={"auto"}
        popoverContentProps={{
          mt: 1,
        }}
      />
    </OverlayItemContainer>
  );
};

const SearchAddress = () => {
  // Utils
  const iss = useIsSmScreenWidth();

  // Context
  const {
    searchAddress,
    setSearchAddress,
    searchResult,
    setSearchResult,
    setSelectedSearchResult,
  } = useAdminSearchAddress();
  const { searchMode, setSearchMode, toggleSearchMode } = useSearchMode();

  // States, Refs
  const [searchInputFocus, setSearchInputFocus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const searchAddressHistory = JSON.parse(
    localStorage.getItem("search_address_history") as string
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const showSearchResult =
    (searchAddress || searchAddressHistory) && searchInputFocus;

  // Handle click outside
  useClickOutside([containerRef, contentRef], () => {
    setSearchInputFocus(false);
    if (!searchAddress) {
      setSearchMode(false);
    }
  });

  // Handle search
  useEffect(() => {
    if (searchMode && searchRef.current) {
      searchRef.current.focus();
    } else {
      setSearchInputFocus(false);
    }
  }, [searchMode]);
  useEffect(() => {
    if (searchAddress) {
      setLoading(true);
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchAddress
        )}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.features && data.features.length > 0) {
            setSearchResult(data.features);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      if (!searchMode) {
        setSelectedSearchResult("");
      }
      setSearchResult([]);
    }
  }, [searchMode, searchAddress, setSearchResult]);

  // Components
  const SearchResultItem = ({ result, historyItem = false }: any) => {
    function handleItemClick() {
      setSelectedSearchResult(result);
      setSearchAddress(result.place_name);

      if (!historyItem) {
        const updatedHistory = [
          result,
          ...(Array.isArray(searchAddressHistory)
            ? searchAddressHistory
            : []
          ).filter((item: any) => item.place_name !== result.place_name),
        ].slice(0, 5);

        localStorage.setItem(
          "search_address_history",
          JSON.stringify(updatedHistory)
        );
      }

      setSearchInputFocus(false);
    }

    return (
      <BButton
        unclicky
        variant={"ghost"}
        px={2}
        justifyContent={"start"}
        onClick={() => handleItemClick()}
        color={historyItem ? "fg.muted" : ""}
      >
        <Icon mb={"1px"}>
          {historyItem ? (
            <IconClock size={"1rem"} />
          ) : (
            <IconMapPin size={"1rem"} />
          )}
        </Icon>
        <Text truncate>{result.place_name}</Text>
      </BButton>
    );
  };

  return (
    <CContainer
      fRef={containerRef}
      gap={2}
      maxW={iss ? "full" : "300px"}
      zIndex={4}
      pointerEvents={"auto"}
    >
      <OverlayItemContainer
        id="search-trigger"
        w={searchMode ? "" : "50px"}
        flexDir={"row"}
        overflow={"clip"}
      >
        <BButton
          iconButton
          variant="ghost"
          onClick={() => {
            toggleSearchMode();
          }}
        >
          <IconSearch />
        </BButton>

        <SearchInput
          inputRef={searchRef}
          onChangeSetter={(input) => {
            setSearchAddress(input);
          }}
          inputValue={searchAddress}
          noIcon
          inputProps={{
            pl: 1,
            border: "none",
            onFocus: () => setSearchInputFocus(true),
          }}
        />
      </OverlayItemContainer>

      <PopoverRoot
        open={showSearchResult}
        positioning={{ sameWidth: true }}
        initialFocusEl={() => searchRef.current}
      >
        <PopoverTrigger asChild>
          <div></div>
        </PopoverTrigger>

        <Portal>
          <PopoverPositioner>
            <PopoverContent
              ref={contentRef}
              w={"auto"}
              p={1}
              mt={-2}
              pointerEvents={"auto"}
            >
              {/* Render loading */}
              {loading && (
                <Center p={4}>
                  <Spinner size={"sm"} />
                </Center>
              )}

              {/* Render result */}
              {!loading && (
                <>
                  {searchAddress && (
                    <>
                      {/* Render Not Found */}
                      {searchResult.length === 0 && (
                        <CContainer p={5}>
                          <FeedbackNotFound />
                        </CContainer>
                      )}

                      {/* Render Search Result */}
                      {searchResult?.length > 0 &&
                        searchResult.map((result: any, i: number) => (
                          <SearchResultItem key={i} result={result} />
                        ))}
                    </>
                  )}

                  {/* Render History */}
                  {!searchAddress && (
                    <>
                      {searchAddressHistory &&
                        searchAddressHistory.map((history: any, i: number) => (
                          <SearchResultItem
                            key={i}
                            result={history}
                            historyItem
                          />
                        ))}
                    </>
                  )}
                </>
              )}
            </PopoverContent>
          </PopoverPositioner>
        </Portal>
      </PopoverRoot>
    </CContainer>
  );
};

const DataDisplayed = ({ popoverContentProps, ...props }: any) => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { displayedData, setDisplayedData } = useDisplayedData();
  const { l } = useLang();

  // Utils
  const contentRef = useRef(null);

  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <OverlayItemContainer>
          <BButton iconButton unclicky variant={"ghost"} w={"fit"} {...props}>
            <IconMapPin2 stroke={1.5} />
          </BButton>
        </OverlayItemContainer>
      </PopoverTrigger>

      <Portal>
        <PopoverPositioner>
          <PopoverContent
            ref={contentRef}
            p={1}
            w={"250px"}
            pointerEvents={"auto"}
            {...popoverContentProps}
          >
            <MenuHeaderContainer>
              <Text fontWeight={"bold"}>{l.displayed_data}</Text>
            </MenuHeaderContainer>

            <CContainer pt={1}>
              {DISPLAYED_DATA_LIST.map((item, i) => {
                const active = displayedData.some(
                  (data) => data.id === item.id
                );

                const toggleItem = (item: Interface__Gens) => {
                  let newDisplayedData: Interface__Gens[];

                  if (displayedData.some((data) => data.id === item.id)) {
                    newDisplayedData = displayedData.filter(
                      (data) => data.id !== item.id
                    );
                  } else {
                    newDisplayedData = [...displayedData, item];
                  }

                  setDisplayedData(newDisplayedData);
                };

                return (
                  <BButton
                    key={i}
                    unclicky
                    justifyContent={"space-between"}
                    px={2}
                    onClick={() => toggleItem(item)}
                    variant={"ghost"}
                    size={"md"}
                    cursor={"pointer"}
                  >
                    {pluck(l, item.key)}

                    <Switch
                      checked={active}
                      pointerEvents={"none"}
                      colorPalette={themeConfig.colorPalette}
                    />
                  </BButton>
                );
              })}
            </CContainer>

            {/* <CContainer px={2} pb={1} pt={2}>
              <HelperText lineHeight={1.4}>{l.layout_menu_helper}</HelperText>
            </CContainer> */}
          </PopoverContent>
        </PopoverPositioner>
      </Portal>
    </PopoverRoot>
  );
};

const Legends = () => {
  // Contexts
  const { l } = useLang();

  // States, Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Utils
  const { open, onToggle, onClose } = useDisclosure();
  const iss = useIsSmScreenWidth();

  return (
    <CContainer w={"fit"} fRef={containerRef} zIndex={1} position={"relative"}>
      <Portal container={containerRef}>
        <FloatingContainer
          open={open}
          containerProps={{
            position: "absolute",
            left: "0",
            bottom: "58px",
            pointerEvents: "auto",
            w: iss ? "calc(100vw - 16px)" : "300px",
            p: 1,
          }}
          animationEntrance="bottom"
        >
          <HStack px={2} pb={1} justify={"space-between"}>
            <Text fontWeight={"bold"}>{l.legend}</Text>

            <BButton
              iconButton
              size={"xs"}
              borderRadius={"full"}
              variant={"ghost"}
              mr={-2}
              onClick={onClose}
            >
              <Icon>
                <IconX />
              </Icon>
            </BButton>
          </HStack>

          <CContainer p={2}>
            <HelperText>
              {l.legend_helper}{" "}
              <Icon>
                <IconMapPin2 size={20} stroke={1.5} />
              </Icon>
            </HelperText>
          </CContainer>
        </FloatingContainer>
      </Portal>

      <OverlayItemContainer>
        <BButton iconButton variant={"ghost"} onClick={onToggle}>
          <Icon>
            <IconFlag />
          </Icon>
        </BButton>
      </OverlayItemContainer>
    </CContainer>
  );
};

const CurrentLocation = () => {
  // Contexts
  const { l } = useLang();
  const { currentLocation, setCurrentLocation } = useCurrentLocation();
  const { themeConfig } = useThemeConfig();

  // States, Refs
  const [loading, setLoading] = useState<boolean>(false);

  // Utils
  function handleOnClick() {
    if (currentLocation) {
      setCurrentLocation(undefined);
    } else {
      setLoading(true);
      getLocation()
        .then((loc) => {
          setCurrentLocation({
            lat: loc.coords.latitude,
            lon: loc.coords.longitude,
          });
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  return (
    <OverlayItemContainer>
      <Tooltip content={l.current_location}>
        <BButton
          iconButton
          unclicky
          variant={"ghost"}
          onClick={handleOnClick}
          loading={loading}
        >
          {currentLocation ? (
            <IconCurrentLocationFilled color={themeConfig.primaryColorHex} />
          ) : (
            <IconCurrentLocation />
          )}
        </BButton>
      </Tooltip>
    </OverlayItemContainer>
  );
};

const ZoomControl = () => {
  const { zoomPercent, setZoomPercent } = useMapsZoom();

  return (
    <OverlayItemContainer>
      <Group>
        <BButton
          iconButton
          variant={"ghost"}
          onClick={() => {
            if (zoomPercent > 10) {
              setZoomPercent(zoomPercent - 10);
            } else {
              setZoomPercent(0);
            }
          }}
        >
          <Icon>
            <IconMinus />
          </Icon>
        </BButton>

        <HStack gap={0} justify={"center"}>
          <NumberInput
            integer
            minW={"30px"}
            maxW={"30px"}
            border={"none"}
            px={0}
            onChangeSetter={(input) => {
              setZoomPercent(input);
            }}
            inputValue={zoomPercent}
            textAlign={"center"}
            max={100}
            fontWeight={"semibold"}
          />
          <Text>%</Text>
        </HStack>

        <BButton
          iconButton
          variant={"ghost"}
          onClick={() => {
            if (zoomPercent < 90) {
              setZoomPercent(zoomPercent + 10);
            } else {
              setZoomPercent(100);
            }
          }}
        >
          <Icon>
            <IconPlus />
          </Icon>
        </BButton>
      </Group>
    </OverlayItemContainer>
  );
};

const MapStyle = ({ ...props }: any) => {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const { colorMode } = useColorMode();
  const { mapsStyle, setMapsStyle } = useMapStyle();

  return (
    <PopoverRoot positioning={{ placement: "top" }}>
      <PopoverTrigger asChild>
        <OverlayItemContainer>
          <BButton iconButton unclicky variant={"ghost"} w={"fit"} {...props}>
            <IconStack stroke={1.5} />
          </BButton>
        </OverlayItemContainer>
      </PopoverTrigger>

      <Portal>
        <PopoverPositioner>
          <PopoverContent p={1} w={"200px"} pointerEvents={"auto"}>
            <MenuHeaderContainer>
              <Text fontWeight={"bold"}>{l.map_type}</Text>
            </MenuHeaderContainer>

            <CContainer p={1} pt={2}>
              <HStack>
                {MAP_STYLES.map((item, i) => {
                  const active = mapsStyle.id === item.id;

                  return (
                    <CContainer
                      key={i}
                      gap={2}
                      cursor={!item.disabled ? "pointer" : "disabled"}
                      onClick={
                        !item.disabled
                          ? () => {
                              setMapsStyle(item);
                            }
                          : () => {}
                      }
                      opacity={item.disabled ? 0.6 : 1}
                    >
                      <Box
                        p={active ? 1 : 0}
                        border={active ? "1px solid" : ""}
                        borderColor={active ? themeConfig.primaryColor : ""}
                        borderRadius={themeConfig.radii.component}
                        aspectRatio={1}
                      >
                        <Image
                          src={item.img[colorMode as keyof typeof item.img]}
                          borderRadius={themeConfig.radii.component}
                          aspectRatio={1}
                          w={"full"}
                        />
                      </Box>
                      <Text
                        textAlign={"center"}
                        color={active ? themeConfig.primaryColor : ""}
                      >
                        {item.label}
                      </Text>
                    </CContainer>
                  );
                })}
              </HStack>
            </CContainer>

            {/* <CContainer px={2} pb={1} pt={2}>
              <HelperText lineHeight={1.4}>{l.layout_menu_helper}</HelperText>
            </CContainer> */}
          </PopoverContent>
        </PopoverPositioner>
      </Portal>
    </PopoverRoot>
  );
};

const AdminMapsOverlay = () => {
  // Contexts
  const { layout } = useLayout();

  return (
    <CContainer
      id="map_overlay"
      w={"full"}
      h={"calc(100% - 4px)"}
      pointerEvents={"none"}
      justify={"space-between"}
      zIndex={1}
      position={"absolute"}
      top={0}
    >
      <Box p={2}>
        <HStack
          align={"start"}
          justify={"space-between"}
          position={"relative"}
          h={"calc(40px + 8px)"}
        >
          <HStack align={"start"} w={"full"} zIndex={2}>
            <SearchAddress />
          </HStack>

          <HStack position={"absolute"} right={0}>
            <DataDisplayed />

            {layout.id === 3 && <LayoutMenu />}
          </HStack>
        </HStack>
      </Box>

      <Box p={2}>
        <HStack
          align={"start"}
          justify={"space-between"}
          position={"relative"}
          h={"calc(40px + 8px)"}
        >
          <HStack align={"start"} w={"full"} zIndex={2}>
            <Legends />
          </HStack>

          <HStack position={"absolute"} right={0}>
            <CurrentLocation />

            <ZoomControl />

            <MapStyle />

            <DataDisplayed />
          </HStack>
        </HStack>
      </Box>
    </CContainer>
  );
};

export default AdminMapsOverlay;
