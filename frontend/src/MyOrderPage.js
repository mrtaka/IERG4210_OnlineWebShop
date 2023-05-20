import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import sanitizeHtml from 'sanitize-html';

import "./style.css";
import { backend_url } from './config'

import Cookie from 'universal-cookie';


function MyOrderPage(props) {
    const [orders,setOrders] = useState([])
    const [products,setProducts] = useState([])

    let defaultorder = [{
        "OID": "no order",
        "UID": "no order",
        "PRODUCTLIST": [
            {
                PID: 0,
                quantity: 0,
                price: 0
            },
        ],
        STATUS: "Default",
        DATE: "Default"
    }]

    useEffect(()=>{
        let cookie = new Cookie();
        let auth = cookie.get('auth');
        const fetchAllOrders = async ()=>{
            try{
                const res = await axios.get(backend_url + "/order/getorders?auth=" + auth);
                if(res.data.success==false){
                    res.data.data = defaultorder;
                }
                setOrders(res.data.data);
                //console.log(res.data.data);
            }catch(err){
                console.log(err);
            }
        }
        fetchAllOrders();
        const fetchAllProducts = async ()=>{
            try{
                const res = await axios.get(backend_url + "/quote/");
                setProducts(res.data.data);
                //console.log(res.data.data);
            }catch(err){
                console.log(err);
            }
        }
        fetchAllProducts();
    },[])

    function getProduct(PID){
        var obj = products.find(item => item.PID == PID);
        if(obj != null){
            return obj;
        }
        else{
            obj = {
                NAME:"default", 
                PRICE: 0, 
                INVENTORY: 0,
                DESCRIPTION: "default",
                PID: 0,
                CID: 0
            };
            return obj;
        }
    }

    function getTotalofOrder(order){
        let totalprice = 0;
        order.PRODUCTLIST.forEach(item => {
            totalprice = totalprice + item.price * item.quantity;
        });
        if(totalprice <= 0){
            totalprice = 0;
        }
        return totalprice;
    }

    return(
        <div>
            <h1>All my personal purchase order list (recent 5 orders)</h1>

            <table class="table table-hover table-sm">
                <thead class="thead-dark">
                    <tr>
                        <th>OrderID</th>
                        <th>UserID</th>
                        <th>Product</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                {orders.map((order)=>(
                        <tr key ={order.OID}>
                            <td>{sanitizeHtml(order.OID)}</td>{/*context-dependent output sanitizations*/}
                            <td>{sanitizeHtml(order.UID)}</td>{/*context-dependent output sanitizations*/}
                            <td>
                                {/*product list details*/}
                                <table class="table table-warning table-hover table-sm">
                                    <thead class="thead-dark">
                                        <tr>
                                            <th>Item</th>
                                            <th>quantity</th>
                                            <th>price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {order.PRODUCTLIST.map((product)=>(
                                        <tr key ={product.PID}>
                                        <td>{product.PID}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.price}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </td>{/*context-dependent output sanitizations*/}
                            <td>{getTotalofOrder(order)}</td>{/*context-dependent output sanitizations*/}
                            <td>{sanitizeHtml(order.STATUS)}</td>{/*context-dependent output sanitizations*/}
                            <td>{sanitizeHtml(order.DATE)}</td>{/*context-dependent output sanitizations*/}
                        </tr>
                ))}
                </tbody>
            </table>

        </div>
    )
}

export default MyOrderPage;