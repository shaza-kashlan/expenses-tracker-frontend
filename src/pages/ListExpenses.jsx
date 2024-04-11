import { useContext, useEffect, useState } from "react"
import ExpenseTable from "../components/tables/ExpenseTable"
import { AuthContext } from "../contexts/AuthContext"

const ListExpenses = () => {

    const {expenses} = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      if (!expenses ) {
        console.log('got nothing', expenses)
      } else {
        console.log('got something', expenses)
        setIsLoading(false)
      }

    },[expenses])
 
  return isLoading 
            ? <h2 style={{marginTop: "35%"}} aria-busy="true">Loading expenses</h2>
            : <ExpenseTable data={expenses.expenses} /> 

}
export default ListExpenses