import logo from './logo.svg';
import './App.css';
import Meet from './Pages/Meet/Meet';
import SignUp from './Pages/SignUp/SignUp';
import OTP from './Pages/SignUp/OTP';
import Login from './Pages/SignUp/Login';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from './Components/Navbar/Navbar';
import Dashboard from './Pages/Dashboard/Dashboard';
import InterviewerProfile from './Pages/profile/InterviewerProfile';
import InterviewerMeet from './Pages/Meet/InterviewerMeet';
import CandidateProfile from './Pages/profile/CandidateProfile';
import ChatGptQuestion from './Components/screening/ChatGptQuestion';
import ManuallyQuestion from './Components/screening/ManuallyQuestion';
import Candidates from './Pages/Dashboard/CandidatesList/CandidatesList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/meet/:id" element={<Meet />} />
        <Route path="/interview/:id" element={<InterviewerMeet />} />
        <Route path="/login" element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/candidate-list' element={<Candidates/>} />
        <Route path='/profile' element={<InterviewerProfile />} />
        <Route path="/candidates/:id" element={<CandidateProfile />} />
        <Route path="/candidates/:id/auto-generate" element={<ChatGptQuestion />} />
        <Route path="/candidates/:id/manually-generate" element={<ManuallyQuestion />} />
      </Routes>
    </Router>
  );
}

export default App;
