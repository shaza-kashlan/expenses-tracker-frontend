
import { useNavigate } from "react-router-dom"
import dayjs from "dayjs"
import { useTranslation } from "react-i18next";

const WalletSummaryCard = ({data, wallet}) => {
  if (data.length === 0) { 
    return
  }
  console.log('wall card data', data, 'wallet card wallet',wallet)
  const { t } = useTranslation();
  const totalBalance = data.reduce((acc,expense) => acc + expense.amount,0)

  const sortedTransactions = data.sort((a,b) => dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1)
  const opened = dayjs(sortedTransactions[0].date).format('ddd MMM D, [\']YY')
  const lastUsed = dayjs(sortedTransactions[sortedTransactions.length - 1].date).format('ddd MMM D, [\']YY')

  const navigate = useNavigate()

  //console.log('got this data',data)
 

    return (
      <article className="wallet-summary-card">
        <header>
          <h2>{t(`${wallet}`)}</h2> 
          <p className="align-right">{totalBalance.toFixed(2)} €</p>
          </header>
        <section>
        <p>{t("You've had")} <strong>{data.length}</strong>{t(" transactions with this wallet")} </p>
        <p className="push-apart">{t("Account first used:")}<span>{opened}</span></p>
        <p className="push-apart">{t("Last used:")} <span>{lastUsed}</span></p>
        </section>
        <footer>
          <button type="button" className="button-small" onClick={() => navigate(`/my-expenses`)} >{t("View transactions")}</button>
          <button type="button" className="button-small" onClick={() => navigate(`/sources/${data[0].source._id}`)} >{t("Edit this wallet")}</button>
        </footer>
      </article>
    )
  
}
export default WalletSummaryCard