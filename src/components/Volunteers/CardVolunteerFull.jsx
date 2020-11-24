import React, { Component } from "react";

import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import Select from "react-select";

import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";

import {
  notify_error,
  notify_success,
  _fetch,
  PlacesAutocomplete,
} from "../../common.js";

import { CardTurf } from "../Turf";
import { CardForm } from "../Forms";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.locale(en);

const NEARBY_DIST = 50;
export const CardVolunteerFull = (props) => (
  <div>
    <div>Has W9?: {props.volunteer.has_w9 ? "Yes" : "No"}</div>
    <div>Currently Approved: {props.volunteer.approved ? "Yes" : "No"}</div>
    <div>
      <Button
        onClick={() => props.refer._approveAmbassador(props.volunteer, false)}
      >
        Deny
      </Button>
      <Button
        onClick={() => props.refer._approveAmbassador(props.volunteer, true)}
      >
        Approve
      </Button>
    </div>
    Currently Admin: {props.volunteer.admin ? "Yes" : "No"}
    <div>
      <Button onClick={() => props.refer._adminizeAmbassador(props.volunteer)}>
        Make Admin
      </Button>
    </div>
    Email: {props.volunteer.email ? props.volunteer.email : "N/A"}
    <br />
    Phone: {props.volunteer.phone ? props.volunteer.phone : "N/A"}
    <br />
    Address:
    <VolunteerAddress
      global={global}
      refer={props.refer}
      volunteer={props.volunteer}
    />
    {props.volunteer.verification ? (
      <div>{JSON.stringify(props.volunteer.verification, null, 2)}</div>
    ) : (
      <div>no phone lookup</div>
    )}
    <br />
    <br />
    {props.volunteer.quiz_results ? (
      props.volunteer.quiz_results.map ? (
        props.volunteer.quiz_results.map((qr) => {
          return (
            <div key={qr.question}>
              <b>question:</b> {qr.question} <b>answer:</b> {qr.answer}
              <br />
              <br />
            </div>
          );
        })
      ) : (
        Object.keys(props.volunteer.quiz_results).map((key) => {
          return (
            <div key={key}>
              <b>question:</b> {key} <b>answer:</b>{" "}
              {props.volunteer.quiz_results[key]}
              <br />
              <br />
            </div>
          );
        })
      )
    ) : (
      <div>no quiz results</div>
    )}
    <br />
  </div>
);

export class VolunteerAddress extends Component {
  constructor(props) {
    super(props);
    let addr = this.props.volunteer.address;
    this.state = {
      global: props.global,
      edit: false,
      address: `${addr.address1} ${addr.city}, ${addr.state} ${addr.zip}`,
    };
    this.onTypeAddress = (address) => this.setState({ address });
  }

  submitAddress = async (address) => {
    const { global } = this.state;

    this.setState({ address });
    try {
      let res = await geocodeByAddress(address);
      let pos = await getLatLng(res[0]);
      await _fetch(global, "/volunteer/update", "POST", {
        id: this.props.volunteer.id,
        address: address,
        lat: pos.lat,
        lng: pos.lng,
      });
      this.props.refer._loadData();
      notify_success("Address hass been saved.");
    } catch (e) {
      notify_error(e, "Unable to update address info.");
    }
  };

  render() {
    if (this.state.edit)
      return (
        <PlacesAutocomplete
          debounce={500}
          value={this.state.address}
          onChange={this.onTypeAddress}
          onSelect={this.submitAddress}
        />
      );

    return <div>{this.state.address} </div>;
  }
}
