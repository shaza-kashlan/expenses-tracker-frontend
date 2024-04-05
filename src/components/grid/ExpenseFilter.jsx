import React, { useCallback, useRef, useState, useEffect } from "react";
import { useGridFilter } from "ag-grid-react";

export default ({ model, onModelChange }) => {
	const [closeFilter, setCloseFilter] = useState();
	const [unappliedModel, setUnappliedModel] = useState(model);

	const doesFilterPass = useCallback((params) => {
		// doesFilterPass only gets called if the filter is active,
		// which is when the model is not null (e.g. >= 2010 in this case)
		const filterText = model;
		if (unappliedModel === "income") {
			console.log("would be filtering for income");
		}
		if (unappliedModel === "expense") {
			console.log("would be filtering for expense");
		}
		console.log(unappliedModel);
		return params.data.amount >= 0;
	}, []);

	const afterGuiAttached = useCallback(({ hidePopup }) => {
		setCloseFilter(() => hidePopup);
	}, []);

	// register filter handlers with the grid
	useGridFilter({
		doesFilterPass,
		afterGuiAttached,
	});

	useEffect(() => {
		setUnappliedModel(model);
	}, [model]);

	const onTypeChange = ({ target: { value } }) => {
		setUnappliedModel(value === "all" ? null : value);
	};

	const onClick = () => {
		onModelChange(unappliedModel);
		if (closeFilter) {
			closeFilter();
		}
	};

	return (
		<div className="expense-filter">
			<div>Select expense type</div>
			<label>
				<input
					type="radio"
					name="type"
					value="expense"
					checked={unappliedModel === "expense"}
					onChange={onTypeChange}
				/>{" "}
				Expense
			</label>
			<label>
				<input
					type="radio"
					name="type"
					value="income"
					checked={unappliedModel === "income"}
					onChange={onTypeChange}
				/>{" "}
				Income
			</label>
			<label>
				<input
					type="radio"
					name="type"
					value="all"
					checked={unappliedModel == null}
					onChange={onTypeChange}
				/>{" "}
				All
			</label>
			<button type="button" className="button-small" onClick={onClick}>
				Apply
			</button>
		</div>
	);
};
