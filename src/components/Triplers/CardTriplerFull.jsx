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
export const CardTriplerFull = (props) => (
  <div>
    <br />
    {props.tripler.first_name}
    {props.tripler.signup_completed ? (
      <div>
        <Button
          onClick={() => props.refer._approveTripler(props.tripler, false)}
        >
          Deny
        </Button>
        <Button
          onClick={() => props.refer._approveTripler(props.tripler, true)}
        >
          Approve
        </Button>
      </div>
    ) : (
      <b> - This tripler has not completed signup form</b>
    )}
    <br />
    Approved: {props.tripler.approved ? "Yes" : "No"}
    <br />
    Email: {props.tripler.email ? props.tripler.email : "N/A"}
    <br />
    Phone: {props.tripler.phone ? props.tripler.phone : "N/A"}
    <br />
    Address:
    <TriplerAddress
      global={global}
      refer={props.refer}
      tripler={props.tripler}
    />
    <br />
    {props.tripler.quiz_results ? (
      props.tripler.quiz_results.map ? (
        props.tripler.quiz_results.map((qr) => {
          return (
            <div key={qr.question}>
              <b>question:</b> {qr.question} <b>answer:</b> {qr.answer}
              <br />
              <br />
            </div>
          );
        })
      ) : (
        Object.keys(props.tripler.quiz_results).map((key) => {
          return (
            <div key={key}>
              <b>question:</b> {key} <b>answer:</b>{" "}
              {props.tripler.quiz_results[key]}
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

export class TriplerAddress extends Component {
  constructor(props) {
    super(props);
    let addr = this.props.tripler.address;
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
      await _fetch(global, "/tripler/update", "POST", {
        id: this.props.tripler.id,
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
