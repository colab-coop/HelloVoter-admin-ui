import React, { Component } from "react";

import { HashRouter as Router, Route, Link } from "react-router-dom";
import Select from "react-select";

import Modal from "@material-ui/core/Modal";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";

import {
  notify_error,
  _fetch,
  _searchStringify,
  _loadTriplers,
  RootLoader,
  DialogSaving,
  InviteSomeone,
} from "../../common.js";

import { CardTripler } from "../Triplers/CardTripler";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.locale(en);

export default class App extends Component {
  constructor(props) {
    console.log(props.volunteer);
    super(props);
    this.state = {
      global: props.global,
      loading: true,
      thisTripler: {},
      triplers: props.volunteer.claimees,
      perPage: 12,
      pageNum: 1,
    };
  }

  componentDidMount() {
    this._loadData();
  }

  _loadData = async () => {
    const { global } = this.state;

    let triplers = [];
    this.setState({ loading: false, firstName: "", lastName: "" });
  };

  handlePageClick = (data) => {
    this.setState({ pageNum: data.selected + 1 });
  };

  render() {
    const { global } = this.state;

    let ready = [];
    let unassigned = [];
    let incomplete = [];
    let denied = [];
    let invited = [];

    return (
      <div flag={this.state.loading} func={() => this._loadData()}>
        <ListClaimedTriplers
          global={global}
          refer={this}
          triplers={this.state.triplers}
        />
      </div>
    );
  }
}

const ListClaimedTriplers = (props) => {
  const perPage = 12;
  let list = [];

  props.triplers.forEach((c, idx) => {
    let tp = Math.floor(idx / perPage) + 1;
    if (tp !== props.refer.state.pageNum) return;
    list.push(
      <CardTripler global={global} key={c.id} tripler={c} refer={props.refer} />
    );
  });

  return (
    <div>
      <h3>
        {props.type} Claimees ({props.triplers.length})
      </h3>
      <List component="nav">{list}</List>
    </div>
  );
};
