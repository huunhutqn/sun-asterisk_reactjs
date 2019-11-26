import React, { Component } from 'react';
import Header from './Header';
import ProductsList from './ProductsList';

import './style.scss';

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numItemDisplayed: 0,
      whichSort: 'default'
    };
    this.tmpNum = 0;
    this.passNumItemDisplayed = this.passNumItemDisplayed.bind(this);
    this.whichSort = this.whichSort.bind(this);
  }
  passNumItemDisplayed (childData) {
    if(this.state.numItemDisplayed !== childData) {
      this.tmpNum = childData;
      this.setState({
        numItemDisplayed : childData,
      });
    }
  }
  whichSort(value) {
    let prevState = this.state;
    prevState.whichSort = value;
    this.setState(prevState)
  }
  render() {
    return (
      <div className="products">
        <Header passNumItemDisplayed={this.state.numItemDisplayed} whichSort={this.whichSort}/>
        <ProductsList
          passNumItemDisplayed={this.passNumItemDisplayed}
          passFilteredItem={this.props.passFilteredItem} 
          whichSort={this.state.whichSort}
          isUpdateBag={this.props.isUpdateBag}
        />
      </div>
    );
  }
}

export default Products;