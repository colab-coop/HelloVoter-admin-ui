import React, { Component } from "react";

import { HashRouter as Router, Route, Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
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

import { CardTripler } from "./CardTripler";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.locale(en);

export default class App extends Component {
  constructor(props) {
    super(props);

    let perPage = localStorage.getItem("triplersperpage");
    if (!perPage) perPage = 5;

    this.state = {
      global: props.global,
      loading: true,
      thisTripler: {},
      triplers: [],
      firstName: "",
      lastName: "",
      perPage: perPage,
      pageNum: 1,
    };

    this.onTypeFirstName = this.onTypeFirstName.bind(this);
    this.onTypeLastName = this.onTypeLastName.bind(this);
    this.handlePageNumChange = this.handlePageNumChange.bind(this);
  }

  componentDidMount() {
    this._loadData();
  }

  handlePageNumChange(obj) {
    localStorage.setItem("triplersperpage", obj.value);
    this.setState({ pageNum: 1, perPage: obj.value });
  }

  onTypeFirstName(event) {
    this.setState({
      firstName: event.target.value,
    });
  }

  onTypeLastName(event) {
    this.setState({
      lastName: event.target.value,
    });
  }

  submitSearch = async (event) => {
    let triplers = await _loadTriplers(
      this.state.global,
      this.state.firstName,
      this.state.lastName
    );
    this.setState({
      triplers: triplers,
    });
  };

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
      <RootLoader flag={this.state.loading} func={() => this._loadData()}>
        <Router>
          <div>
            <br />
            <input
              type="text"
              value={this.state.first_name}
              onChange={this.onTypeFirstName}
              placeholder="first name"
              data-tip="first name"
            />
            <br />
            <br />
            <input
              type="text"
              value={this.state.last_name}
              onChange={this.onTypeLastName}
              placeholder="last name"
              data-tip="last name"
            />
            <br />
            <br />
            <Button onClick={this.submitSearch}>search</Button>
            <br />
            <br />
            <Route
              exact={true}
              path="/triplers/"
              render={() => (
                <ListTriplers
                  global={global}
                  refer={this}
                  triplers={this.state.triplers}
                />
              )}
            />
            <DialogSaving flag={this.state.saving} />
          </div>
        </Router>
      </RootLoader>
    );
  }
}

const ListTriplers = (props) => {
  const perPage = props.refer.state.perPage;
  let paginate = <div />;
  let list = [];

  props.triplers.forEach((c, idx) => {
    let tp = Math.floor(idx / perPage) + 1;
    if (tp !== props.refer.state.pageNum) return;
    list.push(
      <CardTripler global={global} key={c.id} tripler={c} refer={props.refer} />
    );
  });

  paginate = (
    <div style={{ display: "flex" }}>
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={props.triplers.length / perPage}
        marginPagesDisplayed={1}
        pageRangeDisplayed={8}
        onPageChange={props.refer.handlePageClick}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
      />
      &nbsp;&nbsp;&nbsp;
      <div style={{ width: 75 }}>
        # Per Page{" "}
        <Select
          value={{ value: perPage, label: perPage }}
          onChange={props.refer.handlePageNumChange}
          options={[
            { value: 5, label: 5 },
            { value: 10, label: 10 },
            { value: 25, label: 25 },
            { value: 50, label: 50 },
            { value: 100, label: 100 },
          ]}
        />
      </div>
    </div>
  );

  return (
    <div>
      <h3>
        {props.type} Triplers ({props.triplers.length})
      </h3>
      {paginate}
      <List component="nav">{list}</List>
      {paginate}
    </div>
  );
};
