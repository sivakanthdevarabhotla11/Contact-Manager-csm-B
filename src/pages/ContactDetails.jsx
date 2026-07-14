import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt
} from "react-icons/fa";
import API from "../api/contactApi";
import "./ContactDetails.css";
function ContactDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contact, setContact] = useState({});
    useEffect(() => {
        loadContact();}, []);
    async function loadContact() {
        const response = await API.get(`/contacts/${id}`);
        setContact(response.data);
    }
    return (
        <div className="details-page">
            <div className="details-card">
                <div className="avatar">
                    {contact.profileImage ? (
                        <img
                            src={`https://contact-manager-b-csm-b-zgzk.onrender.com/${contact.profileImage}`}
                            alt={contact.name}
                            className="avatar-image"
                        />
                    ) : (
                        contact.name?.charAt(0).toUpperCase()
                    )}
                </div>
                <h2>{contact.name}</h2>
                <div className="info-box">
                    <FaPhone className="info-icon"/>
                    <div className="info-text">
                        <span className="info-label">Phone</span>
                        <span className="info-value">{contact.phone}</span>
                    </div>
                </div>
                <div className="info-box">
                    <FaEnvelope className="info-icon"/>
                    <div className="info-text">
                        <span className="info-label">Email</span>
                        <span className="info-value">{contact.email}</span>
                    </div>
                </div>
                <div className="info-box">
                    <FaMapMarkerAlt className="info-icon"/>
                    <div className="info-text">
                        <span className="info-label">Address</span>
                        <span className="info-value">{contact.address}</span>
                    </div>
                </div>
                <div className="details-buttons">
                    <button
                        className="edit-btn"
                        onClick={() => navigate(`/edit-contact/${contact._id}`)}>
                        Edit
                    </button>
                    <button
                        className="back-btn"
                        onClick={() => navigate("/")}>
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ContactDetails;
