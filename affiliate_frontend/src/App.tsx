// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/LayoutComponent';
import SalesList from './pages/sales/SalesList';
import Wallet from './pages/Wallet';
import Affiliates from './pages/affiliates/Affiliates';
import Dashboard from './pages/Dashboard';
import CreateSale from './pages/sales/CreateSale';
import CreateNewAffiliate from './pages/affiliates/CreateNewAffiliate';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="sales" element={<SalesList />} />
          <Route path="sales/new" element={<CreateSale />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="affiliates" element={<Affiliates />} />
          <Route path="affiliates/new" element={<CreateNewAffiliate/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;