import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  TextField,
  Grid,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { API_URL } from "../../App";
import { FaEdit } from "react-icons/fa";
import profileImage from "../../assets/images/ProfileIcon.png";

const AvatarContainer = styled("div")({
  textAlign: "center",
  marginBottom: (theme) => theme.spacing(2),
});

const AvatarStyled = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(16),
  height: theme.spacing(16),
  borderRadius: "50%",
  objectFit: "cover",
  margin: "auto",
}));

const UserProfileUpdateForm = () => {
  const { t } = useTranslation();
  const [openSnackBar, setOpenSnackBar] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = openSnackBar;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackBar({ ...openSnackBar, open: false });
  };

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
  const nav = useNavigate();

  const [thumbnail, setThumbnail] = useState(profileImage);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("Access token not found in local storage");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response.data;
        setFormData({
          emailAddress: userData.emailAddress || "",
          userName: userData.userName || "",
          fullName: userData.fullName || "",
          address: {
            street: userData.address?.street || "",
            number: userData.address?.number || "",
            city: userData.address?.city || "",
            postcode: userData.address?.postcode || "",
            country: userData.address?.country || "",
          },
          imageUrl: userData.imageUrl || null,
          mobileNumber: userData.mobileNumber || "",
        });

        console.log("respons update", userData);
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

    if (name.includes(".")) {
      const [fieldName, nestedField] = name.split(".");
      setFormData((prevFormData) => ({
        ...prevFormData,
        [fieldName]: {
          ...prevFormData[fieldName],
          [nestedField]: value,
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
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

    try {
      const response = await axios.post(`${API_URL}/users/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = response.data.imageUrl;
      setThumbnail(imageUrl);
      setFormData((prevFormData) => ({
        ...prevFormData,
        imageUrl: imageUrl,
      }));
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
    console.log("send data ", formData);

    try {
      const response = await axios.put(`${API_URL}/users`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("User profile updated successfully:", response.data);
      setOpenSnackBar({
        ...openSnackBar,
        open: true,
        severity: "success",
        message: t("user-updated-success"),
      });
    } catch (error) {
      console.error("Error updating user profile:", error.message);
      setOpenSnackBar({
        ...openSnackBar,
        open: true,
        severity: "error",
        message: t("failed-to-update-user"),
      });
    }
  };

  return (
    <div>
      <h3> </h3>
      <form onSubmit={handleSubmit} id="user-form">
        <AvatarContainer>
          <label htmlFor="fileInput">
            <AvatarStyled alt="Profile" src={thumbnail} variant="rounded" />
            <input
              type="file"
              id="fileInput"
              name="thumbnail"
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: "none" }}
            />
            <IconButton component="span">
              <FaEdit />
            </IconButton>
          </label>
        </AvatarContainer>

        <small className="small">{t("email")}</small>
        <input
          label="Email Address"
          variant="outlined"
          value={formData.emailAddress}
          disabled
        />

        <small className="small">{t("user-name")}</small>
        <input
          size="small"
          label="Username"
          value={formData.userName}
          disabled
        />

        <small className="small">{t("full-name")}</small>
        <input
          label="Full Name"
          value={formData.fullName}
          name="fullName"
          onChange={(e) => handleChange(e)}
        />

        <small className="small">{t("mobile-number")}</small>
        <input
          label="Mobile Number"
          value={formData.mobileNumber}
          name="mobileNumber" // Corrected name attribute
          onChange={handleChange}
        />

        <small className="small">{t("address")}</small>
        <small className="small">{t("street")}</small>
        <input
          label="Street"
          value={formData.address.street}
          name="address.street"
          onChange={handleChange}
        />

        <small className="small">{t("street-number")}</small>
        <input
          label="Street Number"
          name="address.number"
          value={formData.address.number}
          onChange={handleChange}
        />

        <small className="small">{t("city")}</small>
        <input
          label="City"
          value={formData.address.city}
          name="address.city"
          onChange={handleChange}
        />

        <small className="small">{t("postcode")}</small>
        <input
          label="PostCode"
          name="address.postcode"
          value={formData.address.postcode}
          onChange={handleChange}
        />

        <small className="small">{t("country")}</small>
        <input
          label="Country"
          name="address.country"
          value={formData.address.country}
          onChange={handleChange}
        />

        <button type="submit" variant="contained" color="primary">
          {t("updateProfile")}
        </button>

        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={openSnackBar.open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={openSnackBar.severity}
            sx={{ width: "100%" }}
          >
            {openSnackBar.message}
          </Alert>
        </Snackbar>
      </form>
    </div>
  );
};

export default UserProfileUpdateForm;