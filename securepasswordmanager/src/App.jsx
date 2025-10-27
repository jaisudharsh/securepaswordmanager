import React from 'react';
import './App.css';
import MainPage from './MainPage';
import Login from './Login';
import SignUp from './SignUp';
import ProtectRoute from './ProtectRoute';
import PasswordTable from "./PasswordTable";
import AddPasswordForm from "./AddPasswordForm";
import Base from './Base';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';

function App() {
    return (
        <div className="App">
          <Router>
          <Routes>
            <Route path='/' element={<Base/>} />
            <Route path="/Login" element={<Login />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route element={<ProtectRoute/>}>
              <Route path="/MainPage" element={<MainPage/>}/>
              <Route path="/passwords" element={<PasswordTable />} />
              <Route path="/add-password" element={<AddPasswordForm />} />
            </Route>
          </Routes>
          </Router>
        </div>
    );
}

export default App;
