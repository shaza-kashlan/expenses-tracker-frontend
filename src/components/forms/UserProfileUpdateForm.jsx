import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const UserProfileUpdateForm = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    emailAddress: "",
    password: "",
    userName: "",
    fullName: "",
    address: {
      street: "",
      number: "",
      city: "",
      postcode: "",
      country: "",
    },
    image: null,
    mobileNumber: "",
  });

  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Access token not found in local storage");
      return;
    }

    const fetchUserData = async () => {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get(`${API_URL}/users`, { headers });
        const userData = response.data;

        setFormData((prevFormData) => ({
          ...prevFormData,
          emailAddress: userData.emailAddress || "",
          userName: userData.userName || "",
          fullName: userData.fullName || "",
          address: {
            ...prevFormData.address,
            street: userData.address?.street || "",
            number: userData.address?.number || "",
            city: userData.address?.city || "",
            postcode: userData.address?.postcode || "",
            country: userData.address?.country || "",
          },
          image: userData.image || null,
          mobileNumber: userData.mobileNumber || "",
        }));

        if (userData.image) {
          setThumbnail(userData.image);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      address: {
        ...prevFormData.address,
        [name]: value,
      },
    }));
  };

  const handleImageChange = async (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append("file", file);
    formData.append("upload_preset", "luxmtkpk");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/doceqzmuk/image/upload",
        formData
      );
      setThumbnail(response.data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleUploadClick = () => {
    const fileInput = document.getElementById("fileInput");
    fileInput.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!/^\+\d{10,15}$/.test(formData.mobileNumber)) {
        alert('Invalid mobile number format. Please use format: "+1234567890"');
        return;
      }

      const response = await axios.put(
        `${API_URL}/users/${formData._id}`,
        formData
      );
      console.log("User profile updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating user profile:", error.message);
    }
  };

  return (
    <div>
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Profile Image */}
        <div
          className="form-field"
          style={{ textAlign: "center", marginBottom: "20px" }}
        >
          <label
            htmlFor="fileInput"
            style={{ cursor: "pointer", display: "block" }}
          >
            Profile Image
          </label>
          {thumbnail && (
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                overflow: "hidden",
                display: "inline-block",
                position: "relative",
              }}
            >
              <img
                src={thumbnail}
                alt="Thumbnail"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
          )}
          <input
            type="file"
            id="fileInput"
            name="thumbnail"
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>

        {/* Email Address */}
        <div className="form-field">
          <label>Email Address:</label>
          <input
            type="email"
            name="emailAddress"
            value={formData.emailAddress}
            onChange={handleChange}
            required
            readOnly
          />
        </div>
        {/* Username */}
        <div className="form-field">
          <label>Username:</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
            readOnly
          />
        </div>

        {/* Full Name */}
        <div className="form-field">
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>

        {/* Mobile Number */}
        <div className="form-field">
          <label>Mobile Number:</label>
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            pattern="^\+\d{10,15}$"
            title="Please use format: '+1234567890'"
            required
          />
        </div>

        {/* Address Fields */}
        <div className="form-field">
          <label>Street:</label>
          <input
            type="text"
            name="street"
            value={formData.address.street}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label>Number:</label>
          <input
            type="text"
            name="number"
            value={formData.address.number}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={formData.address.city}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label>Postcode:</label>
          <input
            type="text"
            name="postcode"
            value={formData.address.postcode}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label>Country:</label>
          <input
            type="text"
            name="country"
            value={formData.address.country}
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UserProfileUpdateForm;
