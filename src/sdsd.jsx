import "./App.scss";
import { useState } from "react";
import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid

function App() {
	// Row Data: The data to be displayed.
	// const [rowData, setRowData] = useState([
	// 	{ make: "Tesla", model: "Model Y", price: 64950, electric: true },
	// 	{ make: "Ford", model: "F-Series", price: 33850, electric: false },
	// 	{ make: "Toyota", model: "Corolla", price: 29600, electric: false },
	// ]);

	// // Column Definitions: Defines the columns to be displayed.
	// const [colDefs, setColDefs] = useState([
	// 	{ field: "make" },
	// 	{ field: "model" },
	// 	{ field: "price" },
	// 	{ field: "electric" },
	// ]);

/////////////////////

		// Row Data: The data to be displayed.
		const [rowData, setRowData] = useState([
		  { make: "Tesla", model: "Model Y", price: 64950, electric: true },
		  { make: "Ford", model: "F-Series", price: 33850, electric: false },
		  { make: "Toyota", model: "Corolla", price: 29600, electric: false },
		  { make: 'Mercedes', model: 'EQA', price: 48890, electric: true },
		  { make: 'Fiat', model: '500', price: 15774, electric: false },
		  { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
		]);
		
		// Column Definitions: Defines & controls grid columns.
		const [colDefs, setColDefs] = useState([
		  { field: "make" },
		  { field: "model" },
		  { field: "price" },
		  { field: "electric" }
		]);
	

	return (
		<>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
			<div
				className="ag-theme-quartz" // applying the grid theme
				style={{ height: 500 }} // the grid will fill the size of the parent container
			>
				<AgGridReact rowData={rowData} columnDefs={colDefs} />
			</div>

			{/* <div className={"ag-theme-quartz"} style={{ width: '100%', height: '100%' }}>
      <AgGridReact rowData={rowData} columnDefs={colDefs}
      />
    </div> */}

		</>
	);
}

export default App;
