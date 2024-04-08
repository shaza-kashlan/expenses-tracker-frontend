
import { useNavigate } from "react-router-dom"
import dayjs from "dayjs"

const WalletSummaryCard = ({data, wallet}) => {

  const totalBalance = data.reduce((acc,expense) => acc + expense.amount,0)

  const sortedTransactions = data.sort((a,b) => dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1)
  const opened = dayjs(sortedTransactions[0].date).format('ddd MMM D, [\']YY')
  const lastUsed = dayjs(sortedTransactions[sortedTransactions.length - 1].date).format('ddd MMM D, [\']YY')

  const navigate = useNavigate()

  console.log('got this data',data)
  return (
    <article className="wallet-summary-card">
      <header>
        <h2>{wallet}</h2> 
        <p className="align-right">{totalBalance.toFixed(2)} €</p>
        </header>
      <section>
      <p>You've had <strong>{data.length}</strong> transactions with this wallet</p>
      <p className="push-apart">Account first used: <span>{opened}</span></p>
      <p className="push-apart">Last used: <span>{lastUsed}</span></p>
      </section>
      <footer>
        <button type="button" className="button-small" onClick={() => navigate(`/sources/660e9ba097cea6ff1b929df4/expenses`)} >View transactions</button>
        <button type="button" className="button-small" onClick={() => navigate(`/sources/660e9ba097cea6ff1b929df4`)} >Edit this wallet</button>
      </footer>
    </article>
  )
}
export default WalletSummaryCard