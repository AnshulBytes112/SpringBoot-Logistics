import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import LoadBoard from './components/LoadBoard';
import Auth from './components/Auth';

const API_BASE = 'http://localhost:8081';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [loads, setLoads] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [jwtToken, setJwtToken] = useState(localStorage.getItem('jwtToken'));
  const [userProfile, setUserProfile] = useState(null);
  
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setJwtToken(null);
    setUserProfile(null);
  };

  const fetchNetworkData = async () => {
    if (!jwtToken) return;
    try {
      const loadRes = await fetch(`${API_BASE}/api/loads`, { headers: { 'Authorization': `Bearer ${jwtToken}` } });
      const bookRes = await fetch(`${API_BASE}/api/bookings`, { headers: { 'Authorization': `Bearer ${jwtToken}` } });
      
      if (loadRes.status === 401 || bookRes.status === 401 || loadRes.status === 403 || bookRes.status === 403) {
          logout();
          return;
      }

      // Backend returns 204 No Content for empty lists — no JSON body
      const loadData = loadRes.status === 204 ? [] : (loadRes.ok ? await loadRes.json() : []);
      const bookData = bookRes.status === 204 ? [] : (bookRes.ok ? await bookRes.json() : []);
      setLoads(loadData);
      setBookings(bookData);
    } catch (err) {
      console.error('Fetch error:', err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (jwtToken) {
      const decoded = parseJwt(jwtToken);
      setUserProfile(decoded);
    }
    fetchNetworkData();
  }, [currentTab, jwtToken]);

  if (!jwtToken) {
    return <Auth onAuthSuccess={(token) => setJwtToken(token)} />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-[280px] bg-bgSecondary border-r border-glassBorder flex flex-col p-8 fixed h-screen z-10 shadow-2xl">
        <div className="flex items-center gap-3 mb-12">
          <div className="text-3xl drop-shadow-[0_0_8px_rgba(0,195,255,0.4)]">🚚</div>
          <h1 className="text-xl font-bold tracking-wide text-gradient">LogistiX</h1>
        </div>

        <nav className="flex flex-col gap-2 flex-grow">
          <button 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all duration-300
              ${currentTab === 'dashboard' ? 'bg-gradient-to-r from-[rgba(0,195,255,0.1)] to-transparent border-l-4 border-accentSolid text-accentSolid' : 'text-textSecondary hover:bg-white/5 hover:text-textPrimary'}`}
            onClick={() => setCurrentTab('dashboard')}
          >
            <span className="text-xl">📊</span> Analytics
          </button>
          <button 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all duration-300
              ${currentTab === 'loads' ? 'bg-gradient-to-r from-[rgba(0,195,255,0.1)] to-transparent border-l-4 border-accentSolid text-accentSolid' : 'text-textSecondary hover:bg-white/5 hover:text-textPrimary'}`}
            onClick={() => setCurrentTab('loads')}
          >
            <span className="text-xl">🗺️</span> Live Map & Loads
          </button>
        </nav>

        <div className="border-t border-glassBorder pt-6 mt-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-glassBorder flex items-center justify-center font-bold">
                        {userProfile?.firstname ? userProfile.firstname.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">{userProfile?.firstname || 'Guest'}</span>
                        <span className="text-xs text-textSecondary uppercase tracking-widest">{userProfile?.role ? userProfile.role.replace('ROLE_', '') : 'Unknown'}</span>
                    </div>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-textSecondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Logout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </button>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-[280px] flex-grow p-8 max-w-[calc(100vw-280px)]">
        <header className="glass-panel flex justify-between items-center px-8 py-6 mb-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-semibold mb-1 text-gradient">
                  {currentTab === 'dashboard' ? 'Control Tower Dashboard' : 'Global Logistics Matrix'}
                </h2>
                <p className="text-sm text-textSecondary">
                  {currentTab === 'dashboard' ? 'Macro-level analytics and history.' : 'Micro-level fulfillment and live map trackers.'}
                </p>
            </div>
        </header>
        
        {isLoading ? (
          <div className="glass-panel p-12 text-center text-textSecondary animate-pulse">
            Synchronizing with network...
          </div>
        ) : (
          <div className="w-full relative">
            {currentTab === 'dashboard' && <Dashboard loads={loads} bookings={bookings} />}
            {currentTab === 'loads' && <LoadBoard loads={loads} bookings={bookings} userProfile={userProfile} token={jwtToken} refreshData={fetchNetworkData} />}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
