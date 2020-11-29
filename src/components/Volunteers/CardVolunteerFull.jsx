import React from "react";

import Button from "@material-ui/core/Button";

import VolunteerProfile from "./VolunteerProfile";
import VolunteerTriplerInteraction from "./VolunteerTriplerInteraction";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.locale(en);

export const CardVolunteerFull = (props) => (
  <div>
    <div>Has W9?: {props.volunteer.has_w9 ? "Yes" : "No"}</div>
    <Button
      onClick={() => props.refer._updateW9Ambassador(props.volunteer, true)}
    >
      Has W9
    </Button>
    <Button
      onClick={() => props.refer._updateW9Ambassador(props.volunteer, false)}
    >
      Does Not Have W9
    </Button>
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
    <VolunteerProfile volunteer={props.volunteer} refer={props.refer} />
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
    <VolunteerTriplerInteraction
      volunteer={props.volunteer}
      refer={props.refer}
    />
  </div>
);
