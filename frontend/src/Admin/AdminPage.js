import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import sanitizeHtml from 'sanitize-html';

import "../style.css";
import { backend_url } from '../config'


function AdminPage(props) {
    const [products,setProducts] = useState([])
    const [selected, setSelected] = useState(0);
    const [selected1, setSelected1] = useState(0);

    useEffect(()=>{
        const fetchAllProducts = async ()=>{
            try{
                const res = await axios.get(backend_url + "/quote/");
                setProducts(res.data.data);
                //console.log(res.data.data);
            }catch(err){
                console.log(err);
            }
        }
        fetchAllProducts();
    },[])

    function refreshPage() {
        window.location.reload(false);
        alert("Reloaded page!");
    }

    const handleSelect = (index,e) => { //for add products
        if (selected == 0){
            setSelected(1);
            setSelected1(0);
        }
        else setSelected(0);
    }

    const handleSelect1 = (index,e) => { //for add categories
        if (selected1 == 0){
            setSelected(0);
            setSelected1(1);
        }
        else setSelected1(0);
    }

    function timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }

    const handleDelete = async (id) => {
        try{
            await axios.delete(backend_url + "/deleteproduct/" + id);
            await timeout(1000);
            window.location.href="/admin";  
        }catch(err){
            console.log(err)
        }
    }

    //console.log("props.isAdmin: ", props.isAdmin);
    //{ props.isAdmin == true ?                : <center><p>You are not admin</p></center>}
    return(
        <div>
            <>
            <h1>All product list</h1>
            <div>
            <button onClick={(e)=>handleSelect()}type="button" class="btn btn-success">Add new products</button>
            <button onClick={(e)=>handleSelect1()}type="button" class="btn btn-primary m-3">Add new Category</button>
            <button onClick={(e)=>refreshPage()} type="button" class="btn btn-secondary">Reload Page</button>
            {selected === 1 ? <AddProduct/> : <p></p>}
            {selected1 === 1 ? <AddCategories/> : <p></p>}
            </div>
                <table class="table table-hover table-sm">
                    <thead class="thead-dark">
                        <tr>
                            <th>NAME</th>
                            <th>PID</th>
                            <th>CID</th>
                            <th>PRICE</th>
                            <th>INVENTORY</th>
                            <th>DESCRIPTION</th>
                            <th>IMAGEFILE</th>
                            <th>Modify data</th>
                        </tr>
                    </thead>
                    <tbody>
                    {products.map((product)=>(
                            <tr key ={product.PID}>
                                <td>{sanitizeHtml(product.NAME)}</td>{/*context-dependent output sanitizations*/}
                                <td>{sanitizeHtml(product.PID)}</td>{/*context-dependent output sanitizations*/}
                                <td>{sanitizeHtml(product.CID)}</td>{/*context-dependent output sanitizations*/}
                                <td>${sanitizeHtml(product.PRICE)}</td>{/*context-dependent output sanitizations*/}
                                <td>{sanitizeHtml(product.INVENTORY)} QTY</td>{/*context-dependent output sanitizations*/}
                                <td>{sanitizeHtml(product.DESCRIPTION)}</td>{/*context-dependent output sanitizations*/}
                                <td>{sanitizeHtml(product.IMAGEFILE)}</td>{/*context-dependent output sanitizations*/}
                                <td><Link to={"update/"+product.PID}><button type="button" class="btn btn-outline-secondary btn-sm">Change</button></Link>
                                <button type="button" onClick={()=>handleDelete(product.PID)} class="btn btn-outline-danger btn-sm">&nbsp;Delete&nbsp;</button></td>
                            </tr>
                    ))}
                    </tbody>
                </table>
                </>

        </div>
    )
}

