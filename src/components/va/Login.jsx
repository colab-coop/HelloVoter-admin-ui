import React, { Component } from 'react';

import Loading from '../Loading';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import styles from '../../app.styles';

const SERVER_URL =
  `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_API_DOMAIN}/HelloVoterHQ/${process.env.REACT_APP_ORGID}/api/v1`

const LOGIN_URL = `${SERVER_URL}/hello`

class Login extends Component {

  constructor(props) {
    super(props);

    let loginOptions = [];
    if (!process.env.REACT_APP_NO_AUTH) loginOptions = [{label: 'Organization ID', value: 'org'}, {label: '3rd Party Server', value: 'server'}];
    if (process.env.NODE_ENV === 'development') loginOptions.unshift({label: 'LOCAL DEVELOPMENT', value: 'dev'});

    let token;

    try {
      if (this.props.location.pathname.match(/\/jwt\//)) {
        token = this.props.location.pathname.split('/').pop();
      }
    } catch(e) {
      console.warn(e);
    }

    this.state = {
      global: props.global,
      dev: (process.env.NODE_ENV === 'development'), // default to true if development
      classes: props.classes,
      token: token,
      loginOptions: loginOptions,
    };

  }

  componentDidMount() {
    const { token } = this.state;

    if (token) {
      localStorage.setItem('jwt', token);
      setTimeout(() => {window.location.href = '/' + process.env.REACT_APP_SUBPATH + '/admin/#/'}, 500);
      setTimeout(() => {window.location.reload()}, 1500);
    }
  }

  getToken () {
    return localStorage.getItem('jwt')
  }

  addAuth (headers) {
    const token = this.getToken()
    return {
      ...(headers ? headers : null),
      "Authorization": `Bearer ${token ? token : 'of the one ring'}`,
      "Content-Type": "application/json"
    }
  }

  async login(sm) {
    const data = await this.apiLogIn(sm);
    if (data) window.location.href = data.smOauthUrl
  }

  async apiLogIn(sm) {
    try {
      let res = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: this.addAuth()
      })
      let data = await res.json()
      let smOauthUrl = `${res.headers.get('x-sm-oauth-url')}/${sm}/?aud=${process.env.REACT_APP_AUDIANCE}&app=${process.env.REACT_APP_KEY}`
      if (process.env.NODE_ENV === 'development') smOauthUrl += ['&local=', true].join('')
      return {
        data,
        smOauthUrl
      }
    } catch(e) {
      console.warn(e)
      return false
    }
  }

  render() {
    const { global, classes, token, loginOptions } = this.state;

    if (token) return (<Loading classes={classes} />);

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in to Voting Ambassador Admin
          </Typography>
          <form className={classes.form} onSubmit={(e) => { e.preventDefault(); global.doSave(e, this.state.target); }} >
           <center>
              <br />
              &nbsp; || &nbsp;
              <a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/OurVoiceUSA/HelloVoter/master/docs/Privacy-Policy.md">Privacy Policy</a>
              &nbsp; || &nbsp;
              <a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/OurVoiceUSA/HelloVoter/master/docs/Terms-of-Service.md">Terms of Service</a>
              &nbsp; || &nbsp;
            </center>
            {(process.env.REACT_APP_NO_AUTH)&&
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => this.setState({target: 'none'})}
            >
              Sign In
            </Button>
            ||
            <div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={() => this.login('gm')}
              >
                Google Sign In
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                onClick={() => this.login('fm')}
                className={classes.submit}
              >
                Facebook Sign In
              </Button>
            </div>
            }
          </form>
        </Paper>
        <br />
        <center>
          Built with <span role="img" aria-label="Love">❤️</span> by Our Voice USA
          <p />
          Not for any candidate or political party.
          <p />
          Copyright (c) 2020, Our Voice USA. All rights reserved.
          <p />
          This program is free software; you can redistribute it and/or
          modify it under the terms of the GNU Affero General Public License
          as published by the Free Software Foundation; either version 3
          of the License, or (at your option) any later version.
        </center>
      </main>
    );
  }
}

export default withStyles(styles)(Login);

