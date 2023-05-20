import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import sanitizeHtml from 'sanitize-html';

import ProductCard from './ProductCard'
import "./style.css";
import { backend_url } from './config'

function ProductPage(props) {

    const [product,setProduct] = useState([])
    //const [category,setCategory] = useState([])
    //const [CNAME,setCNAME] = useState([])

    const navigate = useNavigate()
    const location = useLocation()
    const PID = location.pathname.split("/")[2]



    useEffect(()=>{
        const fetchProduct = async ()=>{
            try{
                const res = await axios.get(backend_url + "/quote?PID=" + PID);
                setProduct(res.data.data[0]);
                //console.log(res.data.data[0]);
            }catch(err){
                console.log(err);
            }
        }
        fetchProduct();

    },[])


    let invtext = "Inventory: " + product.INVENTORY;

    if(product.INVENTORY<3){
        invtext = "Only " + product.INVENTORY + " left!";
    }

    const addToCart = (PID) => {
        let Shoplist = JSON.parse(localStorage.getItem("Shoplist"));
        let CartItem = {PID: 0, quantity: 0};
        let count = 0;

        if(Shoplist == null){//if no shoplist, create one
          Shoplist = [];
        }

        //console.log('====1======');
        //console.log(Shoplist);

        Shoplist.forEach(item => {//if have that item on shoplist, add quantity by 1
          if (item.PID == PID){
            item.quantity = item.quantity + 1;
            count++;
          }
        });

        if(count == 0){//if no that item on shoplst, add that item
          CartItem.PID = PID;
          CartItem.quantity = 1;
          Shoplist.push(CartItem);
        }

        let Shoplist_json = JSON.stringify(Shoplist);
        localStorage.setItem("Shoplist", Shoplist_json);
        window.location.reload(true)
    }

    return(
        <div>
            <section class="row product_section">
                <section class="col-4">
                    <img src = {backend_url + "/images/" + product.IMAGEFILE} class="product_img" alt="product"/>
                </section>
                <section class="col-8">
                    <span id="pill_pd" class="badge rounded-pill text-bg-success">{}</span>
                    <h4>{sanitizeHtml(product.NAME)}</h4>{/*context-dependent output sanitizations*/}
                    <h5 className="card-text">HKD$ {sanitizeHtml(product.PRICE)}</h5>{/*context-dependent output sanitizations*/}
                    <p className="card-text">{sanitizeHtml(invtext)}</p>{/*context-dependent output sanitizations*/}
                    <p className="card-text">{sanitizeHtml(product.DESCRIPTION)}</p>{/*context-dependent output sanitizations*/}
                    <button type="button" class="btn btn-outline-success" onClick={(e) => addToCart(product.PID)}>Add to Cart</button>
                </section>
            </section>
        </div>
    )
}

export default ProductPage;
