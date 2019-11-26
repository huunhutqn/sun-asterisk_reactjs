import React, { Component } from 'react';

import './style.scss';

const url = "http://localhost:3300/";

class ProductsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      statusLoading: 'ready',
      last: 'null',
      filtered: false,
      lastLength: 0
    };
    Element = Element.bind(this);
    makeFilteredItemUrl = makeFilteredItemUrl.bind(this);
    howSort = howSort.bind(this);
    loading = loading.bind(this);
  }

  componentDidMount() {
    if(this.state.statusLoading === 'ready' && this.state.last === 'null' && this.state.filtered === false) {
    loading('show');
    fetch('http://localhost:3300/products')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            products: result,
            statusLoading: 'ready',
            last: 'null',
            filtered: false,
            lastLength: 0
          });
        },
        (error) => {
          console.log(error)
        }
      )
      .then(
        setTimeout(() => {
          loading('hide')
        }, 300)
      )
    }
  }

  countItemDisplayed = (count) => {
    this.props.passNumItemDisplayed(count)
  }

  componentDidUpdate(prevProps, prevState) {
    
    if (prevState.lastLength !== this.props.passFilteredItem.length) {
      makeFilteredItemUrl(this.props.passFilteredItem);
      if(this.state.products.length >= 1) {
        if(this.state.statusLoading === 'loading') {
          this.props.passNumItemDisplayed(this.state.products.length);
        }
      } 
    }
    if (prevProps.whichSort !== this.props.whichSort) {
      prevState.products = howSort(prevState.products);
      this.setState(prevState);
    }
    
      if (this.props.passFilteredItem.length === 0 && prevState.lastLength === 1) {
        loading('show');
        fetch('http://localhost:3300/products')
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                products: howSort(result),
                statusLoading: 'ready',
                last: 'null',
                filtered: false,
                lastLength: 0
              });
            },
            (error) => {
              console.log(error)
            }
          )
          .then(
            setTimeout(() => {
              loading('hide')
            }, 300)
          )
      }
  }
  checkNoProduct(productLenght) {
    if (productLenght === 0 && this.state.statusLoading === 'loading') {
      this.props.passNumItemDisplayed(0);
    }
  }
  
  handleAddToCard(product, e) {
    let bag = localStorage.getItem('bag');
    if (bag) {
      //bag da co
      bag = JSON.parse(bag);
      //1. kiem tra id product da ton tai hay chua
      let bagProductsNew = () => {
        for (const key in bag.products) {
          ///neu ton tai thi tang quanity len 1
          if (bag.products[key].id === product.id) {
            bag.products[key].quanity++;
            bag.total.price = parseFloat(Number(bag.total.price + product.price).toFixed(2));
            // bag.total.price.round(2);
            break;
          } ///neu chua co product trong local thi push vao cuoi vong lap
          else if(bag.products.length - key === 1) {
            product.quanity = 1;
            bag.products.push(product);
          }
        }
        return bag.products;
      }
      bag.products = bagProductsNew();
      bag.total.quanity++;
      if (product.installments > bag.total.installments) {
        bag.total.installments = product.installments;
      }
      bag.total.price = parseFloat(Number(bag.total.price + product.price).toFixed(2));
      localStorage.setItem('bag', JSON.stringify(bag));
    } else {
      // chua co bag
      product.quanity = 1;
      bag = {'products': [product], 'total': {'quanity': 1,
                                              'installments': product.installments,
                                              'price': product.price,
                                              'currencyId': product.currencyId,
                                              'currencyFormat': product.currencyFormat
                                              }};
      bag = JSON.stringify(bag);
      localStorage.setItem('bag', bag)
    }
    //thong bao cho bag vua co du lieu moi
    this.props.isUpdateBag('yes');
  }

  render() {
    return (
      <div className="products-main">
        <div className="products-main__container">
        <div className="lds-ring" id="lds-ring" ref="lds_ring"><div></div><div></div><div></div><div></div></div>
          {this.checkNoProduct(this.state.products.length)}
          {this.state.products.map((product,index) => {
            return <Element 
                          key={index}
                          product={product}
                          index={index}
                          length={this.state.products.length}
                          countItemDisplayed={this.countItemDisplayed}/>
          })}
          <div className="products-main__item-last"></div>
          <div className="products-main__item-last"></div>
          <div className="products-main__item-last"></div>
        </div>
      </div>
    );
  }
}
function loading(how) {
  if (how === 'show') {
    this.refs.lds_ring.style.display = 'block';
  } else {
    this.refs.lds_ring.style.display = 'none';
  }
}
function howSort(products) {
  let how = this.props.whichSort;
  let newProducts = products;
  switch (how) {
    case 'increment':
      // sap xep tang dan
      newProducts.sort(function(a, b){return a.price - b.price});
      break;

    case 'decrement':
      newProducts.sort(function(a, b){return b.price - a.price});
      break;
  
    default:
      return newProducts
  }
  return newProducts
}
function makeFilteredItemUrl(filteredItem) {
  let filteredItemUrl = "";
  if(filteredItem.length > 0) {
    if(filteredItem.length === 1 && this.state.last === 'null') {
      filteredItem.forEach((sizeValue,index) => {
        filteredItemUrl += sizeValue;
      });
      if(!this.state.filtered && this.state.last !== 'one') {
        loading('show');
        fetch('http://localhost:3300/products?availableSizes_like='+filteredItemUrl)
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              products: howSort(result),
              statusLoading: 'loading',
              last: 'one',
              filtered: true,
              lastLength: filteredItem.length
            });
          },
          (error) => {
            console.log(error)
          }
        )
        .then(
          setTimeout(() => {
            loading('hide')
          }, 300)
        );
      }
    } if(this.state.filtered && filteredItem.length === 2 && this.state.last !== 'many') { // neu > 2
      filteredItem.forEach((sizeValue,index) => {
        if(filteredItem.length-index !== 1 ) {
          filteredItemUrl += sizeValue + '|';
        } else filteredItemUrl += sizeValue;
      });
      if (this.state.filtered) {
        loading('show');
        fetch('http://localhost:3300/products?availableSizes_like='+filteredItemUrl)
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              products: howSort(result),
              statusLoading: 'loading',
              last: 'many',
              filtered: true,
              lastLength: filteredItem.length
            });
          },
          (error) => {
            console.log(error)
          }
        )
        .then(
          setTimeout(() => {
            loading('hide')
          }, 300)
        );
      }
    } if(this.state.filtered && filteredItem.length === 2 && this.state.last === 'many') { // neu > 2
      filteredItem.forEach((sizeValue,index) => {
        if(filteredItem.length-index !== 1 ) {
          filteredItemUrl += sizeValue + '|';
        } else filteredItemUrl += sizeValue;
      });
      if (this.state.filtered) {
        loading('show');
        fetch('http://localhost:3300/products?availableSizes_like='+filteredItemUrl)
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              products: howSort(result),
              statusLoading: 'loading',
              last: 'many',
              filtered: true,
              lastLength: filteredItem.length
            });
          },
          (error) => {
            console.log(error)
          }
        )
        .then(
          setTimeout(() => {
            loading('hide')
          }, 300)
        );
      }
    }
    if(this.state.filtered && filteredItem.length === 1 && this.state.last === 'one') {
      filteredItem.forEach((sizeValue,index) => {
        filteredItemUrl += sizeValue;
      });
      if(this.state.filtered && this.state.last !== 'one') {
        loading('show');
        fetch('http://localhost:3300/products?availableSizes_like='+filteredItemUrl)
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              products: howSort(result),
              statusLoading: 'loading',
              last: 'one',
              filtered: true,
              lastLength: filteredItem.length
            });
          },
          (error) => {
            console.log(error)
          }
        )
        .then(
          setTimeout(() => {
            loading('hide')
          }, 300)
        );
      }
    } if(filteredItem.length === 1 && this.state.last === 'many') {
      filteredItem.forEach((sizeValue,index) => {
        filteredItemUrl += sizeValue;
      });
      if(this.state.filtered && this.state.last !== 'one') {
        loading('show');
        fetch('http://localhost:3300/products?availableSizes_like='+filteredItemUrl)
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              products: howSort(result),
              statusLoading: 'loading',
              last: 'one',
              filtered: true,
              lastLength: filteredItem.length
            });
          },
          (error) => {
            console.log(error)
          }
        )
        .then(
          setTimeout(() => {
            loading('hide')
          }, 300)
        );
      }
    } if(this.state.filtered === true && filteredItem.length >= 3 && this.state.last === 'many') { // neu > 2
      filteredItem.forEach((sizeValue,index) => {
        if(filteredItem.length-index !== 1 ) {
          filteredItemUrl += sizeValue + '|';
        } else {
          filteredItemUrl += sizeValue;
        }
      });
      if (this.state.filtered) {
        loading('show');
        fetch('http://localhost:3300/products?availableSizes_like='+filteredItemUrl)
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              products: howSort(result),
              statusLoading: 'loading',
              last: 'many',
              filtered: true,
              lastLength: filteredItem.length
            });
          },
          (error) => {
            console.log(error)
          }
        )
        .then(
          setTimeout(() => {
            loading('hide')
          }, 300)
        );
      }
    }
  }
}

