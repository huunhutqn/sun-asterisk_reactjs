import React, { Component } from 'react';

class Heading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countItem: this.props.passNumItemDisplayed
    };
  }
  render() {
    return (
      <div className="products-top__heading">
        <span className="products-top__heading__count">{this.props.passNumItemDisplayed}</span>
        <span className="products-top__heading__text"> Product(s) found.</span>
      </div>
    );
  }
}

export default Heading;