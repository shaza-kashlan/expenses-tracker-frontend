import React, { useEffect } from "react";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  IconButton,
  Collapse,
  Snackbar,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { API_URL } from "../../App";
import { AuthContext } from "../../contexts/AuthContext";
import { makeToast } from "../../App";



const UpdateExpenseForm = () => {
  const { expenseId } = useParams();
  const {setExpenses, categories, sources} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true)

  const nav = useNavigate();
  const { t } = useTranslation();
  //state for snackbar alert
  const [openSnackBar, setOpenSnackBar] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = openSnackBar;

  const handleClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackBar({ ...openSnackBar, open: false });
  };
  const [generalSectionOpen, setGeneralSectionOpen] = useState(true);
  const [tabValue, setTabValue] = useState(0); // 0: Expense, 1: Income

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: "",
    payment_method: "",
    expense_type: "",
    notes: "",
    source: "",
    tags: "",
  });

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
    setFormData({
      ...formData,
      expense_type: newValue === 0 ? "expense" : "income",
      description: formData.description || "",
      amount: formData.amount || "",
      category: formData.category || "",
      date: formData.date || "",
      payment_method: formData.payment_method || "",
      source: formData.source || "",
      notes: formData.notes || "",
      tags: formData.tags || "",
    });
  };

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
          params: {include_source_details: true}
        });
        //console.log("here is details of expense", response.data);
        // Update formData with existing source data
        setFormData({
          description: response.data.description || "",
          amount: response.data.amount || "",
          category: response.data?.category?._id || "",
          date: response.data.date || "",
          payment_method: response.data.payment_method || "",
          expense_type: response.data.expense_type || "",
          notes: response.data.notes || "",
          tags: response.data.tags || "",
          source: response.data?.source?._id || ""
        });
        setTabValue(response.data.expense_type === "expense" ? 0 : 1);
        setIsLoading(false)
      } catch (error) {
        console.log(
          "there was an error while fetching expense to update",
          error
        );
        //setError(error.response.data.message);
        makeToast("error", "couldn't find that expense 😔, you will be redirected to the expense list")
        setTimeout(() => nav("/my-expenses"), 1500)
      }
    };
    getExpense();
  }, [expenseId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

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

    let updatedAmount = formData.amount;
    if (tabValue === 0) {
      updatedAmount = -Math.abs(updatedAmount); // Expense
    } else {
      updatedAmount = Math.abs(updatedAmount); // Income
    }

    try {
      const updatedExpense = {
        ...formData,
        amount: updatedAmount,
      }
      const response = await axios.put(
        `${API_URL}/expenses/${expenseId}`,
        updatedExpense,
        { headers }
      );

      //console.log("expense updated successfully:", response.data);

      // Update context
      setExpenses(prevExpenses => ({
        count: prevExpenses.count + 1, 
        expenses: prevExpenses.expenses.map(expense => 
            expense._id === expenseId ? {...updatedExpense, _id: expenseId} : expense)
          })
        )

      makeToast("success",t("entry-updated-success"))
      nav('/my-expenses')
      //setTimeout(() => nav('/my-expenses'), 1000)
      
    } catch (error) {
      console.error("There was a problem updating the expense:", error);
      makeToast("error",t("failed-to-update-entry"))
    }
  };


  return isLoading ? (
      (<div style={{marginTop: "35%"}}>
        <h2 aria-busy="true">Loading expense</h2>
      </div>)
    ) : (
    <form onSubmit={handleUpdateExpense} id="update-expense-form" className="collapsible-form ">
      <Card>
        <CardHeader
          title={t("general-entry-information")}
          action={
            <IconButton
              onClick={() => setGeneralSectionOpen(!generalSectionOpen)}
              aria-label="expand"
              size="small"
              disabled
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
              value={Math.abs(formData.amount)}
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
            <small>{t("select-expense-category")}</small>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">{t("select-expense-category")}</option>
              {categories.categories.map(category => {
                return <option key={category._id} value={category._id}>{category.icon} {t(category.name)}</option>
              })}
            </select>

            <small>{t("select-type")}</small>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              required
            >
              <option value="">{t("select-type")}</option>
              {sources.sources.map(source => (
                <option key={source._id} value={source._id}>{t(source.name)}</option>
              )
              )}
            </select>

            <select
            className="hidden"
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
      <button type="submit">{t("update-expense")}</button>
    </form>);
};

export default UpdateExpenseForm;
