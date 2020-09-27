import React, { Component } from 'react';
import { PlaidLink } from 'react-plaid-link';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';

import styles from '../app.styles';
import {
  notify_error,
  notify_success,
  _fetch,
} from '../common.js';

class Payout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      classes: props.classes,
      global: props.global
    };
  }

  handleClick = async (el) => {
    const { global } = this.state;
    const { server, token } = global.state;
    let https = true;
    let exportId = el.currentTarget.dataset.csvid;

    if (server.match(/:8080$/)) https = false;

    try {
      let res = await fetch('http'+(https?'s':'')+'://' + server + '/HelloVoterHQ' + (global.state.orgId?'/'+global.state.orgId:'') + '/api/v1/csv-export/' + exportId, {
        method: 'GET',
          headers: {
            Authorization: 'Bearer ' + token
          }
        });

      let csv = await res.text();
      let hiddenElement = document.createElement('a');
      hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
      hiddenElement.target = '_blank';
      hiddenElement.download = exportId + '.csv';
      hiddenElement.click();
    } catch (e) {
      notify_error(e, 'Unable to get CSV export.');
    }
  };

  render() {
    const { classes } = this.state;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <button data-csvid="ambassadors" onClick={this.handleClick}>Ambassador CSV download</button>
        <br />
        <br />
        <button data-csvid="triplers" onClick={this.handleClick}>Tripler CSV download</button>
        <br />
        <br />
        <br />
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

export default withStyles(styles)(Payout);
