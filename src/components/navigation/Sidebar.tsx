import * as React from "react";
import { useContext } from "react";
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
import HomeIcon from "@mui/icons-material/Home";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";
import { AuthContext } from "../../contexts/AuthContext";

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);
  const {user} = useContext(AuthContext);
  console.log('user from context',user)

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
  const iconComponents0 = [<HomeIcon />];
  const signComponents = [<PersonAddIcon />, <LoginIcon />];

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      {/* check the token and switch to related sidebar */}
      {localStorage.getItem("accessToken") ? (
        <List>
          {[user.userName, "Logout"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                component={Link}
                to={
                  text === user.userName
                    ? "/profile"
                    : text === "Logout"
                    ? "/homepage"
                    : `/${text.toLowerCase()}`
                }
              >
                <ListItemIcon>
                  {usericonComponents[index % usericonComponents.length]}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <List>
          {["Homepage"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                component={Link}
                to={
                  text === "Homepage" ? "/homepage" : `/${text.toLowerCase()}`
                }
              >
                <ListItemIcon>
                  {iconComponents0[index % iconComponents0.length]}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      <Divider />
      {/* check the token and switch to related sidebar */}
      {localStorage.getItem("accessToken") ? (
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
      ) : (
        <List>
          {["Signup", "Login"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                component={Link}
                to={
                  text === "Signup"
                    ? "/signup"
                    : text === "Login"
                    ? "/login"
                    : `/${text.toLowerCase()}`
                }
              >
                <ListItemIcon>
                  {signComponents[index % signComponents.length]}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

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
      </Drawer>
    </div>
  );
}
