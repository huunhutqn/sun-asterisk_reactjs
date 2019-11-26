import React, { Component } from 'react';
import Filter from '../Filter';
import Products from '../Products';
import Bag from '../Bag';
import './style.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredItem: []
    };
    passFilteredItem = passFilteredItem.bind(this);
    isUpdateBag = isUpdateBag.bind(this)
  }
  render() {
    return (
      //React.Fragment nhóm các phần tử con mà không thêm node nào mới vào DOM
      <React.Fragment>
        <Filter passFilteredItem={passFilteredItem}/>
        <Products passFilteredItem={this.state.filteredItem} isUpdateBag={isUpdateBag} loading={this.refs.lds_ring}/>
        <Bag isUpdateBag={this.state.isUpdateBag}/>
      </React.Fragment>
    );
  }
}
function isUpdateBag(response) {
  if (response === 'yes') {
    let prevState = this.state;
    prevState.isUpdateBag = 'yes';
    this.setState(prevState);
  }
}
function passFilteredItem (childData) {
  if (childData.length > 0) {
    this.setState({
      filteredItem : childData
    });
  } else 
  this.setState({
    filteredItem : []
  });
}
export default App;