
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css'
//Styling variables
const BLUE = "#172162"; //"rgb(23, 33, 98)";
const LIGHT_GREY = "#6e7484";
const BLACK = "#000000";


//First part given


const SUBTOTAL = 2094.97;
const HST = 272.3461;
const TOTAL = 2382.3161;
const ESTIMATED_DELIVERY = "Nov 24, 2021";



function App() {
  const [cart, setCart] = useState(localStorage.getItem('lineItems') ? JSON.parse(localStorage.getItem('lineItems')) : []);
  const [subtotal, setSubtotal] = useState(SUBTOTAL);
  const [hst, setHst] = useState(HST);
  const [total, setTotal] = useState(TOTAL);
  const [postalCode, setPostalCode] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState([]);

  useEffect(() => {
    const getLineItems = async () => {
      const { data } = await axios.get('/api/lineitems');
      setCart(data);
      localStorage.setItem('lineItems', JSON.stringify(data));
    };
    getLineItems();
  }, []);
  const removeLineItem = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
  }

  const addLineItem = (lineItem) => {
    const newCart = [...cart, lineItem];
    setCart(newCart);
  }

  useEffect(() => {
    const calcualteFees = () => {
      const shipping = 15.0;
      const newSubtotal = cart.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0).toFixed(2);

      setSubtotal(newSubtotal);
      const newHst = (subtotal * 0.13).toFixed(2);
      setHst(newHst);
      const newTotal = (parseFloat(subtotal) + parseFloat(newHst) + parseFloat(shipping)).toFixed(2);
      setTotal(newTotal);
    };
    calcualteFees();
  }, [cart, subtotal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const { data } = await axios.post('/api/lineitems', {
      postalCode,
    }, config);
    setEstimatedDelivery(data);
    setPostalCode('');
  }
  console.log(estimatedDelivery);
  return (
    <div className='App'>
      <h1 className='title'>Your Cart</h1>
      <div className='cart-container'>
        {cart.map(item => (
          <div key={item.id} className='items'>
            <div className='item'>
              <img className='item-image' src={item.image} alt={item.title} />
              <div>
                <h2><span className='color-text'>{item.swatchTitle}</span>/{item.title}/{item.quantity}</h2>
                <div className='color-container'>
                  <div style={{ backgroundColor: `${item.swatchColor}` }} className='color'></div>
                  <p>{item.swatchTitle}</p>
                </div>

              </div>

            </div>

            <div className='sidebar'>
              <p>${item.price}</p>
              {estimatedDelivery?.map(del => (
                del.ids?.map(id => {
                  if (id === item.id) {
                    return <p>Estimated Delivery Date: {del.estimatedDeliveryDate}</p>
                  }
                }
                )
              ))}
              <button button className='btn' onClick={() => removeLineItem(item.id)}>Remove</button>
            </div>
          </div>
        )

        )
        }
      </div>

      <div className='total'>
        <div>
          <p>Subtotal:</p>
          <p>Taxes(estimated):</p>
          <p>Shipping:</p>
          <p>Total:</p>
        </div>
        <div>
          <p>${subtotal}</p>
          <p>${hst}</p>
          <p>$15.00</p>
          <p>${total}</p>
        </div>


      </div>

      <div>
        <form onSubmit={handleSubmit}>
          <label className='form-label'> Enter Your Postal Code: </label>
          <input type='text' value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
          <button className='form-btn'>Send</button>
        </form>

      </div>
    </div >
  );
}

export default App;
