import React, { Component } from "react";
import NumberFormat from "react-number-format";
import Button from "@material-ui/core/Button";
import filesize from "filesize";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import PersonIcon from "@material-ui/icons/Person";
import PeopleIcon from "@material-ui/icons/People";
import DescriptionIcon from "@material-ui/icons/Description";
import HowToVoteIcon from "@material-ui/icons/HowToVote";

import Modal from "@material-ui/core/Modal";

import {
  faUser,
  faUsers,
  faMap,
  faClipboard,
  faChartPie,
  faMapMarkerAlt,
  faDatabase,
} from "@fortawesome/free-solid-svg-icons";

import { arrayMove } from "react-sortable-hoc";

import {
  _fetch,
  notify_error,
  RootLoader,
  InviteSomeone,
} from "../../common.js";

import { Cards } from "./Cards";

export default class App extends Component {
  constructor(props) {
    super(props);

    const dash = "ambassadors,triplers,triplees,voting_plans,voted".split(",");

    this.state = {
      global: props.global,
      loading: true,
      noAdmins: false,
      triplerCount: 10,
      data: {},
      cards: [],
      dash,
    };
  }

  componentDidMount() {
    this._loadData();
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const dash = arrayMove(this.state.dash, oldIndex, newIndex);
    localStorage.setItem(
      "dash",
      dash.map((n) => n)
    );
    this.setState(() => ({
      dash,
    }));
  };

  _loadData = async () => {
    const { global } = this.state;

    let data = {};
    let cards = {};

    this.setState({ loading: true });

    try {
      data = await _fetch(global, "/shared/stats");

      cards = {
        ambassadors: {
          name: "Ambassadors",
          content: (
            <>
              <div>
                Potential: {data.ambassadors.all} ({data.ambassadors.all_voted}{" "}
                voted)
              </div>
              <div>
                Registered: {data.ambassadors.signup_completed} (
                {data.ambassadors.signup_completed_voted} voted)
              </div>
              <div>
                Onboarded: {data.ambassadors.onboarding_completed} (
                {data.ambassadors.onboarding_completed_voted} voted)
              </div>
            </>
          ),
          icon: <VerifiedUserIcon fontSize="large" />,
        },
        triplers: {
          name: "Triplers",
          content: (
            <>
              <div>
                Potential: {data.triplers.all} ({data.triplers.all_voted} voted)
              </div>
              <div>
                Pending: {data.triplers.pending} ({data.triplers.pending_voted}{" "}
                voted)
              </div>
              <div>
                Confirmed: {data.triplers.confirmed} (
                {data.triplers.confirmed_voted} voted)
              </div>
            </>
          ),
          icon: <PersonIcon fontSize="large" />,
        },
        triplees: {
          name: "Triplees",
          content: (
            <>
              <div>
                All: {data.triplees.all} ({data.triplees.all_voted} voted)
              </div>
            </>
          ),
          icon: <PeopleIcon fontSize="large" />,
        },
        voting_plans: {
          name: "Voting Plans",
          stat: data.voting_plans,
          icon: <DescriptionIcon fontSize="large" />,
        },
        voted: {
          name: "Voted",
          content: (
            <>
              <div>
                Registered Ambassadors:{" "}
                {data.ambassadors.signup_completed_voted}
              </div>
              <div>Confirmed Triplers: {data.triplers.confirmed_voted}</div>
              <div>Triplees: {data.triplees.all_voted}</div>
              <div>
                TOTAL:{" "}
                {data.ambassadors.signup_completed_voted +
                  data.triplers.confirmed_voted +
                  data.triplees.all_voted}
              </div>
            </>
          ),
          icon: <HowToVoteIcon fontSize="large" />,
        },
      };
    } catch (e) {
      notify_error(e, "Unable to load dashboard info.");
    }

    this.setState({ cards, data, loading: false });
  };

  async createTripleeNodes(count) {
    const { global } = this.state;
    this.setState({ loading: true });
    await _fetch(global, "/triplers/create_triplees", "POST", { count });
    this._loadData();
  }

  render() {
    const { global, data, loading, noAdmins } = this.state;

    return (
      <RootLoader flag={loading} func={this._loadData}>
        {data.version && data.version !== process.env.REACT_APP_VERSION && (
          <h3 style={{ color: "red" }}>
            WARNING: API version doesn't match HQ version.
          </h3>
        )}
        <Cards
          state={this.state}
          axis="xy"
          onSortEnd={this.onSortEnd}
          cards={this.state.cards}
          dash={this.state.dash}
        />

        <input
          size={5}
          value={this.state.triplerCount}
          onChange={(e) =>
            this.setState({ triplerCount: +e.target.value || 0 })
          }
        />

        <Button
          onClick={() => this.createTripleeNodes(this.state.triplerCount)}
        >
          Fill in missing Triplee nodes
        </Button>

        {false && <InviteSomeone refer={this} />}

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={noAdmins}
          onClose={() => this.setState({ noAdmins: false })}
        >
          <div
            style={{
              position: "absolute",
              top: 100,
              left: 200,
              right: 200,
              backgroundColor: "white",
              padding: 40,
            }}
          >
            Welcome! Looks like you're new here. By default, users have zero
            permissions when they sign in. To make yourself an admin and gain
            full access to the UI, run the follow command from the shell:
            <br />
            <br />
            <pre>npm run makeadmin -- {global.getUserProp("id")}</pre>
          </div>
        </Modal>
      </RootLoader>
    );
  }
}
