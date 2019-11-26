import React, { Component } from 'react';

import './style.scss';

import Heading from './Heading';
import Sort from './Sort';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      whichSort: ''
    }
  }
  render() {
    return (
      <div className="products-top">
        <Heading passNumItemDisplayed={this.props.passNumItemDisplayed} />
        <Sort whichSort={this.props.whichSort}/>
      </div>
    );
  }
}

export default Header;
