import React, { Component } from 'react';

import './style.scss';

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }
  render() {
    return (
      /* loading of https://loading.io/css/ */
      <div className="lds-ring" id="lds-ring"><div></div><div></div><div></div><div></div></div>
    );
  }
}

export default Loading;