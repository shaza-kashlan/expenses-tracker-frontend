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
// import Switch from '@mui/material/Switch';

const Sidebar = () => {


  const [isDarkMode, setIsDarkMode] = useState(() => {

    // Retrieve theme preference from local storage
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? JSON.parse(savedTheme) : true; // Default to dark mode if not found
  });
  // function to set the theme
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    // Save theme preference to local storage
    localStorage.setItem("theme", JSON.stringify(newMode));
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
        {["Dashboard", "Add Expense", "Add Source", "Report"].map(
          (text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                component={Link}
                to={
                  text === "Dashboard"
                    ? "/dashboard"
                    : text === "Add Expense"
                    ? "/expenses"
                    : text === "Add Source"
                    ? "/sources"
                    : text === "Report"
                    ? "/report"
                    : `/${text.toLowerCase()}`
                }
              >
                <ListItemIcon>
                  {iconComponents[index % iconComponents.length]}
                </ListItemIcon>
                <ListItemText primary={text} />
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
      <article data-theme={isDarkMode ? "dark" : "light"}>
        
          {DrawerList}
        

        <label>
          <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
          Dark Mode
        </label>
        </article>
      </Drawer>
    </div>
  );
};

export default Sidebar;