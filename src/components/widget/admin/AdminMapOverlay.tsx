import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import FeedbackNotFound from "@/components/ui-custom/FeedbackNotFound";
import FloatingContainer from "@/components/ui-custom/FloatingContainer";
import HelperText from "@/components/ui-custom/HelperText";
import HScroll from "@/components/ui-custom/HScroll";
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
import MAPS_STYLES_OPTIONS from "@/constants/mapsStylesOptions";
import useAdminSearchAddress from "@/constants/useSearchAddress";
import useActiveMapStyle from "@/context/useActiveMapStyle";
import useMapsConfig from "@/context/useBasemap";
import useCurrentLocation from "@/context/useCurrentLocation";
import useDisplayedData from "@/context/useDisplayedData";
import useLang from "@/context/useLang";
import useMapStyle from "@/context/useMapStyle";
import useMapViewState from "@/context/useMapViewState";
import useMapsZoom from "@/context/useMapZoom";
import { useThemeConfig } from "@/context/useThemeConfig";
import useClickOutside from "@/hooks/useClickOutside";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import BASEMAP_CONFIG_LIST from "@/static/basemapConfigList";
import DISPLAYED_DATA_LIST from "@/static/displayedDataList";
import pluck from "@/utils/pluck";
import {
  Box,
  Center,
  chakra,
  Circle,
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
  IconMapCog,
  IconMapPin,
  IconMapPinCog,
  IconMinus,
  IconNavigationFilled,
  IconPlus,
  IconSearch,
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

const SearchAddress = () => {
  // Utils
  const iss = useIsSmScreenWidth();

  // Context
  const { l } = useLang();
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
      maxW={iss ? "" : "300px"}
      zIndex={4}
      pointerEvents={"auto"}
    >
      <OverlayItemContainer
        id="search-trigger"
        w={searchMode ? (iss ? "calc(100vw - 18px)" : "300px") : "50px"}
        flexDir={"row"}
        overflow={"clip"}
        transition={"200ms"}
      >
        <Tooltip content={`${l.search} ${l.address.toLowerCase()}`}>
          <BButton
            unclicky
            iconButton
            variant="ghost"
            onClick={() => {
              toggleSearchMode();
            }}
          >
            <IconSearch />
          </BButton>
        </Tooltip>

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

// const DisplayedDataFilter = (props: any) => {
//   // Props
//   const {
//     // active,
//     item,
//     disabled,
//     totalFilterCount,
//     setTotalFilterCount,
//   } = props;

//   // Contexts
//   const { l } = useLang();

//   // States, Refs
//   const [prevFilterCount, setPrevFilterCount] = useState<number>(0);
//   const [filterCount] = useState<number>(0);
//   const filterComponent = {
//     kk: (
//       <>
//         {/* member_count */}
//         {/* rt */}
//         {/* rw */}
//         {/* economic_status */}
//       </>
//     ),
//     facility: <>{/* facility_type */}</>,
//     infrastructure: <>{/* infrastructure_type */}</>,
//     environtment: (
//       <>
//         {/* economic_status */}
//         {/* economic_status */}
//       </>
//     ),
//     village_asset: <></>,
//     land_field: <></>,
//   };

//   // Utils
//   const { open, onOpen, onClose } = useDisclosure();
//   useBackOnClose(
//     `displayed-data-filter-${pluck(l, item.key)}`,
//     open,
//     onOpen,
//     onClose
//   );

//   // Handle set total filter count on filter count update
//   useEffect(() => {
//     setTotalFilterCount(totalFilterCount - prevFilterCount + filterCount);
//     setPrevFilterCount(filterCount);
//   }, [filterCount]);

//   return (
//     <>
//       <BButton
//         iconButton
//         variant={"ghost"}
//         onClick={onOpen}
//         disabled={disabled}
//       >
//         {filterCount > 0 && <FloatCounter>{filterCount}</FloatCounter>}
//         <IconAdjustmentsHorizontal stroke={1.5} />
//       </BButton>

//       <DisclosureRoot open={open} lazyLoad size={"xs"}>
//         <DisclosureContent>
//           <DisclosureHeader>
//             <DisclosureHeaderContent title={`Filter ${pluck(l, item.key)}`} />
//           </DisclosureHeader>

//           <DisclosureBody>
//             {filterComponent[item.key as keyof typeof filterComponent]}
//           </DisclosureBody>

//           <DisclosureFooter>
//             <BackButton />
//           </DisclosureFooter>
//         </DisclosureContent>
//       </DisclosureRoot>
//     </>
//   );
// };
// const DisplayedData = () => {
//   // Contexts
//   const { themeConfig } = useThemeConfig();
//   const { displayedData, setDisplayedData } = useDisplayedData();
//   const { l } = useLang();

//   // States, Refs
//   const [totalFilterCount, setTotalFilterCount] = useState<number>(0);

//   // Utils
//   const { open, onToggle, onClose } = useDisclosure();
//   const triggerRef = useRef(null);
//   const contentRef = useRef(null);
//   useClickOutside([triggerRef, contentRef], onClose);

//   return (
//     <PopoverRoot open={open}>
//       <PopoverTrigger asChild>
//         <OverlayItemContainer>
//           <Tooltip content={l.displayed_data}>
//             <BButton
//               ref={triggerRef}
//               iconButton
//               unclicky
//               variant={"ghost"}
//               w={"fit"}
//               onClick={onToggle}
//             >
//               {totalFilterCount > 0 && (
//                 <FloatCounter>{totalFilterCount}</FloatCounter>
//               )}

//               <IconMapPinCog stroke={1.5} />
//             </BButton>
//           </Tooltip>
//         </OverlayItemContainer>
//       </PopoverTrigger>

//       <Portal>
//         <PopoverPositioner>
//           <PopoverContent
//             ref={contentRef}
//             p={1}
//             mr={"2px"}
//             w={"270px"}
//             pointerEvents={"auto"}
//           >
//             <MenuHeaderContainer>
//               <HStack>
//                 <IconMapPinCog stroke={1.5} size={20} />
//                 <Text fontWeight={"bold"}>{l.displayed_data}</Text>
//               </HStack>
//             </MenuHeaderContainer>

//             <CContainer pt={1}>
//               {DISPLAYED_DATA_LIST.map((item, i) => {
//                 const active = displayedData[item.key];

//                 const toggleActive = () => {
//                   const newState = {
//                     ...displayedData,
//                     [item.key]: !displayedData[item.key],
//                   };
//                   setDisplayedData(newState);
//                 };

//                 return (
//                   <HStack key={i} w={"full"} gap={"2px"}>
//                     <Box onClick={onClose}>
//                       <DisplayedDataFilter
//                         active={active}
//                         item={item}
//                         disabled={item.disabled}
//                         totalFilterCount={totalFilterCount}
//                         setTotalFilterCount={setTotalFilterCount}
//                       />
//                     </Box>

//                     <BButton
//                       unclicky
//                       flex={1}
//                       justifyContent={"space-between"}
//                       px={2}
//                       onClick={toggleActive}
//                       variant={"ghost"}
//                       size={"md"}
//                       disabled={item.disabled}
//                     >
//                       {pluck(l, item.key)}

//                       <Switch
//                         checked={active}
//                         pointerEvents={"none"}
//                         colorPalette={themeConfig.colorPalette}
//                       />
//                     </BButton>
//                   </HStack>
//                 );
//               })}
//             </CContainer>
//           </PopoverContent>
//         </PopoverPositioner>
//       </Portal>
//     </PopoverRoot>
//   );
// };

const Basemap = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();
  const { basemap, setBasemap } = useMapsConfig();
  const { activeMapStyle, setActiveMapStyle } = useActiveMapStyle();
  const { mapStyle } = useMapStyle();

  // Utils
  const { open, onToggle, onClose } = useDisclosure();
  const triggerRef = useRef(null);
  const contentRef = useRef(null);
  async function basemapSetter(
    layerType: keyof typeof basemap,
    visible: boolean
  ) {
    const layerMapping: Record<string, string[]> = {
      road: [
        "road_service_case",
        "road_minor_case",
        "road_pri_case_ramp",
        "road-pri-case-ramp",
        "road_trunk_case_ramp",
        "road_mot_case_ramp",
        "road_sec_case_noramp",
        "road_pri_case_noramp",
        "road_trunk_case_noramp",
        "road_mot_case_noramp",
        "road_path",
        "road_service_fill",
        "road_minor_fill",
        "road_pri_fill_ramp",
        "road_trunk_fill_ramp",
        "road_mot_fill_ramp",
        "road_sec_fill_noramp",
        "road_pri_fill_noramp",
        "road_trunk_fill_noramp",
        "road_mot_fill_noramp",
        "roadname_minor",
        "roadname_sec",
        "roadname_pri",
        "roadname_major",
      ],
      water: ["water", "water-shadow", "waterway"],
      building: [
        // "building",
        "building-top",
        "building-extrusion",
        "building-outline",
      ],
    };
    const updatedLayers = activeMapStyle.layers.map((layer: any) =>
      layerMapping[layerType as keyof typeof layerMapping]?.includes(layer.id)
        ? {
            ...layer,
            layout: {
              ...layer.layout,
              visibility: visible ? "visible" : "none",
            },
          }
        : layer
    );
    setActiveMapStyle({ ...activeMapStyle, layers: updatedLayers });
    setBasemap({ ...basemap, [layerType]: visible });
  }
  useClickOutside([triggerRef, contentRef], onClose);

  return (
    <PopoverRoot open={open}>
      <PopoverTrigger asChild>
        <OverlayItemContainer>
          <Tooltip content={l.basemap}>
            <BButton
              ref={triggerRef}
              iconButton
              unclicky
              variant={"ghost"}
              w={"fit"}
              onClick={onToggle}
              disabled={mapStyle.id === 2}
            >
              <IconMapCog stroke={1.5} />
            </BButton>
          </Tooltip>
        </OverlayItemContainer>
      </PopoverTrigger>

      <Portal>
        <PopoverPositioner>
          <PopoverContent
            ref={contentRef}
            p={1}
            mr={"2px"}
            w={"200px"}
            pointerEvents={"auto"}
          >
            <MenuHeaderContainer>
              <HStack>
                <IconMapCog stroke={1.5} size={20} />
                <Text fontWeight={"bold"}>{l.basemap}</Text>
              </HStack>
            </MenuHeaderContainer>

            <CContainer pt={1}>
              {BASEMAP_CONFIG_LIST.map((item, i) => {
                const active = basemap[item.key];

                const toggleItem = () => {
                  basemapSetter(item.key, !basemap[item.key]);
                };

                return (
                  <BButton
                    key={i}
                    unclicky
                    justifyContent={"space-between"}
                    px={2}
                    onClick={toggleItem}
                    variant={"ghost"}
                    size={"md"}
                    cursor={"pointer"}
                    disabled={item.disabled}
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
          </PopoverContent>
        </PopoverPositioner>
      </Portal>
    </PopoverRoot>
  );
};

const LayoutMenu = () => {
  return (
    <OverlayItemContainer>
      <TheLayoutMenu
        pointerEvents={"auto"}
        popoverContentProps={{
          mt: 1,
          mr: "2px",
        }}
      />
    </OverlayItemContainer>
  );
};

const Legend = () => {
  // Contexts
  const { l } = useLang();
  const { displayedData } = useDisplayedData();

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
          <MenuHeaderContainer borderless>
            <HStack h={"20px"}>
              <IconFlag stroke={1.5} size={20} />
              <Text fontWeight={"bold"}>{l.legend}</Text>

              <BButton
                iconButton
                unclicky
                size={"xs"}
                borderRadius={"full"}
                variant={"ghost"}
                ml={"auto"}
                mr={-1}
                mt={"-2px"}
                onClick={onClose}
              >
                <Icon>
                  <IconX />
                </Icon>
              </BButton>
            </HStack>
          </MenuHeaderContainer>

          <CContainer p={2} mt={1}>
            <HStack wrap={"wrap"} gapX={4} px={"2px"} mb={4}>
              {DISPLAYED_DATA_LIST.map((item) => {
                return displayedData[item.key]
                  ? item.color.map((color: any, ii: number) => {
                      return (
                        <HStack key={ii}>
                          <Circle w={"10px"} h={"10px"} bg={color.color} />
                          <Text>{pluck(l, color.labelKey)}</Text>
                        </HStack>
                      );
                    })
                  : "";
              })}
            </HStack>

            <HelperText>
              {l.legend_helper}
              <chakra.span>
                <Icon mx={1}>
                  <IconMapPinCog size={18} stroke={1.5} />
                </Icon>
                {l.displayed_data}
              </chakra.span>
            </HelperText>
          </CContainer>
        </FloatingContainer>
      </Portal>

      <OverlayItemContainer>
        <Tooltip content={l.legend}>
          <BButton iconButton unclicky variant={"ghost"} onClick={onToggle}>
            <IconFlag stroke={1.5} />
          </BButton>
        </Tooltip>
      </OverlayItemContainer>
    </CContainer>
  );
};

const MapStyle = () => {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const { colorMode } = useColorMode();
  const { mapStyle, setMapStyle } = useMapStyle();

  // Utils
  const { open, onToggle, onClose } = useDisclosure();
  const triggerRef = useRef(null);
  const contentRef = useRef(null);
  useClickOutside([triggerRef, contentRef], onClose);

  return (
    <PopoverRoot open={open} positioning={{ placement: "top" }}>
      <PopoverTrigger asChild>
        <OverlayItemContainer>
          <Tooltip content={l.map_type}>
            <Center
              ref={triggerRef}
              w={"40px"}
              aspectRatio={1}
              onClick={onToggle}
            >
              <Image
                src={mapStyle.img[colorMode as keyof typeof mapStyle.img]}
                w={"36px"}
                borderRadius={"lg"}
                cursor={"pointer"}
                _hover={{ opacity: 0.6 }}
                transition={"200ms"}
              />
            </Center>
          </Tooltip>
        </OverlayItemContainer>
      </PopoverTrigger>

      <Portal>
        <PopoverPositioner>
          <PopoverContent
            ref={contentRef}
            p={1}
            w={"200px"}
            pointerEvents={"auto"}
          >
            <MenuHeaderContainer>
              <Text fontWeight={"bold"}>{l.map_type}</Text>
            </MenuHeaderContainer>

            <CContainer p={1} pt={2}>
              <HStack>
                {MAPS_STYLES_OPTIONS.map((item, i) => {
                  const active = mapStyle.id === item.id;

                  return (
                    <CContainer
                      key={i}
                      gap={2}
                      cursor={!item.disabled ? "pointer" : "disabled"}
                      onClick={
                        !item.disabled
                          ? () => {
                              setMapStyle(item);
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
                          borderRadius={"md"}
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
          </PopoverContent>
        </PopoverPositioner>
      </Portal>
    </PopoverRoot>
  );
};

const ZoomControl = () => {
  const { mapZoomPercent, setMapZoomPercent } = useMapsZoom();

  return (
    <OverlayItemContainer>
      <Group>
        <Tooltip content={"Zoom out"}>
          <BButton
            iconButton
            unclicky
            variant={"ghost"}
            onClick={() => {
              if (mapZoomPercent > 10) {
                setMapZoomPercent(mapZoomPercent - 10);
              } else {
                setMapZoomPercent(0);
              }
            }}
          >
            <Icon>
              <IconMinus />
            </Icon>
          </BButton>
        </Tooltip>

        <HStack gap={0} justify={"center"}>
          <NumberInput
            integer
            minW={"30px"}
            maxW={"30px"}
            border={"none"}
            px={0}
            onChangeSetter={(input) => {
              setMapZoomPercent(input);
            }}
            inputValue={mapZoomPercent}
            textAlign={"center"}
            max={100}
            fontWeight={"semibold"}
          />
          <Text>%</Text>
        </HStack>

        <Tooltip content={"Zoom in"}>
          <BButton
            iconButton
            unclicky
            variant={"ghost"}
            onClick={() => {
              if (mapZoomPercent < 90) {
                setMapZoomPercent(mapZoomPercent + 10);
              } else {
                setMapZoomPercent(100);
              }
            }}
          >
            <Icon>
              <IconPlus />
            </Icon>
          </BButton>
        </Tooltip>
      </Group>
    </OverlayItemContainer>
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
      const tembalang = { lon: 110.43914667, lat: -7.05959528 };
      setLoading(true);
      setCurrentLocation({
        lat: tembalang.lat,
        lon: tembalang.lon,
      });
      setLoading(false);
      // getLocation()
      //   .then((loc) => {
      //     setCurrentLocation({
      //       lat: loc.coords.latitude,
      //       lon: loc.coords.longitude,
      //     });
      //   })
      //   .catch((e) => {
      //     console.log(e);
      //   })
      //   .finally(() => {
      //     setLoading(false);
      //   });
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
            <IconCurrentLocation stroke={1.5} />
          )}
        </BButton>
      </Tooltip>
    </OverlayItemContainer>
  );
};

const Compass = () => {
  // Context
  const { l } = useLang();
  const { mapRef } = useMapViewState();

  // States, Refs
  const [bearing, setBearing] = useState(0);

  // Utils
  const handleReset = () => {
    if (mapRef?.current) {
      const map = mapRef.current.getMap();
      map.easeTo({
        bearing: 0,
        pitch: 0,
        duration: 300,
      });
    }
  };

  // Handle bearing rotation
  useEffect(() => {
    if (!mapRef?.current) return;

    const map = mapRef.current.getMap();
    const handleMove = () => {
      setBearing(map.getBearing());
    };

    map.on("move", handleMove);

    return () => {
      map.off("move", handleMove);
    };
  }, [mapRef?.current]);

  return (
    <OverlayItemContainer>
      <HStack gap={1}>
        <Tooltip content={`${l.angle_to_north}`}>
          <CContainer h={"40px"} justify={"center"}>
            <Text
              w={"38px"}
              ml={2}
              textAlign={"center"}
              fontWeight={"semibold"}
            >
              {Math.round(bearing)}°
            </Text>
          </CContainer>
        </Tooltip>

        <Tooltip content={`Reset ${l.angle_to_north.toLowerCase()}`}>
          <BButton iconButton unclicky onClick={handleReset} variant={"ghost"}>
            <Center
              transform={`rotate(${bearing * -1}deg)`}
              position={"relative"}
            >
              <Icon color={"red.500"}>
                <IconNavigationFilled />
              </Icon>
            </Center>
          </BButton>
        </Tooltip>
      </HStack>
    </OverlayItemContainer>
  );
};

const AdminMapOverlay = () => {
  return (
    <CContainer
      id="map_overlay"
      w={"calc(100% - 2px)"}
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
          <HStack align={"start"} w={"fit"} h={"fit"} zIndex={2}>
            <SearchAddress />
          </HStack>

          <HStack position={"absolute"} right={0}>
            {/* <DisplayedData /> */}

            <Basemap />

            <LayoutMenu />
          </HStack>
        </HStack>
      </Box>

      <Box p={2} pr={0}>
        <HStack
          align={"start"}
          justify={"space-between"}
          position={"relative"}
          h={"calc(40px + 8px)"}
        >
          <HStack align={"start"} w={"full"} zIndex={2}>
            <Legend />
          </HStack>

          <HScroll
            position={"absolute"}
            w={"fit"}
            maxW={"calc(100% - 50px - 8px)"}
            right={0}
            pr={2}
          >
            <MapStyle />

            <ZoomControl />

            <CurrentLocation />

            <Compass />
          </HScroll>
        </HStack>
      </Box>
    </CContainer>
  );
};

export default AdminMapOverlay;
