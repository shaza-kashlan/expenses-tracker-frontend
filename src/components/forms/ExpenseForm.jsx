import React from "react";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Tooltip from "@mui/material/Tooltip";

const ExpenseForm = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";
  const nav = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category:"",
    // category: {
    //   name: "",
    //   public: true,
    // },
    date: "",
    payment_method: "",
    expense_type: "",
    notes: "",
  });

  // const [description, setDescription] = useState("");
  // const [amount, setAmount] = useState("");
  // const [category, setCategory] = useState(null);
  // const [date, setDate] = useState("");
  // const [payment_method, setPayment_method] = useState("");
  // const [expense_type, setExpense_type] = useState("");
  // const [notes, setNotes] = useState("");
  // const [tags, setTags] = useState("");
  // const [name, setName] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const newValue = type === "checkbox" ? checked : value;

    // Split the name into nested levels based on dots (.)
    const [fieldName, nestedKey] = name.split(".");

    setFormData((prevData) => {
      // If the field name corresponds to a nested property like "mapping.date"
      if (nestedKey && prevData[fieldName]) {
        return {
          ...prevData,
          [fieldName]: {
            ...prevData[fieldName],
            [nestedKey]: newValue,
          },
        };
      }

      // Otherwise, update the top-level field directly
      return {
        ...prevData,
        [name]: newValue,
      };
    });
  };

  // *********** create new expense *************
  const handleExpense = async (event) => {
    event.preventDefault();
    // const newExpense = {
    //   description,
    //   amount,
    //   category:{
    //     name
    //   },
    //   date,
    //   payment_method,
    //   expense_type,
    //   notes,
    // };
    // console.log("newExpense", newExpense);

    // Retrieve token from local storage
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("Access token not found in local storage");
      return;
    }

    // Set headers with token
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Send formData to backend server
    console.log("form data", formData);

    try {
      const response = await axios.post(`${API_URL}/expenses`, formData, {
        headers,
      });
      console.log("Expense added successfully:", response.data);
      // Reset form data
      setFormData({
        description: "",
        amount: "",
        category:"",
        // category: {
        //   name: "",
        //   public: true,
        // },
        date: "",
        payment_method: "",
        expense_type: "",
        notes: "",
      });
    } catch (error) {
      console.error("There was a problem adding the expense:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleExpense}>
        <h3>Add New Expense</h3>

        {/* <div>
          <input
            type="text"
            name="category.name"
            value={formData.category.name}
            onChange={handleChange}
            placeholder={t("enter_the_name_of_category")}
            required
          />
        </div> */}

        <div>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder={t("enter_the_name_of_category")}
            required
          />
        </div>

        <div>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder={t("Description")}
          />
        </div>
        <div>
          <input
            type="text"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            placeholder={t("Amount")}
          />
        </div>
        {/* <div>
          <select
            name="category"
            required
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            <option value="">{t("select-catagory of expense")}</option>
            <option value="Home">{t("Home")}</option>
            <option value="Food">{t("Food")}</option>
            <option value="Travel">{t("Travel")}</option>
            <option value="Entertainment">{t("Entertainment")}</option>
            <option value="Clothing">{t("Clothing")}</option>
            <option value="Shoping">{t("Shoping")}</option>
            <option value="Transportation">{t("Transportation")}</option>
            <option value="Repair">{t("Repair")}</option>
            <option value="Pet">{t("Pet")}</option>
            <option value="Health">{t("Health")}</option>
            <option value="Other">{t("Other")}</option>
          </select>
        </div> */}
        {/* <small>{t("date")}</small> */}
        <Tooltip title={t("date-tooltip")} placement="top-start">
          <div className="form-group">
            <input
              type="datetime-local"
              className="form-control"
              name="date"
              value={formData.date}
              onChange={handleChange}
              placeholder={t("date")}
              onTouchStart={(e) => e.stopPropagation()}
            />
          </div>
        </Tooltip>
        <div>
          <select
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            required
          >
            <option value="">{t("select-Payment method")}</option>
            <option value="cash">{t("Cash")}</option>
            <option value="creditCard">{t("Credit Card")}</option>
            <option value="onlineTransfer">{t("Online Transfer")}</option>
          </select>
        </div>
        <div>
          <select
            name="expense_type"
            value={formData.expense_type}
            onChange={handleChange}
          >
            <option value="">{t("select-Expense type")}</option>
            <option value="one-time">{t("one-time")}</option>
            <option value="recurring">{t("recurring")}</option>
            <option value="reimbursable">{t("reimbursable")}</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder={t("Notes")}
          />
        </div>
        {/* <div>
          <label>
            {t("Personal")}
            <input
              type="checkbox"
              name="Personal"
              checked={formData.public}
              onChange={handleChange}
            />
          </label>
          <label>
            {t("Business")}
            <input
              type="checkbox"
              name="Business"
              checked={formData.Business}
              onChange={handleChange}
            />
          </label>
        </div> */}

        <button type="submit">{t("Add new Expense")}</button>
      </form>
    </div>
  );
};

export default ExpenseForm;
