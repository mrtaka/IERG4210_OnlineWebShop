import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

import ProductCard from './ProductCard'
import Loader from './Loader';
import { backend_url } from './config'

function Home(props) {
  const [products,setProducts] = useState([])
  const [page,setPage] = useState(1)
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
      const fetchAllProducts = async ()=>{
          try{
              const res = await axios.get(backend_url + `/quote?PAGE=${page}&SIZE=8`);
              //console.log(res.data.success)
              if(res.data.success){
                setProducts((prev) => [...prev, ...res.data.data]);
                setLoading(false)
              }
              //console.log(res.data.data);
          }catch(err){
              console.log(err);
          }
      }
      fetchAllProducts();
  },[page])

  const handleScroll = () => {
    //console.log("Height:", document.documentElement.scrollHeight)
    //console.log("Top:", document.documentElement.scrollTop)
    //console.log("Window:", window.innerHeight)

    if(window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight){
      setLoading(true)
      setPage(prev => prev + 1)
    }
  }

  useEffect(()=>{
    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll);
  },[])

  return(
    <main className="container mt-2">
      {products.map((product,index) => <ProductCard product={product} i={index} key={index}/>)}
      {loading && <Loader/>}
    </main> 
  )
} 

export default Home;