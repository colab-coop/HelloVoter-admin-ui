import React, { Component } from "react";
import List from "@material-ui/core/List";
import { CardTripler } from "../Triplers/CardTripler";

export default class App extends Component {
  constructor(props) {
    console.log(props.volunteer);
    super(props);
    this.state = {
      loading: true,
      thisTripler: {},
      triplers: props.volunteer.claimees,
      perPage: 12,
      pageNum: 1,
    };
  }

  componentDidMount() {
    this._loadData();
  }

  _loadData = async () => {
    this.setState({ loading: false, firstName: "", lastName: "" });
  };

  render() {
    const { global } = this.state;

    return (
      <div flag={this.state.loading} func={() => this._loadData()}>
        <ListClaimedTriplers
          global={global}
          refer={this}
          triplers={this.state.triplers}
        />
      </div>
    );
  }
}

const ListClaimedTriplers = (props) => {
  const perPage = 12;
  let list = [];

  props.triplers.forEach((c, idx) => {
    let tp = Math.floor(idx / perPage) + 1;
    if (tp !== props.refer.state.pageNum) return;
    list.push(
      <CardTripler global={global} key={c.id} tripler={c} refer={props.refer} />
    );
  });

  return (
    <div>
      <h3>
        {props.type} Claimees ({props.triplers.length})
      </h3>
      <List component="nav">{list}</List>
    </div>
  );
};
