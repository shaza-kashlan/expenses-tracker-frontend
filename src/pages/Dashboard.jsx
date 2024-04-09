import WalletSummaryCard from '../components/WalletSummaryCard';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';



const Dashboard = ({data}) => {

  const wallets = Array.from(new Set(data.map(expense => expense.wallet)))
  
  
  const calculateExpenses = (wallets, data) => {
    const expenseObject = {}
    wallets.forEach(wallet => {
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
      expenseObject[wallet] = {totalExpense, totalIncome}
    });
    return expenseObject
  }


  const expenseByTypeAndWallet = calculateExpenses(wallets, data)
  



  console.log(expenseByTypeAndWallet)
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
    </>
  )
}
export default Dashboard