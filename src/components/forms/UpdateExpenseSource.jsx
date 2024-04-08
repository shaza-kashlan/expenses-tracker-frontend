import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

const UpdateExpenseSource = () => {
  const { sourceId } = useParams();
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
  });

  useEffect(() => {
    const fetchSourceData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("Access token not found in local storage");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get(`${API_URL}/sources/${sourceId}`, {
          headers: headers,
        });
        const existingSource = response.data;

        // Update formData with existing source data
        setFormData({
          name: existingSource.name || "",
          type: existingSource.type || "",
          format: existingSource.format || "",
          public: existingSource.public,
          uniqueField: existingSource.uniqueField || "",
          mapping: {
            ...formData.mapping,
            date: existingSource.mapping?.date || "",
            description: existingSource.mapping?.description || "",
            notes: existingSource.mapping?.notes || "",
            amount: existingSource.mapping?.amount || "",
            payee: existingSource.mapping?.payee || "",
          },
          numberStyle: existingSource.numberStyle || "normal",
        });
      } catch (error) {
        console.error("Error fetching source data:", error);
      }
    };

    fetchSourceData();
  }, [sourceId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    // For nested fields like mapping.date, split the name to access nested properties
    const [fieldName, nestedKey] = name.split(".");

    setFormData((prevData) => {
      if (nestedKey) {
        return {
          ...prevData,
          [fieldName]: {
            ...prevData[fieldName],
            [nestedKey]: newValue,
          },
        };
      } else {
        // If the field is not nested, update it directly
        return {
          ...prevData,
          [name]: newValue,
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Access token not found in local storage");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.put(
        `${API_URL}/sources/${sourceId}`,
        formData,
        { headers }
      );

      console.log("Source updated successfully:", response.data);
    } catch (error) {
      console.error("There was a problem updating the source:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} id="update-expense-form">
      <h3>Update Expense Source</h3>

      {/* Name */}
      <div className="form-field">
        <label>{t("Name")}</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      {/* Type */}
      <div className="form-field">
        <label>{t("Type")}</label>
        <select
          id="type"
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
      </div>

      {/* Format */}
      <div className="form-field">
        <label>{t("Format")}</label>
        <select
          id="format"
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
      </div>

      {/* Mapping Fields */}
      <div className="form-field">
        <small>{t("mapping")}</small>
        <Tooltip title={t("date-tooltip")} placement="top-start">
          <div>
            <label>{t("Date")}</label>
            <input
              type="datetime-local"
              id="mapping-date"
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
      </div>

      {/* Number Style */}
      <div className="form-field">
        <small>{t("number-style")}</small>
        <label>{t("Number Style")}</label>
        <select
          id="numberStyle"
          name="numberStyle"
          value={formData.numberStyle}
          onChange={handleChange}
          required
        >
          <option value="normal">{t("normal")}</option>
          <option value="german">{t("german")}</option>
        </select>
      </div>

      {/* Public */}
      <div className="form-field">
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
      </div>

      {/* Unique Field */}
      <div className="form-field">
        <small>{t("uniqFiels-des")}</small>
        <input
          type="text"
          name="uniqueField"
          value={formData.uniqueField}
          onChange={handleChange}
          placeholder={t("uniqueField")}
        />
      </div>

      {/* Submit Button */}
      <button type="submit">{t("Update Expense Source")}</button>
    </form>
  );
};

export default UpdateExpenseSource;
