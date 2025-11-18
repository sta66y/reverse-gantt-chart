import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Auth from './pages/Auth';
import Projects from './pages/Projects';
import NotFound from './pages/NotFound/NotFound';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/projects" element={<Projects />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}