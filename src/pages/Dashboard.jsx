import WalletSummaryCard from "../components/WalletSummaryCard";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { BarChart, PieChart } from "@mui/x-charts";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";


const Dashboard = ({data}) => {
  const {expenses} = useContext(AuthContext)
  const [expenseData, setExpenseData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [wallets, setWallets] = useState([])
  const [expenseCountByWallet, setExpenseCountByWallet] = useState(null)
  const [expenseByTypeAndWallet, setExpenseByTypeAndWallet] = useState(null)
  const [chartData, setChartData] = useState(null)

  const calculateExpenses = (wallets, data) => {
    //console.log('doing expenses' , data, wallets);
    const expenseArray = [];
    wallets.forEach((wallet) => {
      const expenseObject = {};
      const filteredData = data.filter((element) => element.source._id === wallet._id);
      const totalExpense = filteredData.reduce((acc, item) => {
        if (item.amount < 0) {
          return acc + Math.round(Math.abs(item.amount));
        }
        return acc;
      }, 0);
      const totalIncome = filteredData.reduce((acc, item) => {
        if (item.amount > 0) {
          return acc + Math.round(Math.abs(item.amount));
        }
        return acc;
      }, 0);
      expenseArray.push({
        wallet: wallet._id,
        name: wallet.name[0].toUpperCase() + wallet.name.slice(1),
        totalExpense,
        totalIncome,
      });
    });
    return expenseArray;
  };

  const getExpenseCountPerWallet = (data) => {
    console.log('doing per wall', data)
    const counts = data.reduce((acc, item) => {
      return { ...acc, [item.source.name]: acc[item?.source.name] + 1 || 1 };
    }, {});
    //console.log('counts',counts)
    const countsArr = Object.keys(counts).map((element, index) => ({
      id: index,
      value: counts[element],
      label: element[0].toUpperCase() + element.slice(1),
    }));
    return countsArr;
  };

  useEffect(() => {
    //console.log('loggin in effect', data)
    if (data?.count > 0) {
      console.log('got something', data)

      const calculatedWallets = Array.from(new Set(data.expenses.map((expense) => ({_id: expense.source._id, name: expense.source.name}))))

      setWallets(calculatedWallets);

      const calculatedExpenseCountPerWallet = getExpenseCountPerWallet(data.expenses)
      
      setExpenseCountByWallet(calculatedExpenseCountPerWallet);

      const calculatedExpenseByTypeAndWallet = calculateExpenses(calculatedWallets, data.expenses)
      
      setExpenseByTypeAndWallet(calculatedExpenseByTypeAndWallet);

      const calculatedChartData = Object.keys(calculatedExpenseByTypeAndWallet).reduce((acc, cur) => {
        const data = Object.values(calculatedExpenseByTypeAndWallet[cur]);
        return [...acc, { data }];
      }, [])
      
      setChartData(calculatedChartData)

      setExpenseData(data.expenses)
      setIsLoading(false)

    }
    else {
      console.log('still waiting')
    }

  },[expenses])





  // console.log(Object.keys(expenseByTypeAndWallet))
  // console.log(JSON.stringify(chartData,null,4))

  //console.log(expenseByTypeAndWallet)
  return isLoading ? 
    (<h2 aria-busy="true" style={{marginTop: "35%"}}>Loading dashboard</h2>)
  : (
    <>
      <h1>Dashboard</h1>
      <p>Got {data.length} bits of data</p>

      <Splide
        aria-label="Your wallets"
        options={{
          type: "slide",
          role: "",
          gap: "1rem",
          width: 400,
          mediaQuery: "min",
          arrows: false,
          breakpoints: {
            412: {
              width: 400,
            },
            640: {
              width: 600,
              arrows: true,
            },
            960: {
              width: 900,
              arrows: true,
              perPage: 2,
            },
          },
        }}
      >
        {wallets.map((wallet) => (
          <SplideSlide key={wallet._id + crypto.randomUUID()}>
            <WalletSummaryCard
              wallet={wallet.name}
              data={expenseData.filter((expense) => expense.source._id === wallet._id)}
            />
          </SplideSlide>
        ))}
      </Splide>
      <hr />
      <h2>Income vs Expense</h2>
      <div
        style={{
          minHeight: "600px",
          maxHeight: "600px",
          minWidth: "100%",
          maxWidth: "100%",
        }}
      >
        <BarChart
          dataset={expenseByTypeAndWallet}
          xAxis={[{ scaleType: "band", dataKey: "wallet" }]}
          series={[
            { dataKey: "totalExpense", label: "Expense" },
            { dataKey: "totalIncome", label: "Income" },
          ]}
        />
      </div>

      <hr />
      <h2>Total tracked expenses</h2>
      <div
        style={{
          minHeight: "400px",
          maxHeight: "600px",
          minWidth: "80%",
          maxWidth: "80%",
        }}
      >
        <PieChart
          series={[{ data: expenseCountByWallet }]}
          slotProps={{
            legend: {
              direction: "row",
              position: { vertical: "bottom", horizontal: "right" },
              padding: 25,
            },
          }}
        />
      </div>
    </>
  );
};
export default Dashboard;
