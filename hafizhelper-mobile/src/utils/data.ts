import ScreenName from "./ScreenName";

const defaultColor = "#0F543F";

const sideBarMenus = [
  {
    icon_name: "home",
    label: "Beranda",
    navigate_to: ScreenName.SURAH_LIST_PAGE,
    color: defaultColor,
  },

  {
    icon_name: "account",
    label: "Profil",
    navigate_to: "Profil",
    color: defaultColor,
  },

  {
    icon_name: "bookmark",
    label: "Penanda Bacaan",
    navigate_to: "Penanda Bacaan",
    color: defaultColor,
  },

  {
    icon_name: "history",
    label: "Riwayat Bacaan",
    navigate_to: "Riwayat Bacaan",
    color: defaultColor,
  },
];

const logInMenu = {
  icon_name: "login",
  label: "Login",
  navigate_to: ScreenName.LOGIN_PAGE,
  color: defaultColor,
};

const logOutMenu = {
  icon_name: "logout",
  label: "Log Out",
  navigate_to: ScreenName.LOGIN_PAGE,
  color: defaultColor,
};

export { sideBarMenus, logInMenu, logOutMenu };
