import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useParams } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

import ProductCard from './ProductCard'
import { backend_url } from './config'

function CategoryPage (props){
    const [products,setProducts] = useState([])

    const navigate = useNavigate()
    const location = useLocation()
    const CID = location.pathname.split("/")[2]

    useEffect(()=>{
        const fetchAllProducts = async ()=>{
            try{
                const res = await axios.get(backend_url + "/quote?CID=" + CID);
                setProducts(res.data.data);
                //console.log(res.data.data);
            }catch(err){
                console.log(err);
            }
        }
        fetchAllProducts();
    },[])

    return(
      <main className="container  mt-2">
        {products.map((product,index) => <ProductCard product={product} i={index} key={index}/>)}
      </main> 
    )
}

export default CategoryPage;