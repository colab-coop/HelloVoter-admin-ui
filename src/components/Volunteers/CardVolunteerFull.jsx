import React, { useState } from "react";

import Button from "@material-ui/core/Button";

import VolunteerProfile from "./VolunteerProfile";
import VolunteerTriplerInteraction from "./VolunteerTriplerInteraction";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Input from "@material-ui/core/Input";

TimeAgo.locale(en);

// eslint-disable-next-line import/prefer-default-export
export const CardVolunteerFull = (props) => {
  const [claimTriplerLimit, setClaimTriplerLimit] = useState(
    props.volunteer.claim_tripler_limit
  );
  return (
    <div>
      <h2>Buttons</h2>
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
      <div>
        PayPal Approved?: {props.volunteer.paypal_approved ? "Yes" : "No"}
      </div>
      <Button
        onClick={() =>
          props.refer._updatePayPalApprovedAmbassador(props.volunteer, true)
        }
      >
        PayPal Approved
      </Button>
      <Button
        onClick={() =>
          props.refer._updatePayPalApprovedAmbassador(props.volunteer, false)
        }
      >
        Not PayPal Approved
      </Button>
      <div>Currently Approved? {props.volunteer.approved ? "Yes" : "No"}</div>
      <div>
        <i>
          Pressing Approve will only change approval status, not locked status.
        </i>
      </div>
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
        <Button
          onClick={() => props.refer._adminizeAmbassador(props.volunteer)}
        >
          Make Admin
        </Button>
      </div>
      <div>
        Claim Tripler Limit:{" "}
        <Input
          type="number"
          value={
            claimTriplerLimit === undefined || claimTriplerLimit == null
              ? ""
              : claimTriplerLimit
          }
          onChange={(evt) => setClaimTriplerLimit(evt.target.value)}
        />
        <Button
          onClick={() =>
            props.refer._updateTriplerLimit(props.volunteer, claimTriplerLimit)
          }
        >
          Update
        </Button>
      </div>
      <h2>Profile</h2>
      <VolunteerProfile volunteer={props.volunteer} refer={props.refer} />
      <h2>Verification</h2>
      <div>
        {props.volunteer.verification ? (
          <div>{JSON.stringify(props.volunteer.verification, null, 2)}</div>
        ) : (
          <div>no phone lookup</div>
        )}
      </div>
      <h2>Accounts</h2>
      <div>
        {props.volunteer.account ? (
          <div>{JSON.stringify(props.volunteer.account, null, 2)}</div>
        ) : (
          <div>no accounts</div>
        )}
      </div>
      <h2>Payouts</h2>
      <div>
        {props.volunteer.payouts ? (
          <div>{JSON.stringify(props.volunteer.payouts, null, 2)}</div>
        ) : (
          <div>no payouts</div>
        )}
      </div>
      <h2>Quiz Results</h2>
      <div>
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
      </div>
      <h2>Interactions</h2>
      <VolunteerTriplerInteraction
        volunteer={props.volunteer}
        refer={props.refer}
      />
    </div>
  );
};
