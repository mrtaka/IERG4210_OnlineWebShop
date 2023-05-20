import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

import { backend_url } from '../config'

const AdminUpdate = () => {
    const [product,setProducts] = useState({
        NAME: "",
        CID: null,
        PRICE: null,
        INVENTORY: null,
        DESCRIPTION: "",
    })

    const navigate = useNavigate()
    const location = useLocation()

    const PID = location.pathname.split("/")[3]

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


        const fetchProduct = async ()=>{
                try{
                    const res = await axios.get(backend_url + "/quote?PID=" + PID);
                    setProducts(res.data.data[0]);
                    console.log(res.data.data[0]);
                }catch(err){
                    console.log(err);
                }
        }
        fetchProduct();
        //loadImage();
    
    },[])

    const handleChange = (e) =>{
        setProducts(prev=>({...prev, [e.target.name]: e.target.value}))
    }

    const handleSubmit = async e =>{
        e.preventDefault()
        try{
            window.location.reload(false);
            await axios.put(backend_url + "/updateproduct/" + PID, product);
            alert("Succussfully added " + product.NAME + " !");
        }catch(err){
            console.log(err);
        }
    }


    function timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }

    const afterSubmit = async e =>{
        if(validateForm()){
            alert("Succussfully updated " + product.NAME + " !");
            await timeout(1000);
            window.location.href="/admin";
        }else{
            e.preventDefault();
        }
    }

    function validateForm() {
        let product = document.forms["updateProduct"];
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
            <h4>Update this product</h4>
            <iframe name="hiddenFrame" class="hide"></iframe>
        <form method="POST" name="updateProduct" action={backend_url + "/updateproduct/" + PID} encType="multipart/form-data" target="hiddenFrame">
            <div class="row mb-2">
                <div class="col-4"><input defaultValue={product.NAME} type="text" placeholder='Product Name' name="NAME" class="form-control"></input></div>
                <div class="col-4"><input defaultValue={product.PRICE} type="number" placeholder='Price' name="PRICE" class="form-control"></input></div>
                <div class="col-4"><input defaultValue={product.INVENTORY} type="number" placeholder='Inventory' name="INVENTORY" class="form-control"></input></div>
            </div>
            <div class="row mb-2">
                <div class="col-4">
                <select id="selectCID" aria-label="Default select example"  placeholder='CID' name="CID" onChange={handleChange} class="form-select">
                    {categories.map((category)=>(
                        <>
                        {category.CID === product.CID ? 
                            <option selected key ={category.CID} value={category.CID}>{category.CID}&nbsp;{category.NAME}</option>
                        : 
                            <option key ={category.CID} value={category.CID}>{category.CID}&nbsp;{category.NAME}</option>
                        }
                        </>
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
            <div class="row mb-2"><div class="col"><textarea defaultValue={product.DESCRIPTION} type="text" placeholder='Description' name="DESCRIPTION" onChange={handleChange} class="form-control"></textarea></div></div>
            <input type="submit" onClick={afterSubmit}></input>
        </form>
        </div>
    )
}

export default AdminUpdate;