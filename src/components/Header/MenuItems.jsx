import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import MapIcon from "@material-ui/icons/Map";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import PersonIcon from "@material-ui/icons/Person";
import PeopleIcon from "@material-ui/icons/People";
import DescriptionIcon from "@material-ui/icons/Description";
import NavigationIcon from "@material-ui/icons/Navigation";
import TableChartIcon from "@material-ui/icons/TableChart";
import PresentToAllIcon from "@material-ui/icons/PresentToAll";
import InfoIcon from "@material-ui/icons/Info";
import Timer3Icon from "@material-ui/icons/Timer3";
import WorkIcon from "@material-ui/icons/Work";
import BarChartIcon from "@material-ui/icons/BarChart";
//import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import HelpIcon from "@material-ui/icons/Help";

const MenuItems = ({ assignments, handleClickLogout, experimental }) => (
  <Fragment>
    <List>
      <Link to={"/"}>
        <ListItem button>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
      </Link>
    </List>
    <Divider />
    <List>
      <Link to={"/volunteers"}>
        <ListItem button>
          <ListItemIcon>
            <VerifiedUserIcon />
          </ListItemIcon>
          <ListItemText primary="Ambassadors" />
        </ListItem>
      </Link>
    </List>
    <Divider />
    <List>
      <Link to={"/triplers"}>
        <ListItem button>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Triplers" />
        </ListItem>
      </Link>
    </List>
    <Divider />
    <List>
      <Link to={"/about/"}>
        <ListItem button>
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="About" />
        </ListItem>
      </Link>
    </List>
    <Divider />
    <List>
      <ListItem button onClick={handleClickLogout}>
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary="Log out" />
      </ListItem>
    </List>
    <Divider />
  </Fragment>
);

export default MenuItems;
