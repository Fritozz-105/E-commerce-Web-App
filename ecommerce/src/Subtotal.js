import React, { useState } from 'react';
import { useStateValue } from './StateProvider';
import { getBasketTotal } from './reducer';
import { useHistory } from "react-router-dom";
import CurrencyFormat from 'react-currency-format';
import './Subtotal.css';

function Subtotal() {
    const [{ basket }, dispatch] = useStateValue();
    const history = useHistory();

    return (
      <div className='subtotal'>
          <CurrencyFormat
            renderText={(value) => (
                <>
                    <p>
                        Subtotal ({basket?.length} items): <strong>{value}</strong>
                    </p>
                    <small className='subtotal_gift'>
                        <input type='checkbox' /> This order contains a gift
                    </small>
                </>
            )}
            decimalScale={2}
            value={getBasketTotal(basket)}
            displayType={'text'}
            thousandSeparator={true}
            prefix={'$'}
          />

          <button disabled={basket.length === 0} onClick={(e) => history.push('/payment')}>
              Proceed to Checkout
          </button>
      </div>
    );
}

export default Subtotal;