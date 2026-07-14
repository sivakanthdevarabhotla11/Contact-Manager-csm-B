import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {useState,useRef} from "react"
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import{FaUser,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaCamera} from "react-icons/fa"
import "../forms/Forms.css"
import API from "../api/contactApi";
function AddContact() {
    const [contacts, setContacts] = useState([]);
    const [formdata, setFormdata] = useState({
        name: "",
        prefix: "",
        firstname: "",
        middlename: "",
        lastname: "",
        suffix: "",
        phone: "",
        email: "",
        address: "",
})
    const fileInputRef = useRef(null)
    const [profileimage, setProfileImage]=useState(null)
    const [imageFile, setImageFile] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
    if(id){
        loadContact();
    }
}, []);
function handleChange(e) {
    const { name, value } = e.target;
    if (name === "phone") {
        const onlyNumbers = value.replace(/\D/g, "");
        setFormdata({
            ...formdata,
            phone: onlyNumbers
        });
    }
    else {
        setFormdata({
            ...formdata,
            [name]: value
        });
    }
}
async function handleSubmit(e) {
    e.preventDefault();
    const fullName =
        formdata.name ||
        [
            formdata.prefix,
            formdata.firstname,
            formdata.middlename,
            formdata.lastname,
            formdata.suffix
        ]
            .filter(item => item && item.trim() !== "")
            .join(" ");
    if (!fullName) {
        alert("Please enter at least one name field.");
        return;
    }
    const data = new FormData();
    Object.keys(formdata).forEach((key) => {
        data.append(key, formdata[key]);
    });
    data.set("name", fullName);
    if (imageFile) {
        data.append("profileImage", imageFile);
    }
    try {
        if (id) {
            await API.put(`/contacts/${id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            alert("Contact Updated Successfully");
        } else {
            await API.post("/contacts", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            alert("Contact Added Successfully");
        }
        navigate("/");
    } catch (error) {
        console.log(error);
    }
}
function openFilePicker() {
    fileInputRef.current.click();
}
async function loadContact() {
    try {
        const response = await API.get(`/contacts/${id}`);
        setFormdata(response.data);
        if (response.data.profileImage) {
            setProfileImage(
                `https://contact-manager-b-csm-b-zgzk.onrender.com/${response.data.profileImage}`
            );
            }
    } catch (error) {
        console.log(error);
    }
}
function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
        setImageFile(file);
        setProfileImage(URL.createObjectURL(file));
    }
}
    const [showNameFields, setShowNameFields] = useState(false);
    return(  
        <div className="formslayout">
            <div className="card">
                    <h1>{id ? "Edit Contact" : "Add New Contact"}</h1>                <div className="ps">
                    <div className="pc">
                        {profileimage ? (
                        <img
                            src={profileimage}
                            alt="Profile"
                            className="profile-image"
                        />
                    ) : formdata.name ? (
                        <span className="profile-letter">
                            {formdata.name.charAt(0).toUpperCase()}
                        </span>
                    ) : (
                        <FaUser className="profile-icon" />
                    )}        
                        
                        <div className="camera-btn" onClick={openFilePicker}>
                            <FaCamera className="camera-small"/>
                        </div>

                    </div>
                    <p>Add Profile Photo</p>

                </div>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    hidden
                />
                <form onSubmit={handleSubmit}>
                <div className="input-box">
                    
                    <FaUser className="icon" />
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formdata.name}
                        onChange={handleChange}
                    />
                    <button
                        type="button"
                        className="arrow-btn"
                        onClick={() => setShowNameFields(!showNameFields)}
                    >
                        {showNameFields ? <FaChevronUp /> : <FaChevronDown />}                    </button>
                </div>

                    
                    {showNameFields && (
                        <div className="name-fields">

                            <div className="field">
                                <input
                                    type="text"
                                    name="prefix"
                                    placeholder="Prefix"
                                    value={formdata.prefix}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="field">
                                <input
                                    type="text"
                                    name="firstname"
                                    placeholder="Firstname"
                                    value={formdata.firstname}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="field">
                                <input
                                    type="text"
                                    name="middlename"
                                    placeholder="Middlename"
                                    value={formdata.middlename}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="field">
                                <input
                                    type="text"
                                    name="lastname"
                                    placeholder="Lastname"
                                    value={formdata.lastname}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="field">
                                <input
                                    type="text"
                                    name="suffix"
                                    placeholder="Suffix"
                                    value={formdata.suffix}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    )}
                <div className="input-box">
                    <FaPhone className="icon"/>
                    <input type="tel" name="phone" placeholder="Mobile Number"  required value={formdata.phone} onChange={handleChange} maxLength={10}/>
                </div>  
                <div className="input-box"> 
                    <FaEnvelope className="icon"/>  
                    <input type="email" name="email" placeholder="Email"  value={formdata.email} onChange={handleChange}/>
                </div>
                <div className="input-box">
                    <FaMapMarkerAlt className="icon"/>
                    <textarea  name="address" placeholder="Address" rows="3" value={formdata.address} onChange={handleChange}/>
                </div>
                <button className="save-btn" type="submit">
                    {id ? "Update Contact" : "Save Contact"}
                </button>
                </form>
                

                
            </div>
        </div>
        
    )
}
export default AddContact
