import React from "react";
import { sortableElement } from "react-sortable-hoc";
import { faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../common.js";

import "./Dashboard.css";

const _CardDashboard = (props) => (
  <div style={{ display: "flex", padding: "10px" }} className="dashboard-card">
    <div style={{ padding: "5px 10px" }}>
      {props.icon ? (
        props.icon
      ) : (
        <Icon
          style={{ width: 50, height: 50, color: "gray" }}
          icon={faShieldAlt}
        />
      )}
    </div>
    <div style={{ flex: 1, overflow: "auto" }}>
      <h3>{props.name}</h3>
      {typeof props.stat === "object"
        ? Object.keys(props.stat)
            .sort()
            .map((key) => (
              <div>
                {key}: {props.stat[key]}
              </div>
            ))
        : "" + props.stat}
    </div>
  </div>
);

export const CardDashboard = sortableElement(_CardDashboard);
