import * as React from "react";
import { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import { AuthContext } from "../../contexts/AuthContext";
import ListIcon from '@mui/icons-material/List';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ToggleLanguage from "../ToggleLanguage";
import { useTranslation } from "react-i18next";

const Sidebar = () => {

  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState(() => {

    // Retrieve theme preference from local storage
    const savedTheme = localStorage.getItem("theme") ?? "light"; // Default to light mode if not found as that has our defined style
    document.documentElement.setAttribute("data-theme",savedTheme)
    return savedTheme 
  });
  // function to set the theme
  const toggleTheme = () => {
    const newMode = theme === "dark" ? "light" : "dark";
    setTheme(newMode);
    // Save theme preference to local storage
    document.documentElement.setAttribute("data-theme",newMode)
    localStorage.setItem("theme", newMode);
  };

  const [open, setOpen] = React.useState(false);
  const { user, handleLogout } = useContext(AuthContext);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  //  arrays of icons
  const usericonComponents = [
    <PersonPinIcon sx={{ fontSize: 50 }} />,
    <LogoutIcon />,
  ];
  const iconComponents = [
    <DashboardIcon />,
    <ListIcon />,
    <AddShoppingCartIcon />,
    <PaidRoundedIcon />,
    <BarChartRoundedIcon />,
  ];

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {[user.userName, "Logout"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              component={Link}
              to={
                text === user.userName
                  ? "/profile"
                  : text === "Logout"
                  ? "/loggedout"
                  : `/${text.toLowerCase()}`
              }
              onClick={
                text === "Logout"
                  ? () => {
                      handleLogout();
                    }
                  : undefined
              }
            >
              <ListItemIcon>
                {/* {usericonComponents[index % usericonComponents.length]} */}
                {text === user.userName && user.imageUrl ? (
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "40%",
                      overflow: "hidden",
                      display: "inline-block",
                      position: "relative",
                    }}
                  >
                    <img
                      src={user.imageUrl}
                      alt="Thumbnail"
                      style={{
                        padding: "20px",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                ) : text === user.userName && !user.imageUrl ? (
                  usericonComponents[0]
                ) : text === "Logout" ? (
                  usericonComponents[1]
                ) : (
                  usericonComponents[0]
                )}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />
      <List>
        {[{display: "Dashboard", t: t('dashboard')}, {display: "List of Expenses", t: t("list-of-expenses") }, {display: "Add Expense", t: t("add-expense") }, {display: "Add Source", t: t("add-source") }].map(
          (menuItem, index) => (
            <ListItem key={menuItem.display} disablePadding>
              <ListItemButton
                component={Link}
                to={
                  menuItem.display === "Dashboard"
                    ? "/dashboard"
                    : menuItem.display === "List of Expenses"
                    ? "/my-expenses"
                    : menuItem.display === "Add Expense"
                    ? "/expenses"
                    : menuItem.display === "Add Source"
                    ? "/sources"
                    : menuItem.display === "Report"
                    ? "/report"
                    : `/${menuItem.display.toLowerCase()}`
                }
              >
                <ListItemIcon>
                  {iconComponents[index % iconComponents.length]}
                </ListItemIcon>
                <ListItemText primary={menuItem.t} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>
        <MenuIcon />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
      
        
          {DrawerList}
        
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'var(--expense-secondary)',
              borderRadius: 1,
              p: 3,
              mt: 'auto',
            }}
          >
          
          <button onClick={toggleTheme} type="button" className="button-small outline secondary" >
            <span style={{color: "#bbb"}}>{theme} mode</span> {theme === 'light' ? <Brightness7Icon /> : <Brightness4Icon />}
          </button>
          <ToggleLanguage style="toggle" />
        </Box>

        
      </Drawer>
    </div>
  );
};

export default Sidebar;