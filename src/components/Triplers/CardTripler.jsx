import React, { Component } from "react";

import ReactTooltip from "react-tooltip";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import CircularProgress from "@material-ui/core/CircularProgress";
import Avatar from "@material-ui/core/Avatar";

import {
  notify_error,
  notify_success,
  _fetch,
  _searchStringify,
  _handleSelectChange,
  _loadTripler,
  _loadForms,
  _loadTurfs,
  _loadNearbyTurfs,
  Icon,
} from "../../common.js";

import { CardTurf } from "../Turf";
import { CardForm } from "../Forms";
import { CardTriplerFull } from "./CardTriplerFull";

import {
  faCrown,
  faExclamationTriangle,
  faCheckCircle,
  faBan,
  faHome,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.locale(en);

const NEARBY_DIST = 50;

function extract_addr(addr) {
  let arr = addr.split(", ");
  if (arr.length < 4) return addr;
  arr.shift();
  return arr.join(", ");
}

export class CardTripler extends Component {
  constructor(props) {
    super(props);

    this.state = {
      global: props.global,
      refer: this.props.refer.props.refer,
      tripler: this.props.tripler,
      selectedFormsOption: [],
      selectedTurfOption: [],
    };
  }

  componentDidMount() {
    if (!this.state.tripler) this._loadData();

    ReactTooltip.rebuild();
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  _loadData = async () => {
    const { global } = this.state;

    let tripler = {},
      forms = [],
      turf = [],
      hometurf = [],
      nearbyturf = [];

    this.setState({ loading: true });

    try {
      [tripler, forms, turf] = await Promise.all([
        _loadTripler(global, this.props.id),
        _loadForms(global),
        _loadTurfs(global),
      ]);
    } catch (e) {
      notify_error(e, "Unable to load tripler info.");
      return this.setState({ loading: false });
    }

    if (tripler.location) {
      hometurf = await _loadNearbyTurfs(
        global,
        tripler.location.x,
        tripler.location.y,
        0
      );
      nearbyturf = await _loadNearbyTurfs(
        global,
        tripler.location.x,
        tripler.location.y,
        NEARBY_DIST
      );
    }

    let selectedFormsOption = [];
    let selectedTurfOption = [];

    let formOptions = [{ value: "", label: "None" }];

    let turfOptions = [{ value: "", label: "None" }];

    forms.forEach((f) => {
      formOptions.push({
        value: _searchStringify(f),
        id: f.id,
        label: <CardForm global={global} key={f.id} form={f} refer={this} />,
      });
    });

    tripler.ass.forms.forEach((f) => {
      selectedFormsOption.push({
        value: _searchStringify(f),
        id: f.id,
        label: <CardForm global={global} key={f.id} form={f} refer={this} />,
      });
    });

    turf.forEach((t) => {
      turfOptions.push({
        value: _searchStringify(t),
        id: t.id,
        label: <CardTurf global={global} key={t.id} turf={t} refer={this} />,
      });
    });

    tripler.ass.turfs.forEach((t) => {
      selectedTurfOption.push({
        value: _searchStringify(t),
        id: t.id,
        label: (
          <CardTurf
            global={global}
            key={t.id}
            turf={t}
            refer={this}
            icon={tripler.autoturf ? faHome : null}
          />
        ),
      });
    });

    this.setState({
      loading: false,
      tripler,
      formOptions,
      turfOptions,
      selectedFormsOption,
      selectedTurfOption,
      hometurf,
      nearbyturf,
    });
  };

  render() {
    const { global, tripler } = this.state;

    if (!tripler || this.state.loading) {
      return <CircularProgress />;
    }

    if (this.props.edit)
      return (
        <div>
          <ListItem alignItems="flex-start" style={{ width: 350 }}>
            <ListItemAvatar>
              <Avatar alt={tripler.first_name} src={tripler.avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={`${tripler.first_name} ${tripler.last_name || ""}`}
              secondary={`${tripler.address.address1} ${tripler.address.city} ${tripler.address.state} ${tripler.address.zip}`}
            />
            <TriplerBadges tripler={tripler} />
          </ListItem>
          <CardTriplerFull global={global} tripler={tripler} refer={this} />
        </div>
      );

    return (
      <ListItem
        button
        style={{ width: 350 }}
        onClick={() => {
          this.props.refer.setState({ thisTripler: tripler });
          window.location.href = "#/triplers/view/" + tripler.id;
        }}
      >
        <ListItemAvatar>
          <Avatar alt={tripler.first_name} src={tripler.avatar} />
        </ListItemAvatar>
        <ListItemText
          primary={`${tripler.first_name} ${tripler.last_name || ""}`}
          secondary={`${tripler.address.address1} ${tripler.address.city} ${tripler.address.state} ${tripler.address.zip} 
                \n ${tripler.phone} ${tripler.status} 
                `}
        />
        <ListItemText
          primary={`Triplees`}
          secondary={`${
            tripler.triplees
              ? JSON.stringify(tripler.triplees[0])
              : "no triplers"
          }`}
        />
        <TriplerBadges tripler={tripler} />
      </ListItem>
    );
  }
}

const TriplerBadges = (props) => {
  let badges = [];
  let id = props.tripler.id;

  return badges;
};
