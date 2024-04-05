import { useEffect, useState } from "react";
import axios, { Axios } from "axios";
import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { API_URL } from "../App";
import ExpenseFilter from "../components/grid/ExpenseFilter";

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
		{ field: "payment_method" },
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
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
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
