import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardHeader,
  IconButton,
  Collapse,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const ExpenseForm = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";
  const { t } = useTranslation();
  //state for snackbar alert
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
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    payment_method: "",
    expense_type: "expense", // Default to expense
    notes: "",
    tags: "",
  });

  const [generalSectionOpen, setGeneralSectionOpen] = useState(true);
  const [tabValue, setTabValue] = useState(0); // 0: Expense, 1: Income
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      if (name === "amount") {
        const updatedAmount =
          tabValue === 0 ? -Math.abs(value) : Math.abs(value);

        return {
          ...prevData,
          [name]: updatedAmount,
        };
      }

      // For other fields, keep the existing values unchanged
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setFormData({
      ...formData,
      expense_type: newValue === 0 ? "expense" : "income",
      description: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],

      payment_method: "",
      notes: "",
      tags: "",
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
      const response = await axios.post(`${API_URL}/expenses`, formData, {
        headers,
      });
      console.log("Entry added successfully:", response.data);

      // Show success Snackbar
      setOpenSnackBar({
        ...openSnackBar,
        open: true,
        severity: "success",
        message: t("entry-added-success"),
      });

      // Reset form data
      setFormData({
        description: "",
        amount: 0,
        category: "",
        date: new Date().toISOString().split("T")[0],
        payment_method: "",
        expense_type: tabValue === 0 ? "expense" : "income",
        notes: "",
        tags: "",
      });
    } catch (error) {
      console.error("There was a problem adding the entry:", error);

      // Show error Snackbar
      setOpenSnackBar({
        ...openSnackBar,
        open: true,
        severity: "error",
        message: t("entry-add-error"),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} id="add-expense-form">
      <Card>
        <CardHeader
          title={t("general-entry-information")}
          action={
            <IconButton
              onClick={() => setGeneralSectionOpen(!generalSectionOpen)}
              aria-label="expand"
              size="small"
            >
              {generalSectionOpen ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          }
        />
        <Collapse in={generalSectionOpen} timeout="auto" unmountOnExit>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label={t("Expense")} />
            <Tab label={t("Income")} />
          </Tabs>
          <div className="muiCardContent-root">
            <small>{t("Description")}</small>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t("Description")}
              required
            />
            <small>{t("Amount")}</small>
            <input
              type="number"
              name="amount"
              id="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder={t("Amount")}
              required
            />
            <small>{t("date")}</small>
            <input
              type="date"
              name="date"
              value={formData.date || ""}
              onChange={handleChange}
              placeholder={t("date")}
              required
            />
            <small>{t("select-catagory of expense")}</small>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">{t("select-catagory of expense")}</option>
              <option value="Home">{t("Home")}</option>
              <option value="Food">{t("Food")}</option>
              <option value="Travel">{t("Travel")}</option>
              <option value="Entertainment">{t("Entertainment")}</option>
              <option value="Clothing">{t("Clothing")}</option>
              <option value="Shopping">{t("Shopping")}</option>
              <option value="Transportation">{t("Transportation")}</option>
              <option value="Repair">{t("Repair")}</option>
              <option value="Pet">{t("Pet")}</option>
              <option value="Health">{t("Health")}</option>
              <option value="660d67ada9de44c5a8b6ca2a">{t("Other")}</option>
            </select>
            <small>{t("select-type")}</small>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              required
            >
              <option value="">{t("select-type")}</option>
              <option value="bank_statement">{t("bank_statement")}</option>
              <option value="credit_card_statement">
                {t("credit_card_statement")}
              </option>
              <option value="invoice">{t("invoice")}</option>
              <option value="cash">{t("Cash")}</option>
            </select>
            <select
              name="expense_type"
              value={formData.expense_type}
              onChange={handleChange}
              required
              disabled
            >
              <option value="expense">{t("Expense")}</option>
              <option value="income">{t("Income")}</option>
            </select>
            <small>{t("Notes")}</small>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder={t("Notes")}
            />
            <small>{t("Tags")}</small>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder={t("Tags")}
            />
          </div>
        </Collapse>
      </Card>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        key={vertical + horizontal}
      >
        <Alert
          onClose={handleClose}
          severity={openSnackBar.severity || "info"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {openSnackBar.message || t("expense-source-added")}
        </Alert>
      </Snackbar>

      <button type="submit">{t("add-new-expense")}</button>
    </form>
  );
};

export default ExpenseForm;
