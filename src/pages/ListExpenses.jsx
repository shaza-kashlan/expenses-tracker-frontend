import { useContext } from "react"
import ExpenseTable from "../components/tables/ExpenseTable"
import { AuthContext } from "../contexts/AuthContext"

const ListExpenses = () => {

    const {expenses, setExpenses} = useContext(AuthContext)
 
  return (
        <ExpenseTable data={expenses.expenses} />
  )
}
export default ListExpenses