const AddProduct = () => {
    const [product,setProducts] = useState({
        NAME: "",
        CID: null,
        PRICE: null,
        INVENTORY: null,
        DESCRIPTION: "",
    })

    const [categories,setCategories] = useState([])

    useEffect(()=>{
        const fetchAllCategories = async ()=>{
            try{
                const res = await axios.get(backend_url + "/categories");
                setCategories(res.data.data);
                //console.log(res.data.data);
            }catch(err){
                console.log(err);
            }
        }
        fetchAllCategories();
    },[])

    const handleChange = (e) =>{
        setProducts(prev=>({...prev, [e.target.name]: e.target.value}))
    }

    function timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }

    const afterSubmit = async e =>{
        if(validateForm()){
            alert("Succussfully added " + product.NAME + " !");
            await timeout(1000);
            window.location.href="/admin";  
        }
        else{
            e.preventDefault();
        }
    }

    function validateForm() {
        let product = document.forms["createProduct"];
        const inpFile = document.getElementById("Imageinput");
        const file = inpFile.files[0];

        if(product["NAME"].value == ""){ alert("The NAME is empty!"); return false  }
        else if(product["CID"].value == "Please select CID"){ alert("You have not select category!"); return false  }
        else if(product["PRICE"].value == null || product["PRICE"].value == ""){ alert("The PRICE is empty!"); return false  }
        else if(product["PRICE"].value < 0){ alert("The PRICE is belong 0!"); return false  }
        else if(product["INVENTORY"].value == null || product["INVENTORY"].value == ""){ alert("The INVENTORY is empty!"); return false }
        else if(product["INVENTORY"].value < 0){ alert("The INVENTORY is belong 0!"); return false  }
        else if(product["DESCRIPTION"].value == ""){ alert("The DESCRIPTION is empty!"); return false }
        else if(!file){ alert("Please upload a images!"); return false }

        //alert("validations passed");
        return true;
    }

    const checkSizeType = (e) =>{ //check if the image are below 5MB and is it png/jpg/gif
        var uploadField = document.getElementById("Imageinput");

        uploadField.onchange = function() {
            if(this.files[0].size > 5242880){
               alert("File is too big! please put smaller than 5mb");
               this.value = "";
            };
            var ext = this.value.match(/\.([^\.]+)$/)[1];
            switch (ext) {
              case 'jpg':
              case 'png':
              case 'gif':
                break;
              default:
                alert('Not allowed this type of file, only allow .jpg .gif .png');
                this.value = '';
            }
        };

        addthumbnail();
    }

    const addthumbnail = (e) => {
        const inpFile = document.getElementById("Imageinput");
        const previewContainer = document.getElementById("imagePreview");
        const previewImage = previewContainer.querySelector(".image-preview__image");
        const previewDefaultText = previewContainer.querySelector(".image-preview__default-text")
        const file = inpFile.files[0];
        //console.log(file);

        if(file){
            const reader = new FileReader();

            previewDefaultText.style.display ="none";
            previewImage.style.display ="block";

            reader.addEventListener("load", function(){
                //console.log(this);
                previewImage.setAttribute("src", this.result);
            })

            reader.readAsDataURL(file);
        }
    }


    return(
        <div>
            <iframe name="hiddenFrame" class="hide"></iframe>
        <form method="POST" name="createProduct" action={backend_url+"/createproduct"} onsubmit="return validateMyForm();" encType="multipart/form-data" target="hiddenFrame">
            <div class="row mb-2">
                <div class="col-4"><input type="text" placeholder='Product Name' name="NAME" class="form-control"></input></div>
                <div class="col-4"><input type="number" placeholder='Price' name="PRICE" class="form-control"></input></div>
                <div class="col-4"><input type="number" placeholder='Inventory' name="INVENTORY" class="form-control"></input></div>
            </div>
            <div class="row mb-2">
                <div class="col-4">
                <select id="selectCID" aria-label="Default select example"  placeholder='CID' name="CID" onChange={handleChange} class="form-select">
                    <option selected>Please select CID</option>
                    {categories.map((category)=>(
                        <option key ={category.CID} value={category.CID}>{category.CID}&nbsp;{category.NAME}</option>
                    ))}
                </select>
                </div>
                <div class="col-8"><input type="file" name="image" id="Imageinput" class="form-control" accept=".jpg,.gif,.png" onChange={checkSizeType}></input></div>
                <div className="container m-1">
                    <div class="image-preview" id="imagePreview">
                        <img scr="" alt="Image Perview" class="image-preview__image"></img>
                        <span class="image-preview__default-text">Image Thumbnail</span>
                    </div>
                </div>
                <p class="m-2">Size need smaller than 5MB, allow png, jpg, gif</p>
            </div>
            <div class="row mb-2"><div class="col"><textarea type="text" placeholder='Description' name="DESCRIPTION" onChange={handleChange} class="form-control"></textarea></div></div>
            <input type="submit" onClick={afterSubmit}></input>
        </form>
        </div>
    )
}

