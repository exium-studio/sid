import AdministrationPage from "@/pages/admin/AdministrationPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import RootPage from "@/pages/RootPage";
import ServicePage from "@/pages/admin/ServicePage";
import SettingsPage from "@/pages/SettingsPage";
import DisplaySettingsPage from "@/pages/_settings/DisplaySettingsPage";
import PermissionsSettingsPage from "@/pages/_settings/PermissionsSettingsPage";
import PrivacyPolictPage from "@/pages/_settings/PrivacyPolictPage";
import RegionalSettingsPage from "@/pages/_settings/RegionalSettingsPage";
import ReportProblemPage from "@/pages/_settings/ReportProblemPage";
import TermsOfServicePage from "@/pages/_settings/TermsOfServicePage";
import { Interface__PrivateRoute, Interface__Route } from "./interfaces";
import ProfilePage from "@/pages/admin/ProfilePage";

export const ROUTES: Interface__Route[] = [
  {
    path: "/",
    activePath: "/",
    element: <RootPage />,
  },
];

export const PRIVATE_ROUTES: Interface__PrivateRoute[] = [
  {
    path: "/dashboard",
    activePath: "/dashboard",
    titleKey: "navs.dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/administration",
    activePath: "/administration",
    titleKey: "navs.administration",
    element: <AdministrationPage />,
  },
  {
    path: "/services",
    activePath: "/services",
    titleKey: "navs.services",
    element: <ServicePage />,
  },
];

export const PRIVATE_ROUTES_NO_MAPS: Interface__PrivateRoute[] = [
  {
    path: "/profile",
    activePath: "/profile",
    titleKey: "navs.profile",
    element: <ProfilePage />,
  },

  // Settings
  {
    path: "/settings",
    activePath: "/settings",
    titleKey: "navs.settings",
    element: <SettingsPage />,
  },
  {
    path: "/settings/display",
    activePath: "/settings",
    titleKey: "settings_navs.display",
    backPath: "/settings",
    element: <DisplaySettingsPage />,
  },
  {
    path: "/settings/regional",
    activePath: "/settings",
    titleKey: "settings_navs.regional",
    backPath: "/settings",
    element: <RegionalSettingsPage />,
  },
  {
    path: "/settings/permissions",
    activePath: "/settings",
    titleKey: "settings_navs.permissions",
    backPath: "/settings",
    element: <PermissionsSettingsPage />,
  },
  {
    path: "/settings/report-problem",
    activePath: "/settings",
    titleKey: "settings_navs.report_problem",
    backPath: "/settings",
    element: <ReportProblemPage />,
  },
  {
    path: "/settings/terms-of-service",
    activePath: "/settings",
    titleKey: "settings_navs.terms_of_service",
    backPath: "/settings",
    element: <TermsOfServicePage />,
  },
  {
    path: "/settings/privacy-policy",
    activePath: "/settings",
    titleKey: "settings_navs.privacy_policy",
    backPath: "/settings",
    element: <PrivacyPolictPage />,
  },
];
