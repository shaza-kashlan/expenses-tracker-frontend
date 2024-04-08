import React from "react";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Tooltip from "@mui/material/Tooltip";

const ExpenseForm = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";
  const nav = useNavigate();
  const { t } = useTranslation();

  // *********** create new expense *************
  const handleExpense = async (event) => {
    event.preventDefault();
    const newExpense = {
      description,
      amount,
      category,
      date,
      paymentMethod,
      expenseType,
      notes,
    };
    console.log("newExpense", newExpense);

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

    try {
      const response = await axios.post(`${API_URL}/expenses`, newExpense, {
        headers,
      });
      console.log("Expense added successfully:", response.data);
    } catch (error) {
      console.error("There was a problem adding the expense:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleExpense}>
        <h3>Add New Expense</h3>
        <div>
          <div>
            <input
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              required
              placeholder={t("Description")}
            />
          </div>
          <div>
            <input
              type="text"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              required
              placeholder={t("Amount")}
            />
          </div>
          <div>
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
          </div>
          {/* <small>{t("date")}</small> */}
          <Tooltip title={t("date-tooltip")} placement="top-start">
            <div className="form-group">
              <input
                type="datetime-local"
                className="form-control"
                name="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
                placeholder={t("date")}
                onTouchStart={(e) => e.stopPropagation()}
              />
            </div>
          </Tooltip>
          <div>
            <select
              name="paymentMethod"
              onChange={(e) => {
                setPaymentMethod(e.target.value);
              }}
            >
              <option value="">{t("select-Payment method")}</option>
              <option value="cash">{t("Cash")}</option>
              <option value="creditCard">{t("Credit Card")}</option>
              <option value="onlineTransfer">{t("Online Transfer")}</option>
            </select>
          </div>
          <div>
            <select
              name="ExpenseType"
              onChange={(e) => {
                setExpenseType(e.target.value);
              }}
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
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
              }}
              placeholder={t("Notes")}
            />
          </div>
          <div>
            <label>{t("Personal")}
            <input
              type="radio"
              value="Personal"
              checked={tags === "Personal"}
              onChange={(e) => {
                setTags(e.target.value);
              }}
            /></label>
            <label>{t("Business")}
            <input
              type="radio"
              value="Business"
              checked={tags === "Business"}
              onChange={(e) => {
                setTags(e.target.value);
              }}
            /></label>
          </div>
        </div>
        <button type="submit">{t("Add new Expense")}</button>
      </form>
    </div>
  );
};

export default ExpenseForm;
