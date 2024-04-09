import WalletSummaryCard from '../components/WalletSummaryCard';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import {BarChart, PieChart} from "@mui/x-charts"


const Dashboard = ({data}) => {

  const wallets = Array.from(new Set(data.map(expense => expense.wallet)))
  
  const calculateExpenses = (wallets, data) => {
    const expenseArray = []
    wallets.forEach(wallet => {
      const expenseObject = {}
      const filteredData = data.filter(element => element.wallet === wallet)
      const totalExpense = filteredData.reduce((acc,item) => {
        if (item.amount < 0) {
          return acc + Math.round(Math.abs(item.amount))
        }
        return acc
      },0)
      const totalIncome = filteredData.reduce((acc,item) => {
        if (item.amount > 0) {
          return acc + Math.round(Math.abs(item.amount))
        }
        return acc
      },0)
      expenseArray.push({wallet, name: wallet[0].toUpperCase() + wallet.slice(1), totalExpense, totalIncome})
    });
    return expenseArray
  }

  const getExpenseCountPerWallet = (data) => {
    const counts = data.reduce((acc,item) => {
      return {...acc, [item.wallet]: acc[item?.wallet] + 1 || 1 }
    },{})
    //console.log('counts',counts)
    const countsArr = Object.keys(counts).map((element,index) => ({id: index, value: counts[element], label: element[0].toUpperCase() + element.slice(1) }))
    return countsArr
  }

  const expenseCountByWallet = getExpenseCountPerWallet(data)
  const expenseByTypeAndWallet = calculateExpenses(wallets, data)

  const chartData = Object.keys(expenseByTypeAndWallet).reduce((acc,cur) => {
    const data = Object.values(expenseByTypeAndWallet[cur])
    return [...acc, {data}]
  },[])

  // console.log(Object.keys(expenseByTypeAndWallet))
  // console.log(JSON.stringify(chartData,null,4))
  
  //console.log(expenseByTypeAndWallet)
  return (
    <>
        <h1>Dashboard</h1>
        <p>Got {data.length} bits of data</p>

        <Splide 
        aria-label="Your wallets"
        options={{
          type: "slide",
          role: '',
          gap: '1rem',
          width: 400,
          mediaQuery: 'min',
          arrows: false,
          breakpoints: {
            412: {
              width: 400
            },
            640: {
              width: 600,
              arrows: true,
            },
            960: {
              width: 900,
              arrows: true,
              perPage: 2
            },
          }
        }}>
          {wallets.map(wallet => 
            <SplideSlide key={wallet} >
              <WalletSummaryCard wallet={wallet} data={data.filter(expense => expense.wallet === wallet)} />
            </SplideSlide>)}
        </Splide>
        <hr />
        <h2>Income vs Expense</h2>
        <div style={{minHeight: "600px", maxHeight: "600px", minWidth:"100%", maxWidth:"100%"}}>
          <BarChart
            dataset={expenseByTypeAndWallet}
            xAxis={[{ scaleType: 'band', dataKey: "wallet" }]}
            series={[{dataKey: "totalExpense", label: "Expense"}, {dataKey: "totalIncome", label: "Income"}]}
          />
        </div>

        <hr />
        <h2>Total tracked expenses</h2>
        <div style={{minHeight: "400px", maxHeight: "600px", minWidth:"80%",  maxWidth:"80%"}}>
          <PieChart 
            series={[{data: expenseCountByWallet}]}
            slotProps={{
              legend: {
                direction: 'row',
                position: { vertical: 'bottom', horizontal: 'right' },
                padding: 25,
              },
            }}
          />
        </div>
    </>
  )
}
export default Dashboard