const AddCategories = () => {
    const [categories,setCategories] = useState([])
    const [category,setCategory] = useState({
        NAME: "",
    })

    useEffect(()=>{
        const fetchAllCategories = async ()=>{
            try{
                const res = await axios.get(backend_url + "/categories");
                setCategories(res.data.data);
                //console.log(res.data.data);
            }catch(err){
                console.log(err);
            }
        }
        fetchAllCategories();
        getCallToForm();
    },[])

    //---------CSRF------------------------

    const [csrfToken, setCsrfToken] = useState('initialState')
    async function getCallToForm(){
        let fetchGetResponse = await fetch(backend_url+"/csrf",{
            method: 'GET',
            headers:{
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            mode: 'cors'
        })
        setCsrfToken(fetchGetResponse.csrfToken);
        console.log(csrfToken);
    }  
    //---------CSRF------------------------

    function timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }

    const handleSubmit = async e =>{
        e.preventDefault()
        if(category.NAME == ""){ return alert("The category name is empty!") }
        try{
            await axios.post(backend_url + "/createcategory/", category);
            alert("Succussfully added " + category.NAME + " !");
            await timeout(1000);
            window.location.href="/admin";  
        }catch(err){
            console.log(err);
        }
    }

    
    const handleChange = (e) =>{
        setCategory(prev=>({...prev, [e.target.name]: e.target.value}))
    }

    const handleDelete = async (id) => {
        try{
            alert("Deleted this Category! Please reload page");
            await axios.delete(backend_url + "/deletecategory/" + id);
            //await timeout(1000);
            //window.location.href="/admin";  
        }catch(err){
            console.log(err)
        }
    }

    return(
        <div>
            <table class="table table-hover table-sm">
                    <thead class="thead-dark">
                        <tr>
                            <th>CID</th>
                            <th>NAME</th>
                            <th>Modify data</th>
                        </tr>
                    </thead>
                    <tbody>
                    {categories.map((category)=>(
                            <tr key ={category.CID}>
                                <td>{sanitizeHtml(category.CID)}</td>{/*context-dependent output sanitizations*/}
                                <td>{sanitizeHtml(category.NAME)}</td>{/*context-dependent output sanitizations*/}
                                <td><Link to={"updateCategory/"+category.CID}><button type="button" class="btn btn-outline-secondary btn-sm">Change</button></Link>
                                <button type="button" onClick={()=>handleDelete(category.CID)} class="btn btn-outline-danger btn-sm">&nbsp;Delete&nbsp;</button></td>
                            </tr>
                    ))}
                    </tbody>
                </table>
            <div class='from'>
                <div class="row mb-2">
                    <div class="col-auto"><input type="text" placeholder='Category Name' name="NAME" onChange={handleChange} class="form-control"></input></div>
                    <div class="col-auto"><button type="button" class="btn btn-outline-success" onClick={handleSubmit}>Add this category</button></div>
                </div>
            </div>
        </div>

    )

}

export default AdminPage;