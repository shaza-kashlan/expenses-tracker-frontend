import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const Dashboard = ({data}) => {

  const wallets = Array.from(new Set(data.map(expense => expense.wallet)))
  return (
    <div>
        <h1>Dashboard</h1>
        <p>Got {data.length} bits of data</p>

        {wallets.map(wallet => <p key={wallet}>{wallet}</p>)}
        
    </div>
  )
}
export default Dashboard