import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import Cookie from "universal-cookie";

import { backend_url } from '../config'

function ResetPage(props) {

    const [input, setInput] = useState({
        PASSWORD: "",
        NEW_PASSWORD: "",
        COMFIRM_PASSWORD: "",
    });

  useEffect(()=>{
  },)

  const handleChange = (e) =>{
    console.log(input.PASSWORD,input.NEW_PASSWORD,input.COMFIRM_PASSWORD);
    setInput(prev=>({...prev, [e.target.name]: e.target.value}))
    }

  const handleSubmit = (e) => {
    e.preventDefault();
    if(input.NEW_PASSWORD != input.COMFIRM_PASSWORD){
        alert("the new password you enter are not the same, please check again!");
        return;
    }
    else if(input.NEW_PASSWORD == input.PASSWORD){
        alert("New password can not be the same as the current password!");
        return;
    }
    userReset();
  }

  const userReset = () => {

        let cookie = new Cookie();
        let auth_token = cookie.get('auth');
        axios({
            method: 'post',
            //withCredentials: true,
            url: backend_url + '/auth/resetpw',
            data: {
                auth: auth_token,
                PASSWORD: input.PASSWORD,
                NEW_PASSWORD: input.NEW_PASSWORD,
            }
        }).then(res => {
            if (res.data.success) {
                alert(res.data.msg);
                logout();
            }
            else {
                alert(res.data.error);
            }
        }).catch(e => alert(e.response.data.error))
  };

function logout(){
    const c = new Cookie();
    c.remove("auth", { path: '/' });
    alert("You are now logout");
    window.location.assign('/');
}
    
  return(
        <>
            {/*Pills content*/}
            <div class="card" style={{margin: 50, padding:25}}>
            <div class="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                <form onSubmit={handleSubmit}>

                {/*Old Password input*/}
                <div class="form-outline mb-4">
                    <input type="PASSWORD" id="PASSWORD" name="PASSWORD" class="form-control" onChange={handleChange}/>
                    <label class="form-label" for="PASSWORD">Old Password</label>
                </div>

                {/*New Password input*/}
                <div class="form-outline mb-4">
                    <input type="PASSWORD" id="NEW_PASSWORD" name="NEW_PASSWORD" class="form-control" onChange={handleChange}/>
                    <label class="form-label" for="NEW_PASSWORD">New Password</label>
                </div>

                {/*Confirm New Password input*/}
                                <div class="form-outline mb-4">
                    <input type="PASSWORD" id="COMFIRM_PASSWORD" name="COMFIRM_PASSWORD" class="form-control" onChange={handleChange}/>
                    <label class="form-label" for="COMFIRM_PASSWORD">Comfirm New Password</label>
                </div>

                {/* Submit button*/}
                <center><button type="submit" class="btn btn-primary btn-block mb-4">Reset password</button></center>
                </form>
            </div>
            </div>
            {/*Pills content*/}
        </>
  )
} 

export default ResetPage;