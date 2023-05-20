import React from 'react';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import sanitizeHtml from 'sanitize-html';

import { backend_url } from './config'

function ProductCard(props){

    let product = props.product;
    let i = props.i;
  
    const [selected, setSelected] = useState(0);
  
    const handleMouseOver = (index,e) => {
        setSelected(index);
    }
    const handleMouseOut = (index,e) => {
        setSelected(-1);
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

    //location.pathname +  "/product"
    return (
        <div onMouseOver={(e)=>handleMouseOver(i,e)} onMouseOut={(e)=>handleMouseOut(i,e)} className="card shadow-sm d-inline-block m-2" style={{width: selected === i ? 300 : 240}}>
          <img onClick={(e)=> window.location = "/PID/" + product.PID} src = {backend_url + "/images/" + product.IMAGEFILE} height = {230} width = {230} className="p-3"alt=""/>
          <div className="card-body">
            <a class="nav-link" href={"/PID/" + product.PID}>{sanitizeHtml(product.NAME)}</a> {/*context-dependent output sanitizations*/}
            <p className="card-text">HKD$ {sanitizeHtml(product.PRICE)}</p> {/*context-dependent output sanitizations*/}
            { selected === i && <p className = "card-text">{sanitizeHtml(product.DESCRIPTION)}</p> } {/*context-dependent output sanitizations*/}
            <button type="button" class="btn btn-outline-success" onClick={(e) => addToCart(product.PID)}>Add to Cart</button>
          </div>
        </div>
    );
}


export default ProductCard;