function Element(props) {
  const { product } = props;

  if(this.state.products.length >= 1) {
    if(this.state.statusLoading === 'ready') {
      if((this.state.products.length - props.index) === 1) {
        props.countItemDisplayed(this.state.products.length);
      }
    }
  }
  
  function isShipping(value) {
    if(value === true) {
      return (
        <div className="products-main__item--label-shipping">
          <label className="products-main__item--label-shipping__text">Free shipping</label>
        </div>
      )
    }
  }
  function convertPrice(value) {
    const price = parseFloat(value).toFixed(2).toString() + "";
    const afterDec = price.slice(price.indexOf('.'));
    const beforeDec = price.substring(price.indexOf('.'),0);
    return (
      <React.Fragment>
        <span className="products-main__item--price__int">{beforeDec}</span>
        <span className="products-main__item--price__dec">{afterDec}</span>
      </React.Fragment>
    )
  }
  function isInstallments(installments,currencyFormat,price) {
    if(installments > 0)
    return (
      <React.Fragment>
        <span className="products-main__item--price-installments__text">or</span>
        <span className="products-main__item--price-installments__num">{installments}</span>
        <span className="products-main__item--price-installments__text">x</span>
        <span className="products-main__item--price-installments__unit">{currencyFormat}</span>
        <span className="products-main__item--price-installments__once">{parseFloat(price/installments).toFixed(2)}</span>
      </React.Fragment>
    )
  }
  return (
    <div className="products-main__item">
      <div className="products-main__item--image">
        <img src={`images/products/${product.sku}_1.jpg`} alt=""/>
      </div>
      {isShipping(product.isFreeShipping)}
      <div className="products-main__item--name">
        <h4 className="products-main__item--name__text">
          {product.title}
        </h4>
      </div>
      <div className="products-main__item--hr"></div>
      <div className="products-main__item--price">
        <span className="products-main__item--price__unit">{product.currencyFormat}</span>
        {convertPrice(product.price)}
      </div>
      <div className="products-main__item--price-installments">
        {isInstallments(product.installments,product.currencyFormat,product.price)}
      </div>
      <div className="products-main__item--add-to-bag">
        <button className="products-main__item--add-to-bag__btn" onClick={this.handleAddToCard.bind(this, product)}>
          <span className="products-main__item--add-to-bag__btn__text">
            Add to cart
          </span>
        </button>
      </div>
    </div>
  );
}

export default ProductsList;