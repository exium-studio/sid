import { ButtonProps, MenuItemProps } from "@chakra-ui/react";
import { RefObject } from "react";

export interface WMSServiceConfig {
  baseUrl: string; // "http://localhost:8080/geoserver/bpn-gis/wms"
  workspace: string; // "bpn-gis"
}

export interface WMSLayer {
  id: string;
  layerName: string; // "Update_Data_PTPNI_from_postgis"
  visible: boolean;
  opacity: number;
  style?: string;
}

export type MapRefType = RefObject<mapboxgl.Map | null>;

export type Type__LanguageOptions = "id" | "en";

export type LatLong = {
  lat: number;
  lon: number;
};

export type Type__TimeZoneObject = {
  key: string;
  label: string;
  offset: number;
  offsetMs: number;
  formattedOffset: string;
  localAbbr: string;
};

export type Type__TimeFormat = "24-hour" | "12-hour";

export type Type__DateFormat = "dmy" | "mdy" | "ymd";

export type Type__DisclosureSizes = "xs" | "sm" | "md" | "lg" | "xl";

export type Type__DateRange = {
  from: Date | string | undefined;
  to: Date | string | undefined;
};

export type Type__DateRangePresets =
  | "thisWeek"
  | "nextWeek"
  | "thisMonth"
  | "nextMonth";

export type Type__TimeRange = {
  from: string | undefined;
  to: string | undefined;
};

export type Type__TableOptions = (
  | {
      label: string;
      icon?: any;
      callback?: (dataParams: any) => void;
      confirmation?: (dataParams: any) => {
        id: string;
        title: string;
        description: string;
        confirmLabel: string;
        confirmCallback: () => void;
        confirmButtonProps?: ButtonProps;
      };
      subMenu?: any; // unused yet
      menuItemProps?: MenuItemProps;
      disabled?: (rowData: any) => boolean | boolean;
    }
  | "divider"
)[];

export type Type__DateVariant =
  | "basic"
  | "shortMonth"
  | "fullMonth"
  | "monthYear"
  | "shortMonthDay"
  | "fullMonthDay"
  | "weekdayBasic"
  | "weekdayShortMonth"
  | "weekdayFullMonth";
