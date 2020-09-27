import React, { Component } from 'react';

import { HashRouter as Router, Route, Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';

import Modal from '@material-ui/core/Modal';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';

import {
  notify_error,
  _fetch,
  _searchStringify,
  _loadTriplers,
  RootLoader,
  DialogSaving,
  InviteSomeone,
} from '../../common.js';

import { CardTripler } from './CardTripler'

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.locale(en);

export default class App extends Component {
  constructor(props) {
    super(props);

    let perPage = localStorage.getItem('triplersperpage');
    if (!perPage) perPage = 5;

    this.state = {
      global: props.global,
      loading: true,
      thisTripler: {},
      triplers: [],
      search: '',
      perPage: perPage,
      pageNum: 1
    };

    this.onTypeSearch = this.onTypeSearch.bind(this);
    this.handlePageNumChange = this.handlePageNumChange.bind(this);
  }

  componentDidMount() {
    this._loadData();
  }

  handlePageNumChange(obj) {
    localStorage.setItem('triplersperpage', obj.value);
    this.setState({ pageNum: 1, perPage: obj.value });
  }

  onTypeSearch(event) {
    this.setState({
      search: event.target.value.toLowerCase(),
      pageNum: 1
    });
  }

  _loadData = async () => {
    const { global } = this.state;

    let triplers = [];
    this.setState({ loading: true, search: '' });
    try {
      triplers = await _loadTriplers(global);
    } catch (e) {
      notify_error(e, 'Unable to load triplers.');
    }
    this.setState({ loading: false, triplers });
  };

  handlePageClick = data => {
    this.setState({ pageNum: data.selected + 1 });
  };

  render() {
    const { global } = this.state;

    let ready = [];
    let unassigned = [];
    let incomplete = [];
    let denied = [];
    let invited = [];

    this.state.triplers.forEach(c => {
      if (this.state.search && !_searchStringify(c).includes(this.state.search))
        return;
      if (c.locked) {
        denied.push(c);
      } else if (c.invited) invited.push(c);
      else if (c.approved) ready.push(c);
      else if (c.signup_completed) unassigned.push(c);
      else incomplete.push(c);
    });

    return (
      <RootLoader flag={this.state.loading} func={() => this._loadData()}>
        <Router>
          <div>
            Search:{' '}
            <input
              type="text"
              value={this.state.value}
              onChange={this.onTypeSearch}
              data-tip="Search by name, email, location, or admin"
            />
            <br />
            <Link
              to={'/triplers/'}
              onClick={() => this.setState({ pageNum: 1 })}
            >
              Approved ({ready.length})
            </Link>
            &nbsp;-&nbsp;
            <Link
              to={'/triplers/unassigned'}
              onClick={() => this.setState({ pageNum: 1 })}
            >
              Pending ({unassigned.length})
            </Link>
            &nbsp;-&nbsp;
            <Link
              to={'/triplers/denied'}
              onClick={() => this.setState({ pageNum: 1 })}
            >
              Denied ({denied.length})
            </Link>
            <Route
              exact={true}
              path="/triplers/"
              render={() => <ListTriplers global={global} refer={this} triplers={ready} />}
            />
            <Route
              exact={true}
              path="/triplers/unassigned"
              render={() => (
                <ListTriplers
                  global={global}
                  refer={this}
                  type="Unassigned"
                  triplers={unassigned}
                />
              )}
            />
            <Route
              exact={true}
              path="/triplers/invited"
              render={() => (
                <div>
                  <ListTriplers
                    global={global}
                    refer={this}
                    type="Invited"
                    triplers={invited}
                  />
                  <Button onClick={async () => {
                    let obj = await _fetch(
                      global,
                      '/tripler/invite',
                      'POST'
                    );
                    if (obj.token) {
                      this.setState({ thisTripler: {id: 'invite:'+obj.token} });
                    } else {
                      notify_error({}, 'Invite failed.');
                    }
                  }} color="primary">
                    Invite Someone
                  </Button>
                </div>
              )}
            />
            <Route
              exact={true}
              path="/triplers/incomplete"
              render={() => (
                <ListTriplers
                  global={global}
                  refer={this}
                  type="Incomplete"
                  triplers={incomplete}
                />
              )}
            />
            <Route
              exact={true}
              path="/triplers/denied"
              render={() => (
                <ListTriplers
                  global={global}
                  refer={this}
                  type="Denied"
                  triplers={denied}
                />
              )}
            />
            <Route
              path="/triplers/view/:id"
              render={props => (
              <div
                style={{
                  position: 'absolute',
                  top: 100,
                  left: 200,
                  right: 200,
                  backgroundColor: 'white',
                  padding: 40
                }}
              >
              <CardTripler
                global={global}
                key={props.match.params.id}
                id={props.match.params.id}
                edit={true}
                refer={this}
              />
              </div>)}
            />
            <DialogSaving flag={this.state.saving} />
          </div>
        </Router>
      </RootLoader>
    );
  }
}

const ListTriplers = props => {
  const perPage = props.refer.state.perPage;
  let paginate = <div />;
  let list = [];

  props.triplers.forEach((c, idx) => {
    let tp = Math.floor(idx / perPage) + 1;
    if (tp !== props.refer.state.pageNum) return;
    list.push(<CardTripler global={global} key={c.id} tripler={c} refer={props.refer} />);
  });

  paginate = (
    <div style={{ display: 'flex' }}>
      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={props.triplers.length / perPage}
        marginPagesDisplayed={1}
        pageRangeDisplayed={8}
        onPageChange={props.refer.handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
      />
      &nbsp;&nbsp;&nbsp;
      <div style={{ width: 75 }}>
        # Per Page{' '}
        <Select
          value={{ value: perPage, label: perPage }}
          onChange={props.refer.handlePageNumChange}
          options={[
            { value: 5, label: 5 },
            { value: 10, label: 10 },
            { value: 25, label: 25 },
            { value: 50, label: 50 },
            { value: 100, label: 100 }
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
