import React from 'react';
import Cookie from 'universal-cookie';
import sanitizeHtml from 'sanitize-html';
import "./style.css";

//for check admin and login state
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { backend_url } from './config'

function Sidebar(props){

    let categories = props.categories;
    const [adminState,setAdminState] = useState(false)
    const [isLogin,setIsLoign] = useState(false)

    useEffect(()=>{
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

        const getEMAIL = async ()=>{
            try{
                let cookie = new Cookie();
                let auth = cookie.get('auth');

                const res = await axios.post(backend_url + "/auth/getemail", { "auth": auth});
                if (res.data.success) {
                    setIsLoign(true);
                }
                else {
                    setIsLoign(false);
                }
            }catch(err){
                setIsLoign(false);
            }
        }
        getEMAIL();
  
    },[])

    function logout(){
        const c = new Cookie();
        c.remove("auth", { path: '/' });
        alert("You are now logout");
        window.location.assign('/');
    }

    return (
        <section id="section_category" class="col-2">
        <ul class="no-bullets">
          <a class="nav-link" href="/"><li class="sidebar_item">Home</li></a>
          <hr></hr>
          {categories.map((category)=>(
              <>
              <a class="nav-link" href={"/CID/"+ category.CID}><li class="sidebar_item" key ={category.CID}>{sanitizeHtml(category.NAME)}</li></a>{/*context-dependent output sanitizations*/}
              <hr></hr>
              </>
          ))}
            {isLogin?
                <>
                <a class="nav-link" href="/myorder"><li class="sidebar_item">My Order</li></a>
                <hr></hr>
                <li class="sidebar_item" onClick={logout}>Logout</li>
                <hr></hr>
                <a class="nav-link" href="/reset"><li class="sidebar_item">Reset Password</li></a>
                <hr></hr>
                </>
            : 
                <>
                <a class="nav-link" href="/login"><li class="sidebar_item">Login</li></a>
                <hr></hr>
                </>
            }

            {adminState?
                <><a class="nav-link" href="/admin"><li class="sidebar_item">Admin</li></a>
                <hr></hr>
                <a class="nav-link" href="/admin/order"><li class="sidebar_item">All Order</li></a>
                <hr></hr></>
            :
                <></>
            }
        </ul>
        <div style={{height: "500px"}}></div>
      </section>
    );
}


export default Sidebar;