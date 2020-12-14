import React from "react";
import List from "@material-ui/core/List";
import { CardTripler } from "../Triplers/CardTripler";

const VolunteerTriplerInteraction = (props) => {
  const triplers = props.volunteer.claimees || [];
  const list = triplers.map((c) => (
    <CardTripler
      global={props.global}
      key={c.id}
      tripler={c}
      refer={props.refer}
    />
  ));
  return (
    <div>
      <h3>Triplers ({triplers.length})</h3>
      <List component="nav">{list}</List>
    </div>
  );
};

export default VolunteerTriplerInteraction;
