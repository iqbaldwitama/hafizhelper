interface DrawerItemIterface {
  icon_name: string;
  label: string;
  navigate_to: string;
  color: string;
  additionalBehaviour?: () => void;
  handleLogout?: () => void;
}

export { DrawerItemIterface };
