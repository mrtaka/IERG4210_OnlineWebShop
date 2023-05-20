import React from 'react';
import "./style.css";
import Cookie from 'universal-cookie';
import sanitizeHtml from 'sanitize-html';
//import cookieClient from 'react';


//for shoplist
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

import { backend_url } from './config'

function Navbar(props){
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
            <header class="card-header">
                <div id="header">
                    <div class="bg_logo"></div>
                </div>
            </header>
            <nav class="navbar shadow-sm sticky-top navbar-expand-lg bg-body-tertiary"style={{backgroundColor: "#ff9e0a"}}>
                <div class="container-fluid">
                    <span class="navbar-brand mb-0 h1" style={{color: "#FFFFFF"}}>{props.name}</span>
                    <div class="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul class="navbar-nav me-auto">
                            <li class="nav-item">
                                <a class="nav-link" style={{color: "#FFFFFF"}} aria-current="page" href="/">Home</a>
                            </li>
                        </ul>
                        <a class="nav-link" style={{color: "#FFFFFF"}} aria-current="page" href="/myorder">
                        <button type="button" class="btn btn-outline-light" margin="10px"> {email} </button> {/*context-dependent output sanitizations*/}
                        </a>
                        <ShopList/>
                    </div>
                </div>
            </nav>
        </>
    );
};

function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update state to force render
    // A function that increment 👆🏻 the previous state like here 
    // is better than directly setting `setValue(value + 1)`
}

function ShopList(props){

    const forceUpdate = useForceUpdate();

    const [Shoplist,setShoplist] = useState([])
    const [products,setProducts] = useState([])
    const [product,setProduct] = useState()

    useEffect(()=>{
        //console.log("fetch productlist");
        const fetchAllProducts = async ()=>{
            try{
                const res = await axios.get(backend_url + "/quote/");
                //console.log("=======set fetch from link=======");
                //console.log(products);
                setProducts(res.data.data);
            }catch(err){
                console.log(err);
            }
        }
        fetchAllProducts();

        //console.log("fetch shoplist");
        let Templist = JSON.parse(localStorage.getItem("Shoplist"));
        //console.log(Templist);
        if(Templist == null){//if no shoplist, create one
            Templist = [];
        }
        setShoplist(Templist);

        //console.log(products);
        //console.log("finish fetch");

        //fetchData();
    },[])


    function getProduct(PID){
            var obj = products.find(item => item.PID == PID);
            if(obj != null){
                //console.log(obj);
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
                //console.log("===error obj ====");
                //console.log(obj);
                return obj;
            }
    }

    function getTotal(){
            let totalprice = 0;
            Shoplist.forEach(item => {
                totalprice = totalprice + getProduct(item.PID).PRICE * item.quantity;
                //console.log("id: " + item.PID + " Price: " + totalprice)
            });
            return totalprice;
    }

    const handleChange = (event) => {
        //Get input value and id from "event"
        //console.log(event.target.value);
        //console.log(event.target.id);

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
        //reload page
        //window.location.reload(true)
        forceUpdate();
      };

      const checkout = () => {
        window.location.href="/checkout";  
    }
    
    return (
        <>
            <div class="shoplist" ><button type="button" class="btn btn-outline-light"> Shopping List  ${getTotal()} </button></div>
            <div class="hide">
                {Shoplist.map((items)=>(
                        <div key ={items.PID}>
                            <div class="row">
                                <div class="col-6" ><p class="shoplist_word">{getProduct(items.PID).NAME}</p></div>
                                <div class="col-3 input-group-sm" ><input type="number" id={items.PID} defaultValue={items.quantity} onChange={handleChange} class="form-control" aria-label="quantity" min="0" max="100"></input></div>
                                <div class="col-3" ><p class="shoplist_word">${getProduct(items.PID).PRICE*items.quantity}</p></div>
                            </div>
                            <hr></hr>
                        </div>
                    ))}
                <div class="row">
                    <div class="col-4"><button type="button" onClick={checkout} class="btn btn-outline-primary">Checkout</button></div>
                    <div class="col-3"><h5>Total</h5></div>
                    <div class="col-5"><h5>USD${getTotal()}</h5></div>
                </div>
            </div>
        </>
    );
}

export default Navbar;