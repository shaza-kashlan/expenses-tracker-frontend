import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Tooltip from "@mui/material/Tooltip";

const AddExpenseSourceForm = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    format: "",
    public: true,
    uniqueField: "",
    mapping: {
      date: "",
      description: "",
      notes: "",
      amount: "",
      payee: "",
    },
    numberStyle: "normal",
    image: null,
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const response = await axios.post(`${API_URL}/sources`, formData, {
        headers,
      });

      console.log("Source added successfully:", response.data);
      // Reset form data
      setFormData({
        name: "",
        type: "",
        format: "",
        public: true,
        uniqueField: "",
        mapping: {
          date: "",
          description: "",
          notes: "",
          amount: "",
          payee: "",
        },
        numberStyle: "normal",
      });
    } catch (error) {
      console.error("There was a problem adding the source:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} id="add-expense-form">
      <h3>Add New Expense Source </h3>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder={t("enter_the_name_of_this_source")}
        required
      />

      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        required
      >
        <option value="">{t("select-type")}</option>
        <option value="bank_statement">{t("bank_statement")}</option>
        <option value="credit_card_statement">
          {t("credit_card_statement")}
        </option>
        <option value="invoice">{t("invoice")}</option>
      </select>
      <select
        name="format"
        value={formData.format}
        onChange={handleChange}
        required
      >
        <option value="">{t("select-format")}</option>
        <option value="csv">{t("csv")}</option>
        <option value="tsv">{t("tsv")}</option>
        <option value="md">{t("markdown")}</option>
        <option value="text">{t("text")}</option>
      </select>

      <small>{t("mapping")}</small>
      <Tooltip title={t("date-tooltip")} placement="top-start">
        <div className="form-group">
          <input
            type="datetime-local"
            className="form-control"
            name="mapping.date"
            value={formData.mapping.date}
            onChange={handleChange}
            placeholder={t("date")}
            onTouchStart={(e) => e.stopPropagation()}
          />
        </div>
      </Tooltip>
      <Tooltip title={t("description-tooltip")} placement="top-start">
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            name="mapping.description"
            value={formData.mapping.description}
            onChange={handleChange}
            placeholder={t("description")}
            onTouchStart={(e) => e.stopPropagation()}
          />
        </div>
      </Tooltip>
      <Tooltip title={t("notes-tooltip")} placement="top-start">
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            name="mapping.notes"
            value={formData.mapping.notes}
            onChange={handleChange}
            placeholder={t("notes")}
            onTouchStart={(e) => e.stopPropagation()}
          />
        </div>
      </Tooltip>
      <Tooltip title={t("amount-tooltip")} placement="top-start">
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            name="mapping.amount"
            value={formData.mapping.amount}
            onChange={handleChange}
            placeholder={t("amount")}
            onTouchStart={(e) => e.stopPropagation()}
          />
        </div>
      </Tooltip>
      <Tooltip title={t("payee-tooltip")} placement="top-start">
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            name="mapping.payee"
            value={formData.mapping.payee}
            onChange={handleChange}
            placeholder={t("payee")}
            onTouchStart={(e) => e.stopPropagation()}
          />
        </div>
      </Tooltip>
      <small>{t("number-style")}</small>
      <select
        name="numberStyle"
        value={formData.numberStyle}
        onChange={handleChange}
        required
      >
        <option value="normal">{t("normal")}</option>
        <option value="german">{t("german")}</option>
      </select>
      <small>{t("public-des")}</small>
      <label>
        {t("public")}
        <input
          type="checkbox"
          name="public"
          checked={formData.public}
          onChange={handleChange}
        />
      </label>
      <small>{t("uniqFiels-des")}</small>
      <input
        type="text"
        name="uniqueField"
        value={formData.uniqueField}
        onChange={handleChange}
        placeholder={t("uniqueField")}
      />

      <button type="submit">Add Expense Source</button>
    </form>
  );
};

export default AddExpenseSourceForm;
