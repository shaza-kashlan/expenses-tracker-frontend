import React from "react";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
  const handleExpense = (event) => {
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

    axios
      .post(`${API_URL}/expenses`, newExpense)
      .then((response) => {
        console.log("new expense was created", response.data);
        nav("/");
      })
      .catch((err) => {
        console.log(
          "there was an error while adding new expense",
          err.response.data.message
        );
        setError(err.response.data.message);
      });
  };

  return (
    <div>
      <form onSubmit={handleExpense}>
        <div>
          <div>
            <label>{t("Description")}</label>
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
            <label>{t("Amount")}</label>
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
            <label>{t("Category")}</label>
            <select
              name="category"
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            >
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
          <div>
            <label>{t("Date")}</label>
            <DatePicker
              selected={date}
              onChange={(Date) => {
                setDate(Date);
              }}
              dateFormat="dd/MM/yyyy"
            />
            {/* <input
              type="text"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
              required
              placeholder={t("Date")}
            /> */}
          </div>
          <div>
            <label>{t("payment Method")}</label>
            <select
              name="paymentMethod"
              onChange={(e) => {
                setPaymentMethod(e.target.value);
              }}
            >
              <option value="cash">{t("Cash")}</option>
              <option value="creditCard">{t("Credit Card")}</option>
              <option value="onlineTransfer">{t("Online Transfer")}</option>
            </select>
          </div>
          <div>
            <label>{t("Expense Type")}</label>
            <select
              name="ExpenseType"
              onChange={(e) => {
                setExpenseType(e.target.value);
              }}
            >
              <option value="one-time">{t("one-time")}</option>
              <option value="recurring">{t("recurring")}</option>
              <option value="reimbursable">{t("reimbursable")}</option>
            </select>
          </div>
          <div>
            <label>{t("Notes")}</label>
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
            <label>{t("Personal")}</label>
            <input
              type="radio"
              value="Personal"
              checked={tags === "Personal"}
              onChange={(e) => {
                setTags(e.target.value);
              }}
            />
            <label>{t("Business")}</label>
            <input
              type="radio"
              value="Business"
              checked={tags === "Business"}
              onChange={(e) => {
                setTags(e.target.value);
              }}
            />
          </div>
        </div>
        <button type="submit">{t("Submit")}</button>
      </form>
    </div>
  );
};

export default ExpenseForm;
