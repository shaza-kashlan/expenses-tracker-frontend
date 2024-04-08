import WalletSummaryCard from '../components/WalletSummaryCard';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';



const Dashboard = ({data}) => {

  const wallets = Array.from(new Set(data.map(expense => expense.wallet)))
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