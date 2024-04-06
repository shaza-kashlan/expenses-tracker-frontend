import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../App";

import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid

function AGGridDemo() {
	// Row Data: The data to be displayed.
	const [rowData, setRowData] = useState([
		{
			date: "2024-01-01",
			description: "some spend",
			amount: 420.69,
			category: "fun",
			payment_method: "cash",
		},
		{
			date: "2024-01-02",
			description: "another spend",
			amount: 694.2,
			category: "unfun",
			payment_method: "credit card",
		},
		{
			date: "2024-01-03",
			description: "oh no, yet more spending",
			amount: 462.9,
			category: "bills",
			payment_method: "bank statement",
		},
	]);

	const amountFilterParams = {
		filterOptions: [
			{
				displayKey: "Expense",
				displayName: "Expense",
				predicate: (_, cellValue) => +cellValue < 0,
				numberOfInputs: 0,
			},
			{
				displayKey: "Income",
				displayName: "Income",
				predicate: (_, cellValue) => +cellValue > 0,
				numberOfInputs: 0,
			},
			{
				displayKey: "All",
				displayName: "All",
				predicate: (_, cellValue) => {
					return true;
				},
				numberOfInputs: 0,
			},
		],
		defaultOption: "All",
		maxNumConditions: 1,
		buttons: ["apply"],
		closeOnApply: true,
	};

	const methodFilterParams = {
		filterOptions: [
			{
				displayKey: "bank",
				displayName: "Bank",
				predicate: (_, cellValue) =>
					cellValue === "bank_account" || cellValue === "bank_statement",
				numberOfInputs: 0,
			},
			{
				displayKey: "credit",
				displayName: "Credit",
				predicate: (_, cellValue) => cellValue === "credit_card_statement",
				numberOfInputs: 0,
			},
			{
				displayKey: "cash",
				displayName: "Cash",
				predicate: (_, cellValue) => cellValue === "cash",
				numberOfInputs: 0,
			},
			{
				displayKey: "All",
				displayName: "All",
				predicate: (_, cellValue) => {
					return true;
				},
				numberOfInputs: 0,
			},
		],
		defaultOption: "All",
		maxNumConditions: 1,
		buttons: ["apply"],
		closeOnApply: true,
	};

	// Column Definitions: Defines the columns to be displayed.
	const [colDefs, setColDefs] = useState([
		{
			field: "date",
			valueFormatter: (d) => `${d.value.replaceAll(".", "-")}`,
			filter: "agDateColumnFilter",
		},
		{ field: "description", filter: true },
		{
			field: "amount",
			valueFormatter: (p) => `${p.value.toFixed(2)} €`,
			cellClassRules: {
				// apply green to electric cars
				"rag-green": (params) => params.value > 0,
				"rag-red": (params) => params.value < 0,
			},

			filter: "agNumberColumnFilter",
			floatingFilter: false,
			filterParams: amountFilterParams,
		},
		{ field: "category" },
		{
			field: "payment_method",
			filter: true,
			filterParams: methodFilterParams,
			valueFormatter: (d) => {
				if (d.value.startsWith("bank_")) {
					return "Bank";
				}
				if (d.value.startsWith("credit_card_")) {
					return "Credit";
				}
				if (d.value.startsWith("cash")) {
					return "Cash";
				}
				return d.value;
			},
		},
	]);

	const pagination = true;
	const paginationPageSize = 100;
	const paginationPageSizeSelector = [100, 200, 500];

	useEffect(() => {
		const getExpenses = async () => {
			const token = localStorage.getItem("accessToken");
			const expenses = await axios.get(`${API_URL}/expenses`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			console.log(expenses.data);
			console.log(`got ${expenses.data.length} expenses`);
			setRowData(expenses.data);
			return;
		};
		getExpenses();
	}, []);

	return (
		<>
			<h1>AG Table Demo</h1>
			<ul
				style={{
					listStyleType: "none",
					textAlign: "left",
					border: "1px grey solid",
				}}
			>
				<li style={{ listStyleType: "none", fontWeight: "600" }}>Findings:</li>
				<li style={{ listStyleType: "none" }}>
					+ Getting data in is super easy
				</li>
				<li style={{ listStyleType: "none" }}>+ Great built in filters</li>
				<li style={{ listStyleType: "none" }}>
					+ Still very fast even with a lot of data
				</li>
				<li style={{ listStyleType: "none" }}>
					- Not too great in mobile view by default
				</li>
				<li style={{ listStyleType: "none" }}>
					- Column grouping and totals are enterprise feature
				</li>
				<li style={{ listStyleType: "none" }}>
					- We would still need to do styling because it looks quite corporate
					by default
				</li>
			</ul>
			<div
				className="ag-theme-quartz" // applying the grid theme
				style={{ height: "750px" }} // the grid will fill the size of the parent container
			>
				<AgGridReact
					rowData={rowData}
					columnDefs={colDefs}
					pagination={pagination}
					paginationPageSize={paginationPageSize}
					paginationPageSizeSelector={paginationPageSizeSelector}
					reactiveCustomComponents={true}
				/>
			</div>
		</>
	);
}
export default AGGridDemo;
