import { Outlet } from 'react-router-dom';

import Footer from './components/_molecules/Footer';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div className="flex flex-col h-screen justify-between">
      <Navbar />
      <div className="mb-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default App;
