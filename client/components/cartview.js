import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import SingleCartItem from './singlecartitem'
import TakeMoney from './takemoney'
import {getItemsThunk} from '../store/item'
import {getClosedOrdersThunkCreator} from '../store/order'

class CartView extends Component {
  constructor() {
    super()
    this.handleRemoveFromCart = this.handleRemoveFromCart.bind(this)
    this.handleCheckout = this.handleCheckout.bind(this)
    this.handleUpdateCartView = this.handleUpdateCartView.bind(this)
  }

  componentDidMount() {
    this.props.loadAllItems()
  }

  async handleRemoveFromCart(itemId) {
    // if user.id, means we are logged in
    if (this.props.user.id) {
      const removedItem = await axios.put(
        `/api/orders/remove/${this.props.user.id}`,
        {itemId: +itemId}
      )
    }

    // remove from localStorage as well
    // get the json object from localStorage
    const currentCart = JSON.parse(localStorage.cart)
    // delete the key pair from cart object
    delete currentCart[itemId]
    // reset the cart to stringify
    localStorage.cart = JSON.stringify(currentCart)
    // causes a re-render without the shouldComponentMount lifecycle hook
    this.forceUpdate()
  }

  async handleCheckout() {
    if (localStorage.cart) {
      if (this.props.user.id) {
        try {
          const {data} = await axios.put(
            `/api/orders/checkout/${this.props.user.id}`
          )
        } catch (error) {
          console.error(error)
        }
      }
      // handle totalCost charge
      localStorage.clear()
      this.forceUpdate()
      this.props.loadAllOrders(this.props.user.id)
    }
  }

  handleUpdateCartView() {
    this.forceUpdate()
  }

  render() {
    const {items} = this.props

    let cartItems
    let cartItemsData
    let cartTotal

    if (localStorage.cart) {
      // get the keys of localStorage cart
      cartItems = JSON.parse(localStorage.cart)
      const cartItemsIds = Object.keys(cartItems)
      //  filter all the item from local storage key array
      cartItemsData = items.filter(item =>
        cartItemsIds.includes(String(item.id))
      )
      // calculate the total price of all items in cart
      cartTotal = cartItemsData.reduce(
        (acc, item) => acc + item.price * cartItems[item.id],
        0
      )
    }
    return (
      <div>
        <h3>This is your cart:</h3>
        <br />
        <div>
          {cartItemsData ? (
            cartItemsData.length ? (
              cartItemsData.map(item => {
                return (
                  <div key={item.id}>
                    <SingleCartItem
                      item={item}
                      handleRemoveFromCart={this.handleRemoveFromCart}
                      handleUpdateCartView={this.handleUpdateCartView}
                    />
                    <br />
                    <progress
                      className="nes-progress is-success"
                      value="0"
                      max="100"
                      style={{height: '0.5vh'}}
                    />
                    <br />
                    <br />
                  </div>
                )
              })
            ) : (
              <div>Your cart is Empty.</div>
            )
          ) : (
            <div>Your cart is Empty.</div>
          )}
        </div>
        <br />
        <br />
        <div>
          Total: ${cartTotal ? (cartTotal / 100).toFixed(2) : (0).toFixed(2)}
        </div>
        <br />
        <br />
        <TakeMoney
          product={items[0]}
          handleCheckout={this.handleCheckout}
          total={cartTotal ? cartTotal : 0}
        />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    )
  }
}

const mapState = state => {
  return {
    user: state.user,
    items: state.item
  }
}

const mapDispatch = dispatch => {
  return {
    loadAllItems() {
      dispatch(getItemsThunk())
    },
    loadAllOrders(userId) {
      dispatch(getClosedOrdersThunkCreator(userId))
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default connect(mapState, mapDispatch)(CartView)
