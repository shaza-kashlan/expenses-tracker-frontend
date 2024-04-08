import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import WalletSummaryCard from '../components/WalletSummaryCard';

const Dashboard = ({data}) => {

  const wallets = Array.from(new Set(data.map(expense => expense.wallet)))
  return (
    <div>
        <h1>Dashboard</h1>
        <p>Got {data.length} bits of data</p>

        {wallets.map(wallet => <WalletSummaryCard key={wallet} wallet={wallet} data={data.filter(expense => expense.wallet === wallet)} />)}
        
    </div>
  )
}
export default Dashboard