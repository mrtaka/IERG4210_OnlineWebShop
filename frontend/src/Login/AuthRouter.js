import React from 'react'
import { Outlet } from 'react-router-dom';
import Cookie from 'universal-cookie';
import Home from '../Home';
import axios from 'axios';

import { backend_url } from '../config'


const getEMAIL = async ()=>{
    try{
        let cookie = new Cookie();
        let auth = cookie.get('auth');

        const res = await axios.post(backend_url + "/auth/getemail", { "auth": auth});
        if (res.data.success) {
            console.log("yessss")
            //setEmail(res.data.data);
        }
        else {
            console.log("failll")
            //setEmail("Guest");
        }
    }catch(err){
        //setEmail("Guest");
        console.log(err);
    }
}

const useAdmin = async ()=>{
    try{
    let cookie = new Cookie();
    let auth = cookie.get('auth');

    const res = await axios.post(backend_url + "/auth/checkadmin", { "auth": auth});
    if (res.data.success){
        console.log("Is admin!")
        return true;
    } else {
        console.log("Is not admin!")
        return false;
    }
    }catch(err){
        return false;
    }
}


const authService = {getEMAIL, useAdmin}
export default authService;