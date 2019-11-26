import React, { Component } from 'react';

class Sort extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }
  handleSort(event) {
    this.props.whichSort(event.target.value);
  }
  render() {
    return (
      <div className="products-top__sort">
        <span className="products-top__sort__text">Order by</span>
        <select className="products-top__sort__select"
                name="sort-list" ref="products_top__sort__select"
                onChange={this.handleSort.bind(this)}>
          <option value="default">Select</option>
          <option value="increment">Lowest to highest</option>
          <option value="decrement">Highest to lowest</option>
        </select>
      </div>
    );
  }
}

export default Sort;