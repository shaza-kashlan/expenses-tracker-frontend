import { useTranslation } from "react-i18next";
export const typeFilter = (row, _, value) => {
    
    if (value === "expense") {
        return row.getValue("amount") < 0
    }
    if (value === "income") {
        return row.getValue("amount") > 0
    }
    return true
}

const FilterType = ({ columnFilters, setColumnFilters}) => {
    const { t } = useTranslation();
    const expenseType = columnFilters.find(
        filter => filter.id === "amount"
    )?.value || ""

    const onFilterChange = (id, value) => setColumnFilters(
        prev => prev.filter(filter => filter.id !== id).concat({
            id, value
        })
    )

  return (
    <>
    <form>
        <label htmlFor="type">{t("The expense type")}</label>
        <select 
            name="type" 
            aria-label="Select type..." 
            defaultValue={"all"} 
            onChange={(event) => onFilterChange("amount",event.target.value)}
        >
            <option value="all">{t("All")}</option>
            <option value="expense">{t("Expense")}</option>
            <option value="income">{t("Income")}</option>
        </select>
        <small>{t("Select the type of expense")}</small>
    </form>
    </>
  )
}
export default FilterType