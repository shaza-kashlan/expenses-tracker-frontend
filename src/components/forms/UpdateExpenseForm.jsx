import React, { useEffect } from "react";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

const UpadteExpenseForm = () => {
  const { expenseId } = useParams();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";
  const nav = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: "",
    payment_method: "",
    expense_type: "",
    notes: "",
    tags:"",
  });

  // ******************* get the information of the expense **********************
  useEffect(() => {
    const getExpense = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("Access token not found in local storage");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get(`${API_URL}/expenses/${expenseId}`, {
          headers: headers,
        });
        console.log("here is details of expense", response.data);
        // Update formData with existing source data
        setFormData({
          description: response.data.description || "",
          amount: response.data.amount || "",
          category: response.data.category || "",
          date: response.data.date || "",
          payment_method: response.data.payment_method || "",
          expense_type: response.data.expense_type || "",
          notes: response.data.notes || "",
          tags: response.data.tags || "",
        });
      } catch (error) {
        console.log(
          "there was an error while fetching expense to update",
          err.response.data.message
        );
        setError(err.response.data.message);
      }
    };
    getExpense();
  }, [expenseId]);

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
  // *********** update expense *************
  const handleUpdateExpense = async (e) => {
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
        `${API_URL}/expenses/${expenseId}`,
        formData,
        { headers }
      );

      console.log("expense updated successfully:", response.data);
    } catch (error) {
      console.error("There was a problem updating the expense:", error);
    }
  };

  return (
      <form onSubmit={handleUpdateExpense}>
        <h3>Update Expense</h3>
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
        <div>
          <select
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
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
            <option value="660d67ada9de44c5a8b6ca2a">{t("Other")}</option>
          </select>
        </div>
        {/* <small>{t("date")}</small> */}
        <Tooltip title={t("date-tooltip")} placement="top-start">
          <div className="form-group">
            <input
              type="text"
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
        <div>
          <select
            name="tags"
            value={formData.tags}
            onChange={handleChange}
          >
            <option value="">{t("select-Expense label")}</option>
            <option value="Personal">{t("Personal")}</option>
            <option value="Business">{t("Business")}</option>
          </select>
        </div>

        <button type="submit">{t("Update Expense")}</button>
      </form>
  );
};

export default UpadteExpenseForm;
