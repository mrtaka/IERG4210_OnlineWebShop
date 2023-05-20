import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

import { backend_url } from '../config'

const AdminUpdateCategory = () => {
    const [category,setCategories] = useState({
        NAME: "",
        CID: null
    })

    const navigate = useNavigate()
    const location = useLocation()

    const CID = location.pathname.split("/")[3]

    const handleChange = (e) =>{
        setCategories(prev=>({...prev, [e.target.name]: e.target.value}))
    }

    console.log(category);

    function timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }

    const handleSubmit = async e =>{
        if(category.NAME == ""){ return alert("The category name is empty!") }
        e.preventDefault()
        try{
            alert("Succussfully changed " + category.NAME + " !, Please reload website");
            await axios.put(backend_url + "/updatecategory/" + CID, category);
            //await timeout(1000);
            //window.location.href="/admin";  
        }catch(err){
            console.log(err);
        }
    }

    return(
        <div class='from'>
            <h4>Update this product</h4>
            <div class="row mb-2">
                <div class="col-auto"><input type="text" placeholder='Product Name' name="NAME" onChange={handleChange} class="form-control"></input></div>
            </div>
            <button type="button" class="btn btn-outline-success" onClick={handleSubmit}>Update this items</button>
            <button type="button" class="btn btn-outline-secondary m-3" onClick={handleSubmit}>Back to AdminPage</button>
        </div>
    )
}

//<div class="col-auto"><input type="number" defaultValue={CID} placeholder='CID' name="CID" onChange={handleChange} class="form-control"></input></div>

export default AdminUpdateCategory;