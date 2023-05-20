import React from 'react';
import "./style.css";
import Cookie from 'universal-cookie';

//for shoplist
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

//for paypal
import {PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
//import Cookie from 'universal-cookie';

import { backend_url } from './config'

function CheckoutPage(props){
    const [email,setEmail] = useState(["Guest"])

    useEffect(()=>{
        const getEMAIL = async ()=>{
            try{
                let cookie = new Cookie();
                let auth = cookie.get('auth');

                const res = await axios.post(backend_url + "/auth/getemail", { "auth": auth});
                if (res.data.success) {
                    setEmail(res.data.data);
                }
                else {
                    console.log("fail get Email")
                    setEmail("Guest");
                }
            }catch(err){
                setEmail("Guest");
                console.log(err);
            }
        }
        getEMAIL();
    },[])

    return (
        <>
            {email=="Guest"?
            <p>Please login to pay for the shopping cart</p>
            :
            <>
            <p>Here is the checkout list, welcome {email}</p>
            <ShopList/>
            </>
            }
        </>
    );
};

function timeout(delay) {
    return new Promise( res => setTimeout(res, delay) );
}

function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update state to force render
    // A function that increment 👆🏻 the previous state like here 
    // is better than directly setting `setValue(value + 1)`
}

function ShopList(props){

    const forceUpdate = useForceUpdate();

    const [Shoplist,setShoplist] = useState([])
    //const [Orderlist,setOrderlist] = useState([])
    const [products,setProducts] = useState([])

    useEffect(()=>{
        const fetchAllProducts = async ()=>{
            try{
                const res = await axios.get(backend_url + "/quote/");
                setProducts(res.data.data);
            }catch(err){
                console.log(err);
            }
        }
        fetchAllProducts();

        let Templist = JSON.parse(localStorage.getItem("Shoplist"));
        if(Templist == null){//if no shoplist, create one
            Templist = [];
        }
        setShoplist(Templist);
    },[])


    function getProduct(PID){
            var obj = products.find(item => item.PID == PID);
            if(obj != null){
                return obj;
            }
            else{
                obj = {
                    NAME:"error", 
                    PRICE: 0, 
                    INVENTORY: 0,
                    DESCRIPTION: "error",
                    PID: 0,
                    CID: 0
                };
                return obj;
            }
    }

    function getTotal(){
            let totalprice = 0;
            Shoplist.forEach(item => {
                totalprice = totalprice + getProduct(item.PID).PRICE * item.quantity;
            });
            if(totalprice <= 0){
                totalprice = 0;
            }
            return totalprice;
    }

    const handleChange = (event) => {
        let deleteItem = 0;

        Shoplist.forEach(item => {//if have that item on shoplist, change quantity
            if (item.PID == event.target.id){//find the update item
                if(event.target.value == 0){ 
                      deleteItem = event.target.id; //find the index to delete item
                }
                else{
                item.quantity = Number(event.target.value); //update quantity
                }
            }
        });

        if(deleteItem != 0){//delte item from shoplist
            const indexOfItem = Shoplist.findIndex(object => {return object.PID == event.target.id});
            Shoplist.splice(indexOfItem,1);
        }

        //update data on local storage
        let Shoplist_json = JSON.stringify(Shoplist);
        localStorage.setItem("Shoplist", Shoplist_json);
        forceUpdate();
    };

    function processOrder(orderId){

        //copy shoplist to orderlist
        //setOrderlist(Shoplist);
        let Orderlist = [];

        //console.log(OrderItem);
        //console.log(Shoplist);
        Shoplist.forEach(item => {//add PID, quantity, newest price on the orderlist
            let OrderItem = {PID: 0, quantity: 0, price: 0};
            OrderItem.PID = item.PID;
            OrderItem.quantity = item.quantity;
            OrderItem.price = getProduct(item.PID).PRICE;
            console.log(OrderItem);
            Orderlist.push(OrderItem);
        });

        console.log(Orderlist);

        //update data on local storage
        let Orderlist_json = JSON.stringify(Orderlist);
        localStorage.setItem(orderId, Orderlist_json);
        //forceUpdate();
    };

    const completePayment =  async (details) => {

        let Order = {
            auth: "Error",
            PRODUCTLIST: "Error",
            STATUS: "Error",
            DATE: "Error"
        };

        //let PRODUCTLIST = JSON.parse(localStorage.getItem(details.id));
        let PAYPALLIST = details.purchase_units[0].items;
        let PRODUCTLIST = [];

        PAYPALLIST.forEach(paypalitem => {//add PID, quantity, newest price on the orderlist
            let OrderItem = {PID: 0, quantity: 0, price: 0};

            OrderItem.PID = paypalitem.name;
            OrderItem.quantity = paypalitem.quantity;
            OrderItem.price = paypalitem.unit_amount.value;
            PRODUCTLIST.push(OrderItem);
        });

        console.log("PRODUCTLIST is:", PRODUCTLIST)

        let cookie = new Cookie();
        Order.auth = cookie.get('auth');
        Order.PRODUCTLIST = PRODUCTLIST;
        Order.STATUS = details.status;
        Order.DATE = details.update_time;

        try{
            alert("MSG: Transaction completed by " + details.payer.name.given_name)
            await axios.post(backend_url + "/order/createorder", Order);
            //remove success payorder
            localStorage.removeItem(details.id);
            //clear shopping cart
            localStorage.removeItem("Shoplist");
            await timeout(1000);
            window.location.href="/";  
        }catch(err){
            console.log(err);
        }

    }

    function getPayPalItems(){
        let PayPalItemList = [];

        Shoplist.forEach(item => {//add PID, quantity, newest price on the orderlist
            let OrderItem = {
                name: "1:Product1",
                PID: 0,
                unit_amount: {
                  currency_code: 'USD',
                  value: 1
                },
                quantity: 1
            }
            OrderItem.name = getProduct(item.PID).NAME;
            OrderItem.PID = item.PID;
            OrderItem.unit_amount.value = getProduct(item.PID).PRICE;
            OrderItem.quantity = item.quantity;
            console.log(OrderItem);
            PayPalItemList.push(OrderItem);
        });

        return PayPalItemList;
    }

    // <div class="shoplist" ><button type="button" class="btn btn-outline-light"> Shopping List  ${getTotal()} </button></div>
    //<div class="col-12"><center><button type="button" onClick={checkout} class="btn btn-outline-primary">Checkout</button></center></div>


    return (
        <>
            <div  class="card" style={{margin: 50, padding:25}}>
                {Shoplist.map((items)=>(
                        <div key ={items.PID}>
                            <div class="row">
                                <div class="col-7" ><p class="shoplist_word">{getProduct(items.PID).NAME}</p></div>
                                <div class="col-2 input-group-sm" ><input type="number" id={items.PID} defaultValue={items.quantity} onChange={handleChange} class="form-control" aria-label="quantity" min="0" max="100"></input></div>
                                <div class="col-3" ><p class="shoplist_word">${getProduct(items.PID).PRICE*items.quantity}</p></div>
                            </div>
                            <hr></hr>
                        </div>
                    ))}
                <div class="row">
                    <div class="col-7"><p>Total price</p></div>
                    <div class="col-2"></div>
                    <div class="col-3"><p>USD${getTotal()}</p></div>
                </div>
                <hr></hr>
                <div class="row">
                        <PayPalScriptProvider options={{
                            "client-id": "AaP_etD0XH1oNTdArsVWB5ez_7c1TGM270s0lqS5LoK0TM4gdH1F63koI5JshxIKEeLd9m413hKcepvd"}}>
                            {getTotal() == 0 ? <p>There is no item on shopping cart, please add some to continue</p>:
                            <PayPalButtons
                                style={{layout: "vertical"}}
                                disabled={false}
                                forceReRender={[getTotal(),'USD',"vertical"]}
                                fundingSource={undefined}
                                createOrder={(data, actions) => {
                                    return actions.order.create(
                                        {
                                            purchase_units: [
                                              {
                                                amount: {
                                                  currency_code: 'USD',
                                                  value: getTotal(),
                                                  breakdown: {
                                                    item_total: {
                                                      currency_code: 'USD',
                                                      value: getTotal()
                                                    }
                                                  }
                                                },
                                                items: getPayPalItems()
                                              }
                                            ]
                                          }
                                        )
                                        .then((orderId) => {
                                            // Your code here after create the order
                                            console.log("create temper order ID: ",orderId);
                                            //processOrder(orderId);
                                            return orderId;
                                        });
                                }}
                                onApprove={function (data, actions) {
                                    return actions.order.capture().then(function (details) {
                                        // Your code here after capture the order
                                        console.log("complete paypal transition");
                                        console.log(details);
                                        completePayment(details);

                                    });
                                }}
                            />
                            }

                        </PayPalScriptProvider>
                </div>
            </div>
        </>
    );
}

export default CheckoutPage;