const FilterDescription = ({columnFilters, setColumnFilters}) => {
    const expenseDescription = columnFilters.find(
        filter => filter.id === "description"
    )?.value || ""

    const onFilterChange = (id, value) => setColumnFilters(
        prev => prev.filter(filter => filter.id !== id).concat({
            id, value
        })
    )
  return (
    <>
        <form>
            <fieldset role="group">
                <input
                type="filter"
                name="filter"
                placeholder="Search ..."
                value={expenseDescription}
                onChange={(event) => onFilterChange("description",event.target.value)}
                />
                <button type="button" onClick={() => onFilterChange("description","")}>Clear</button>
            </fieldset>
        </form>
    </>
  )
}
export default FilterDescription