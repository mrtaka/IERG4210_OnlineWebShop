import ReactDOM from "react-dom/client";
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import Cookie from 'universal-cookie';

import { backend_url } from './config'

import "./style.css";

//import { useEffect, useState } from 'react';

//const { BrowserRouter, Routes, Route, Link } = ReactRouterDOM;
//const { useMatch, useParams, useLocation } = ReactRouterDOM;

import Navbar from './Navbar';
import Sidebar from "./Sidebar";
import Home from './Home';
import CategoryPage from './CategoryPage';
import ProductPage from './ProductPage';
import Footer from './Footer';
import NoMatch from './NoMatch';
import AdminPage from "./Admin/AdminPage";
import AdminUpdate from "./Admin/AdminUpdate";
import AdminUpdateCategory from "./Admin/AdminUpdateCategory";
import LoginPage from "./Login/LoginPage";
import ResetPage from "./Login/ResetPage";
import AdminOrderPage from "./Admin/AdminOrderPage";
import CheckoutPage from "./CheckoutPage";
import MyOrderPage from "./MyOrderPage";
//import authService from "./Login/AuthRouter"

function App (props){

  const [categories,setCategories] = useState([])
  //const [isAdmin,setISadmin] = useState(authService.useAdmin)
  const [adminState,setAdminState] = useState(false)

  useEffect(()=>{
      const fetchAllCategories = async ()=>{
          try{
              const res = await axios.get(backend_url + "/categories");
              setCategories(res.data.data);
          }catch(err){
              console.log(err);
          }
      }
      fetchAllCategories();

      const checkadmin = async ()=>{
        console.log("hihi");
      try{
          let cookie = new Cookie();
          let auth = cookie.get('auth');
      
          const res = await axios.post(backend_url + "/auth/checkadmin", { "auth": auth});
          if (res.data.success){
              console.log("Is admin!")
              setAdminState(true);
          } else {
              console.log("Is not admin!")
              setAdminState(false);
          }
          }catch(err){
            setAdminState(false);
          }
      }
      checkadmin();
      console.log(adminState);


  },[])

    return (
      <div id="page-container">
        <Navbar name={props.name}/>
          <div id="content-wrap">
            <BrowserRouter>
              <div class="row">
              <Sidebar categories={categories}/>
                <section id="section_content" class="col-9">
                  {adminState ? <span class={"badge rounded-pill text-bg-primary"}>Admin Permssion</span> : <span class={"badge rounded-pill text-bg-secondary"}> Non-Admin Permssion</span>}
                  <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="/PID/:id" element={<ProductPage/>}/>
                    <Route path="/CID/:id" element={<CategoryPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/myorder" element={<MyOrderPage/>}/>
                    <Route path="/reset" element={<ResetPage/>}/>
                    <Route path="/checkout" element={<CheckoutPage/>}/>
                    {adminState ? 
                    <>
                    <Route path="/admin" element={<AdminPage/>}/>
                    <Route path="/admin/update/:id" element={<AdminUpdate/>}/>
                    <Route path="/admin/updateCategory/:id" element={<AdminUpdateCategory/>}/>
                    <Route path="/admin/order" element={<AdminOrderPage/>}/>
                    </>
                    : 
                    <Route path="/admin" element={<Home/>}/>}
                    <Route path="*" element={<NoMatch />} />
                  </Routes>
                </section>
              </div>
            </BrowserRouter>
          </div>
        {/*<Footer/>*/}
      </div> 
    );
}


const root = ReactDOM.createRoot(document.querySelector('#app'));
root.render(<App name="Dummy shop"/>);
