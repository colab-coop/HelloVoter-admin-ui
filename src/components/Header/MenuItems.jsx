import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PersonIcon from '@material-ui/icons/Person';
import PeopleIcon from '@material-ui/icons/People';
import MapIcon from '@material-ui/icons/Map';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import PaperclipIcon from '@material-ui/icons/AttachFile';
import NavigationIcon from '@material-ui/icons/Navigation';
import PresentToAllIcon from '@material-ui/icons/PresentToAll';
import WorkIcon from '@material-ui/icons/Work';
import BarChartIcon from '@material-ui/icons/BarChart';
//import SettingsIcon from '@material-ui/icons/Settings';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import HelpIcon from '@material-ui/icons/Help';

const MenuItems = ({ assignments, handleClickLogout, experimental }) => (
  <Fragment>
    <List>
      <Link to={'/'}>
        <ListItem button>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Ambassadors" />
        </ListItem>
      </Link>
    </List>
    <List>
      <Link to={'/triplers'}>
        <ListItem button>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Triplers" />
        </ListItem>
      </Link>
    </List>
    <Divider />
    <List>
      <ListItem button onClick={handleClickLogout}>
        <ListItemIcon>
          <IndeterminateCheckBoxIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </List>
    <Divider />
    <List>
      <Link to={'/about/'}>
        <ListItem button>
          <ListItemIcon>
            <AccountBalanceIcon />
          </ListItemIcon>
          <ListItemText primary="About" />
        </ListItem>
      </Link>
    </List>
    <List>
      <Link to={'/payout/'}>
        <ListItem button>
          <ListItemIcon>
            <AccountBalanceIcon />
          </ListItemIcon>
          <ListItemText primary="Payments" />
        </ListItem>
      </Link>
    </List>
  </Fragment>
);

export default MenuItems;
