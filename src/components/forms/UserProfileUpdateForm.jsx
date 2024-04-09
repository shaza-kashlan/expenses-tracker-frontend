import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import profileImage from "../../assets/images/ProfileIcon.png";
import { API_URL } from "../../App";

const UserProfileUpdateForm = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    emailAddress: "",
    userName: "",
    fullName: "",
    address: {
      street: "",
      number: "",
      city: "",
      postcode: "",
      country: "",
    },
    imageUrl: null,
    mobileNumber: "",
  });

  const [thumbnail, setThumbnail] = useState(profileImage);

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
        console.log("response", userData);
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
          mobileNumber: userData.mobileNumber || "",
          imageUrl: userData.imageUrl || "",
        }));

        if (userData.imageUrl) {
          setThumbnail(userData.imageUrl);
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
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("imageUrl", file);

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Access token not found in local storage");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    };

    try {
      const response = await axios.post(`${API_URL}/users/upload`, formData, {
        headers,
      });

      // Assuming the response from Cloudinary contains the image URL
      const imageUrl = response.data.imageUrl;

      // Update thumbnail with the Cloudinary URL
      setThumbnail(imageUrl);

      console.log("Response from upload:", response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Access token not found in local storage");
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Update formData with imageUrl from thumbnail (Cloudinary URL)
      const updatedFormData = {
        ...formData,
        imageUrl: thumbnail, // Assuming thumbnail is the Cloudinary URL
      };

      console.log("\n \n useform to send", updatedFormData);
      const response = await axios.put(`${API_URL}/users`, updatedFormData, {
        headers,
      });

      console.log("User profile updated successfully:", response.data);

      localStorage.setItem("imageUrl", thumbnail);
    } catch (error) {
      console.error("Error updating user profile:", error.message);
    }
  };

  return (
    <div>
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Profile Image */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
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
                borderRadius: "40%",
                overflow: "hidden",
                display: "inline-block",
                position: "relative",
              }}
            >
              <img
                src={thumbnail}
                alt="Thumbnail"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
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
