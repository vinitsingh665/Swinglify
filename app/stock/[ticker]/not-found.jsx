import Link from 'next/link';
import Sidebar from '../../../components/Sidebar';
import TopBar from '../../../components/TopBar';
import './stock-page.css';

export default function StockNotFound() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <TopBar />
        <div className="stock-page">
          <div className="stock-not-found">
            <h2>Stock Not Found</h2>
            <p>We couldn't find data for this stock. It may not be listed on NSE/BSE or the current ticker is invalid.</p>
            <Link href="/screener" className="stock-cta-btn primary">Browse All Stocks →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
