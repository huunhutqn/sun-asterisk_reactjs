import React, { Component } from 'react';

import './style.scss';

class Bag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: false,
      bag: JSON.parse(localStorage.getItem('bag'))
    };
    countInBag = countInBag.bind(this)
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.isUpdateBag === 'yes') {
      let newBag = JSON.parse(localStorage.getItem('bag'));
      if (!prevState.bag) {
        console.log('new bag: ',newBag);
        console.log('old bag: ',prevState.bag);
        if (prevState.bag !== newBag) {
          prevState.bag = JSON.parse(localStorage.getItem('bag'));
          this.setState(prevState);
        }
      } else {
        console.log('kiem tra nao ',prevState.bag);
        console.log('kiem tra new bag nao ',newBag);
        if (prevState.bag.total.quanity !== newBag.total.quanity) {
          prevState.bag = JSON.parse(localStorage.getItem('bag'));
          this.setState(prevState);
        }
      }
    }
  }
  showBag() {
    let bag = this.refs.bag;
    let showBag = this.refs.bag__btn_show;
    let hideBag = this.refs.bag__btn_hide;
    if(getComputedStyle(bag).width === "320px") {
      this.setState({isMobile:true})
    } else this.setState({isMobile:false})
    bag.style.transform = "translate(0px, 0px)";
    showBag.style.display = "none";
    hideBag.style.display = "block";
  }
  hideBag() {
    let bag = this.refs.bag;
    let showBag = this.refs.bag__btn_show;
    let hideBag = this.refs.bag__btn_hide;
    if(this.state.isMobile) {
      bag.style.transform = "translate(320px, 0px)";
    } else bag.style.transform = "translate(450px, 0px)";
    showBag.style.display = "block";
    hideBag.style.display = "none";
  }
  removeProductFromBag(productId, event) {
    let bag = this.state.bag;
    if (bag.products.length === 1) {
      let prevState = this.state;
      localStorage.removeItem('bag');
      prevState.bag = JSON.parse(localStorage.getItem('bag'));
      this.setState(prevState);
    } else
    for (let index in bag.products) {
      if (bag.products[index].id === productId) {
        // cap nhat total price
        bag.total.price -= (bag.products[index].price * bag.products[index].quanity);
        // cap nhat lai total quanity
        bag.total.quanity -= bag.products[index].quanity;
        // xoa product ra khoi
        bag.products.splice(index,1);
        // cap nhat lai total installments
        bag.total.installments = 0;
        for (let product of bag.products) {
          if (product.installments > bag.total.installments) {
            bag.total.installments = product.installments;
          }
        }
        // 2/ set lai state
        let prevState = this.state;
        prevState.bag = bag;
        localStorage.setItem('bag', JSON.stringify(bag));
        this.setState(prevState);
        // out loop
        break;
      }
    }
    
  }
  calInBag() {
    if (this.state.bag) {
      const bag = this.state.bag;
      if (bag.total) {
        if (bag.total.price) {
          return (
            <React.Fragment>
              <span className="bag__content--subtotal__text__price--final">{bag.total.currencyFormat} <span>{bag.total.price.toFixed(2)}</span></span>
              <span className="bag__content--subtotal__text__price--installments">
                <span>OR UP TO</span> {bag.total.installments} <span>x</span> <span>{bag.total.currencyFormat}</span> {parseFloat(bag.total.price / bag.total.installments).toFixed(2)}
              </span>
            </React.Fragment>
          )
        }
      } else {
        return (
          <React.Fragment>
            <span className="bag__content--subtotal__text__price--final"><span>00.00</span></span>
            <span className="bag__content--subtotal__text__price--installments">
            </span>
          </React.Fragment>
        )
      }
    } else {
      return (
        <React.Fragment>
          <span className="bag__content--subtotal__text__price--final"><span>00.00</span></span>
          <span className="bag__content--subtotal__text__price--installments">
          </span>
        </React.Fragment>
      )
    }
  }
  getProductFromLocalstorage() {
    if (this.state.bag) {
      if (this.state.bag.products) {
        const products = this.state.bag.products;
        return (
          <React.Fragment>
          {products.map((product, index) => {
            return (
              <div key={index} className="bag__content--list__item">
                <button className="bag__content--list__item__remove" onClick={this.removeProductFromBag.bind(this, product.id)}>
                  <span>x</span>
                </button>
                <div className="bag__content--list__item__image">
                  <img src={`images/products/${product.sku}_2.jpg`} alt=""/>
                </div>
                <div className="bag__content--list__item__desc">
                  <span>{product.title}</span>
                  <span>{product.availableSizes[0]} | {product.style}</span>
                  <span>Quantity: {product.quanity}</span>
                </div>
                <div className="bag__content--list__item__price">
                  <div className="--text"><span>{product.currencyFormat}</span><span> {parseFloat(product.price * product.quanity).toFixed(2)}</span></div>
                </div>
              </div>
            )
          })}
          </React.Fragment>
        )
      } else return (
        <div className="bag__content--list__item">
          <span>Your bag is empty! :)</span>
        </div>
      )
    } else return (
      <div className="bag__content--list__item">
        <span>Your bag is empty! :)</span>
      </div>
    );
  }
  checkout = () => {
    if(this.state.bag) {
      // do sth on checkout
      alert('You bought total: $ ' + this.state.bag.total.price.toFixed(2));
    } else {
      // nothing to checkout
      alert('Nothing to checkout! :)')
    }
  }
  render() {
    return (
      <div className="bag" id="bag" ref="bag">
        <button className="bag__btn">
          <div className="bag__btn--show" id="bag__btn--show" ref="bag__btn_show" onClick={this.showBag.bind(this)} >
            <img src="images/bag-icon.png" alt=""/>
            {countInBag('bag__btn--show__count')}
          </div>
          <div className="bag__btn--hide" id="bag__btn--hide" ref="bag__btn_hide" onClick={this.hideBag.bind(this)} >
            <span>X</span>
          </div>
        </button>
        <div className="bag__content">
          <div className="bag__content--icon">
            <img src="images/bag-icon.png" alt=""/>
            {countInBag('bag__content--icon__count')}
            <span className="bag__content--icon__text">Bag</span>
          </div>
          <div className="bag__content--list">
            {/* neu co du lieu trong localstorage thi chay vong lap lay du lieu ra */}
            {this.getProductFromLocalstorage()}
          </div>
          <div className="bag__content--subtotal">
            <div className="bag__content--subtotal__text">
              <div>SUBTOTAL</div>
              <div className="bag__content--subtotal__text__price">
                {this.calInBag()}
              </div>
            </div>
            <button className="bag__content--subtotal__checkout" onClick={this.checkout}>
              <span className="bag__content--subtotal__checkout__text">CHECKOUT</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
function countInBag(inClass) {
  if (this.state.bag) {
    if (this.state.bag.products) {
      return (
        <span className={inClass}>{this.state.bag.total.quanity}</span>
      );
    } else return (
      <span className={inClass}>0</span>
    );
  } else return (
    <span className={inClass}>0</span>
  );
}

export default Bag;