import dayjs from "dayjs";
import isoWeek from 'dayjs/plugin/isoWeek' 
dayjs.extend(isoWeek)

export const dateFilterFunction = (row,column,value) => {
    const date = new Date(row.getValue("date"))
    const dateNow = new Date()
    switch(value) {
        case "this week": {
            return dayjs(date).isoWeek() === dayjs().isoWeek()
        }
        case "last week": {
            return dayjs(date).isoWeek() === dayjs().isoWeek() - 1
        }
        case "this month": {
            
            return date.getMonth() === dateNow.getMonth()
        }
        case "last month": {
           
            return date.getMonth() === dateNow.getMonth() - 1
        }
        case "this year": {
            date.getFullYear()
            return date.getFullYear() === dateNow.getFullYear()
        }
        case "last year": {
            return date.getFullYear() === dateNow.getFullYear() - 1
        }
        default: {
            return true
        }
    }
}



const DateFilter = ({columnFilters, setColumnFilters}) => {

    const expenseDate = columnFilters.find(
        filter => filter.id === "date"
    )?.value || ""
    
    const onFilterChange = (id, value) => setColumnFilters(
        prev => prev.filter(filter => filter.id !== id).concat({
            id, value
        })
    )

  return (
    <form>
        <label htmlFor="date">Date range</label>
        <select 
        name="date" 
        aria-label="Select date range..." 
        defaultValue={"all"} 
        onChange={(event) => onFilterChange("date",event.target.value)}
    >
            <option value="all">All</option>
            <option value="this week">This week</option>
            <option value="last week">Last week</option>
            <option value="this month">This month</option>
            <option value="last month">Last month</option>
            <option value="this year">This year</option>
            <option value="last year">Last year</option>
        </select>
        <small>Select a date range for your expenses</small>
    </form>
  )
}
export default DateFilter