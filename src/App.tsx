import { Login } from "./components/Login"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Signup } from "./components/SignUp";

export function App() {
  return (
    <>
      <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
    </>
  )
}