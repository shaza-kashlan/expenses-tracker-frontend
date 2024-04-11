import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  IconButton,
  Collapse,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { API_URL } from "../../App";

const UpdateExpenseSourceForm = () => {
  const { sourceId } = useParams();
  const { t } = useTranslation();
  //state for collapse cards
  const [gerneralSectionOpen, setGeneralSectionOpen] = useState(true);
  const [mappingSectionOpen, setMappingSection] = useState(true);
  const [formatSectionOpen, setFormatSectionOpen] = useState(true);

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
    dateFormat: "", // New field added
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
            date: existingSource.mapping?.date || "",
            description: existingSource.mapping?.description || "",
            notes: existingSource.mapping?.notes || "",
            amount: existingSource.mapping?.amount || "",
            payee: existingSource.mapping?.payee || "",
          },
          numberStyle: existingSource.numberStyle || "normal",
          dateFormat: existingSource.dateFormat || "", // New field added
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

    const requiredFields = ["name", "type", "format"];
    const isValid = requiredFields.every((field) => !!formData[field]);

    if (!isValid) {
      // If required fields are missing, show error Snackbar
      setOpenSnackBar({
        ...openSnackBar,
        open: true,
        severity: "error",
        message: t("fill-required-fields"),
      });
      setGeneralSectionOpen(true);
      return;
    }
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

      //console.log("Source updated successfully:", response.data);
      setOpenSnackBar({
        ...openSnackBar,
        open: true,
        severity: "success",
        message: t("expense-source-updated"),
      });
    } catch (error) {
      console.error("There was a problem updating the source:", error);
      setOpenSnackBar({
        ...openSnackBar,
        open: true,
        severity: "error",
        message: t("failed-to-update-expense-source"),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} id="add-expense-source-form" className="collapsible-form ">
      <Card className="muiCard-root">
        <CardHeader
          className="muiCardHeader-root"
          title={t("gerneral-source-information")}
          action={
            <IconButton
              onClick={() => setGeneralSectionOpen(!gerneralSectionOpen)}
              aria-label="expand"
              size="small"
            >
              {gerneralSectionOpen ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          }
        ></CardHeader>

        <Collapse
          in={gerneralSectionOpen}
          timeout="auto"
          unmountOnExit
          className="muiCardContent-root"
        >
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
            <option value="bank">{t("bank_statement")}</option>
            <option value="credit_card">
              {t("credit_card_statement")}
            </option>
            <option value="cash_invoice">{t("invoice")}</option>
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
        </Collapse>
      </Card>
      <Card className="muiCard-root">
        <CardHeader
          className="muiCardHeader-root"
          title={t("mapping-source-information")}
          action={
            <IconButton
              onClick={() => setMappingSection(!mappingSectionOpen)}
              aria-label="expand"
              size="small"
            >
              {mappingSectionOpen ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          }
        ></CardHeader>
        <Collapse
          in={mappingSectionOpen}
          timeout="auto"
          unmountOnExit
          className="muiCardContent-root"
        >
          <Tooltip title={t("date-tooltip")} placement="top-start">
            <div className="form-group">
              <input
                type="text"
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
        </Collapse>
      </Card>
      <Card className="muiCard-root">
        <CardHeader
          className="muiCardHeader-root"
          title={t("format-source-information")}
          action={
            <IconButton
              onClick={() => setFormatSectionOpen(!formatSectionOpen)}
              aria-label="expand"
              size="small"
            >
              {formatSectionOpen ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          }
        ></CardHeader>
        <div style={{ backgroundColor: "rgba(211,211,211,0.4)" }}>
          <Collapse
            in={formatSectionOpen}
            timeout="auto"
            unmountOnExit
            className="muiCardContent-root"
          >
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
            <small>{t("date-Format")}</small>
            <input
              type="text"
              className="form-control"
              name="dateFormat"
              value={formData.dateFormat}
              onChange={handleChange}
              placeholder={t("DateFormat")}
              onTouchStart={(e) => e.stopPropagation()}
            />
            <small>{t("uniqFiels-des")}</small>
            <input
              type="text"
              name="uniqueField"
              value={formData.uniqueField}
              onChange={handleChange}
              placeholder={t("uniqueField")}
            />
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
          </Collapse>
        </div>
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
          {openSnackBar.message || t("expense-source-updated")}
        </Alert>
      </Snackbar>
      <button type="submit">{t("update-expense-form")}</button>
    </form>
  );
};

export default UpdateExpenseSourceForm;
