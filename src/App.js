import logo from './logo.svg';
import './App.css';
import Meet from './Pages/Meet/Meet';
import SignUp from './Pages/SignUp/SignUp';
import OTP from './Pages/SignUp/OTP';
import Login from './Pages/SignUp/Login';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from './Components/Navbar/Navbar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/meet" element={<Meet />} />
        <Route path="/login" element={<Login />} />
        <Route path='/navbar' element={<Navbar />} />
      </Routes>
    </Router>
  );
}

export default App;
