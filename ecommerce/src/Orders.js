import React, { useEffect, useState } from 'react';
import { db } from "./firebase";
import { useStateValue } from "./StateProvider";
import Order from './Order';
import './Orders.css';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [{ basket, user}, dispatch] = useStateValue();

    useEffect(() => {
       if (user) {
           db
               .collection('users')
               .doc(user?.uid)
               .collection('orders')
               .orderBy('created', 'desc')
               .onSnapshot((snapshot) => {
                   setOrders(snapshot.docs.map((doc) => ({
                       id: doc.id,
                       data: doc.data()
                   })))
               })
       } else {
           setOrders([])
       }
    }, [user]);

    return (
        <div className='orders'>
            <h1>Your Orders</h1>

            <div className='orders_alert'>
                {orders.length === 0 ? <h2>No Orders</h2> : ''}
                {user ? '' : <h3>Not Currently Signed In</h3>}
            </div>

            <div className='orders_list'>
                {orders?.map((order) => (
                    <Order order={order} />
                ))}
            </div>
        </div>
    );
}

export default Orders;