import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import API from "../api/contactApi";
import "./ContactList.css";
function ContactList() {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState("");
    useEffect(() => {
        getContacts();
    }, []);
    async function getContacts() {
        try {
            const response = await API.get("/contacts");
            setContacts(response.data);
        } catch (error) {
            console.log(error);
        }
    }
    async function deleteContact(id) {
        try {
            const confirmDelete = window.confirm(
        "Are you sure you want to delete this contact?"
    );
    if (!confirmDelete) return;
    await API.delete(`/contacts/${id}`);
        getContacts();
        alert("Contact Deleted Successfully");
    } catch (error) {
        console.log(error);
    }
}
    return (
    <div className="home">
        <div className="home-card">
            <div className="header">
                <div className="logo-title">
                    <FaPhoneAlt className="logo-icon"/>
                    <h1>Contact Manager</h1>
                </div>
                <button
                    className="add-btn"
                    onClick={() => navigate("/add-contact")}>
                    + Add Contact
                </button>
            </div>
            <div className="search-wrapper">
                <FaSearch className="search-icon"/>
                <input
                    type="text"
                    placeholder="Search Contact..."
                    className="search-box"
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                />
            </div>
            <div className="contact-container">
                {contacts
                    .filter((contact)=>
                        contact.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((contact)=>( 
                    <div className="contact-card" key={contact._id}>
                        <div className="contact-top">
                            <div className="avatar">
                                {contact.profileImage ? (
                                    <img
                                        src={`https://contact-manager-b-csm-b-zgzk.onrender.com/${contact.profileImage}`}
                                        alt={contact.name}
                                        className="avatar-image"/>
                                ) : (
                                    contact.name.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="contact-info">
                                <h3>{contact.name}</h3>
                                <p>📞 {contact.phone}</p>
                            </div>
                        </div>
                        <div className="action-buttons">
                            <button
                                className="view-btn"
                                onClick={() => navigate(`/contact/${contact._id}`)}>
                                👁 View
                            </button>
                            <button
                                className="edit-btn"
                                onClick={() => navigate(`/edit-contact/${contact._id}`)}>
                                ✏ Edit
                            </button>
                            <button
                                className="delete-btn"
                                onClick={() => deleteContact(contact._id)}>
                                🗑 Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
}
export default ContactList;
