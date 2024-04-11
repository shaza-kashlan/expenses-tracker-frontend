import WalletSummaryCard from "../components/WalletSummaryCard";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { BarChart, PieChart } from "@mui/x-charts";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = ({data}) => {
  const {expenses, sources} = useContext(AuthContext)
  const [expenseData, setExpenseData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [wallets, setWallets] = useState([])
  const [expenseCountByWallet, setExpenseCountByWallet] = useState(null)
  const [expenseByTypeAndWallet, setExpenseByTypeAndWallet] = useState(null)
  const [chartData, setChartData] = useState(null)
  const { t } = useTranslation();
  const navigate = useNavigate()

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
      //console.log('trying to push something', wallet, totalExpense, totalIncome)
      wallet._id && expenseArray.push({
        wallet: wallet._id,
        name: wallet.name[0].toUpperCase() + wallet.name.slice(1),
        totalExpense,
        totalIncome,
      });
    });
    return expenseArray;
  };

  const getExpenseCountPerWallet = (data) => {
    //console.log('doing per wall', data)
    const counts = data.reduce((acc, item) => {
      return { ...acc, [item.source.name]: acc[item?.source.name] + 1 || 1 };
    }, {});
    console.log('cuunts',counts)
    console.log('wallets',sources.sources)
    const countsArr = Object.keys(counts).map((element, index) => ({
      id: index,
      value: t(`${counts[element]}`),
      label: element[0].toUpperCase() + element.slice(1),
    }));
    console.log('arr',countsArr)
    return countsArr;
  };

  useEffect(() => {
    //console.log('loggin in effect', data)
    if (data?.count > 0) {
      //console.log('got something', data)

      const calculatedWallets = Array.from(new Set(data.expenses.map((expense) => ({_id: expense.source._id, name: expense.source.name}))))

      setWallets(sources.sources);

      const calculatedExpenseCountPerWallet = getExpenseCountPerWallet(data.expenses)
      
      setExpenseCountByWallet(calculatedExpenseCountPerWallet);

      const calculatedExpenseByTypeAndWallet = calculateExpenses(sources.sources, data.expenses)
      
      setExpenseByTypeAndWallet(calculatedExpenseByTypeAndWallet);

      const calculatedChartData = Object.keys(calculatedExpenseByTypeAndWallet).reduce((acc, cur) => {
        const data = Object.values(calculatedExpenseByTypeAndWallet[cur]);
        return [...acc, { data }];
      }, [])
      
      setChartData(calculatedChartData)

      setExpenseData(data.expenses)
      setIsLoading(false)

    }
    else if (data?.count === 0) {
      console.log('still waiting')
      setExpenseData(data.expenses)
      setIsLoading(false)
    }

  },[expenses])





   //console.log("obbb",Object.keys(expenseByTypeAndWallet))
  // console.log(JSON.stringify(chartData,null,4))

  //console.log(expenseByTypeAndWallet)
  return isLoading ? 
    (<h2 aria-busy="true" style={{marginTop: "35%"}}>Loading dashboard</h2>)
  : expenseData.length === 0 
    ? <article style={{marginTop: "35%"}}><h2>add your first expense</h2><button onClick={() => {navigate('/expenses')}}>Track an expense</button></article>
    : (
    <>
      <h1>Dashboard</h1>
      {/* <p>{t("Got")} {data.length} {t("bits of data")}</p> */}

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
        {wallets.map((wallet) => {
          const filteredExpenses = expenseData.filter((expense) => expense.source._id === wallet._id)
          return (
            filteredExpenses.length > 0 &&
          <SplideSlide key={wallet._id}>
            <WalletSummaryCard
              wallet={wallet.name}
              data={filteredExpenses}
            />
          </SplideSlide>
        )})}
      </Splide>
      <hr />
      <h2>{t("Income vs Expense")}</h2>
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
          xAxis={[{ scaleType: "band", dataKey: "name" }]}
          series={[
             { dataKey: "totalExpense", label: t("Expense")},
             { dataKey: "totalIncome", label: t("Income")},
          ]}
        />
      </div>
      {t("You've had")}
      <hr />
      <h2>{t("Total tracked expenses")}</h2>
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
