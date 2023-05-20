import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import Cookie from "universal-cookie";

import { backend_url } from '../config'

function LoginPage(props) {

    const [input, setInput] = useState({
        EMAIL: "",
        PASSWORD: ""
    });

  useEffect(()=>{
  },)

  const handleChange = (e) =>{
    console.log(input.EMAIL,input.PASSWORD);
    setInput(prev=>({...prev, [e.target.name]: e.target.value}))
    }

  const handleSubmit = (e) => {
    if(input.EMAIL == ""){ return alert("The email is empty!") }
    if(input.PASSWORD == ""){ return alert("The PASSWORD is empty!") }
    e.preventDefault();
    userLogin();
  }

  const userLogin = () => {
        axios({
            method: 'post',
            //withCredentials: true,
            url: backend_url + '/auth/login',
            data: {
                EMAIL: input.EMAIL,
                PASSWORD: input.PASSWORD,
            }
        }).then(res => {
            // console.log(res);
            if (res.data.success) {
                alert(input.EMAIL + " login success.");
                console.log(res.data)
                console.log(res.data.auth)
                console.log(res.data.expireDate)
                setLoginAuth(res.data.auth, res.data.expireDate, res.data.ADMIN);
            }
            else {
                alert(res.data.error);
            }
        }).catch(e => alert(e.response.data.error))
  };

  const setLoginAuth = (auth, expireDateinput, ADMIN) => {
    //console.log("email: ",email);
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + expireDateinput); // expire after 1 day
    const cookie = new Cookie();
    cookie.set("auth", auth, { path: "/", expires: expireDate, secure:true })
    //cookie.set("auth_token", token, { path: "/", expires: expireDate })
    //cookie.set("email", email, { path: "/", expires: expireDate })

    /*if (role) {
        cookie.set("role", "admin", { path: "/", expires: expireDate })
    } else {
        cookie.set("role", "user", { path: "/", expires: expireDate })
    }*/
    if(ADMIN == 1){
        window.location.assign('/admin');
    }else{
        window.location.assign('/');
    }
    // navigate('/table');

    }
    
  return(
        <>
            {/*Pills content*/}
            <div class="card" style={{margin: 50, padding:25}}>
            <div class="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                <form onSubmit={handleSubmit}>
                {/*action={backend_url+"/login_auth"} method="post"*/}
                {/*Email input*/}

                <div class="form-outline mb-4">
                    <input type="EMAIL" id="EMAIL" name="EMAIL" class="form-control" onChange={handleChange}/>
                    <label class="form-label" for="EMAIL">Email</label>
                </div>

                {/*Password input*/}
                <div class="form-outline mb-4">
                    <input type="PASSWORD" id="PASSWORD" name="PASSWORD" class="form-control" onChange={handleChange}/>
                    <label class="form-label" for="PASSWORD">Password</label>
                </div>

                {/*2 column grid layout*/}
                <div class="row mb-4">
                    <div class="col-md-6 d-flex justify-content-center">
                        {/*Checkbox*/}
                        <p>Not a member? <a href="#!">Register</a></p>
                    </div>
                    <div class="col-md-6 d-flex justify-content-center">
                        {/* Simple link*/}
                        <a href="#!">Forgot password?</a>
                    </div>
                </div>

                {/* Submit button*/}
                <center><button type="submit" class="btn btn-primary btn-block mb-4">Sign in</button></center>
                </form>
            </div>
            </div>
            {/*Pills content*/}
        </>
  )
} 

export default LoginPage;