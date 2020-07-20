import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import classNames from 'classnames';

import CircularProgress from '@material-ui/core/CircularProgress';

import { _fetch, notify_error } from '../../common.js';

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orgname: null
    };
  }

  componentDidMount = async () => {
    const { global } = this.props;

    let data = {};

    try {
      data = await _fetch(global, '/shared/orgname');
    } catch (e) {
      notify_error(e, 'Unable to fetch org name.');
    }

    this.setState({
      orgname: data.orgname ? data.orgname : 'unknown org'
    });
  }

  render() {
    const { orgname } = this.state;
    const {classes, global, open, handleDrawerOpen, getUserProp } = this.props;

    return (
      <AppBar
        position="absolute"
        className={classNames(classes.appBar, open && classes.appBarShift)}>
        <Toolbar disableGutters={!open} className={classes.toolbar}>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={handleDrawerOpen}
            className={classNames(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            <div style={{ margin: 10 }}>Voter Ambassador {orgname ? (
              orgname
            ) : (
              <CircularProgress height={15} />
            )} </div>
          </Typography>
          <Avatar
            alt="Remy Sharp"
            src={getUserProp('avatar')}
            className={classes.avatar}
          />
        </Toolbar>
      </AppBar>
    );
  }
}
