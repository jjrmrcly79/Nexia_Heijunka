import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import DataEntry from './pages/DataEntry';
import Calculations from './pages/Calculations';
import Sequencing from './pages/Sequencing';
import HeijunkaBox from './pages/HeijunkaBox';
import Dashboards from './pages/Dashboards';
import Manual from './pages/Manual';

export default function App() {
  return (
    <>
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/data" element={<DataEntry />} />
          <Route path="/calculations" element={<Calculations />} />
          <Route path="/sequencing" element={<Sequencing />} />
          <Route path="/heijunka-box" element={<HeijunkaBox />} />
          <Route path="/dashboards" element={<Dashboards />} />
          <Route path="/manual" element={<Manual />} />
        </Routes>
      </main>
    </>
  );
}
