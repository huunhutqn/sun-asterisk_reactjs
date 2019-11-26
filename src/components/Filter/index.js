import React, { Component, useState } from 'react';

import './style.scss';

const availableSizes = ["XS","S","M","ML","L","XL","XXL"];

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      whatChecked: []
    };
  }
  toggleCheckboxChange(value,action) {
    const prevState = this.state;
    if(action === 'check') {
      let newState = pushIntoState(prevState,value);
      this.setState(() => ({
        whatChecked: newState
      }));
      this.sendFilterdItem(newState);
    } 
    else {
      let newState = spliceFromState(prevState,value);
      this.setState(() => ({
        whatChecked: newState
      }));
      this.sendFilterdItem(newState);
    }
  }
  showSizes(list) {
    return (
      list.map((sizes) => <ListItem key={sizes} value={sizes} toggle={this.toggleCheckboxChange.bind(this)}/>)
    )
  }
  sendFilterdItem = (data) => {
    this.props.passFilteredItem(data);
  }
  render() {
    return (
      <div className="filter">
        <h4>Sizes:</h4>
        {this.showSizes(availableSizes)}
        <div className="desc">
          <p>
            {`Leave a star on Github if this repository was useful :))~`}
          </p>
          {/* <!-- Place this tag where you want the button to render. --> */}
          <a className="github-button" href="https://github.com/huunhutqn/sun-asterisk_reactjs" aria-label="Star me/github-buttons on GitHub">Star</a>
        </div>
      </div>
    );
  }
}

function pushIntoState(state,value) {
  state.whatChecked.push(value);
  return state.whatChecked;
}
function spliceFromState(state,value) {
  state.whatChecked.map((valueInArr,index) => {
    if (valueInArr === value) {
      state.whatChecked.splice(index,1);
    }
  });
  return state.whatChecked;
}

function ListItem(props) {
  // Declare a new state variable, which we'll call "isChecked"
  const [isChecked, setIsChecked] = useState(false);
  return (
    <div className="filter__available__sizes">
      <label className="filter__available__sizes__item">
        <input
          type="checkbox"
          value={props.value}
          check={isChecked.toString()}
          onChange={() => {
            setIsChecked(!isChecked);
            // neu da chon thi pass value len component
            if(!isChecked)
              props.toggle(props.value,"check");
            else 
              props.toggle(props.value,"uncheck")
          }}
        />
        <span className="filter__available__sizes__item__text">
          {props.value}
        </span>
      </label>
    </div>
  );
}

export default Filter;