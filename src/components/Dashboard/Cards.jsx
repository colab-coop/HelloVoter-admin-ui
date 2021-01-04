import React from "react";
import { sortableContainer } from "react-sortable-hoc";
import { CardDashboard } from "./CardDashboard";

import "./Dashboard.css";

const _Cards = (props) => {
  return (
    <div className="dashboard-container">
      {props.dash.map((key, index) => {
        const card = props.cards[key] || {};
        return (
          <CardDashboard
            key={card.name}
            name={card.name}
            stat={card.stat}
            content={card.content}
            icon={card.icon}
            index={index}
          />
        );
      })}
    </div>
  );
};

export const Cards = sortableContainer(_Cards);
