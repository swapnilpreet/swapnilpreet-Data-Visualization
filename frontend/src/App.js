
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './Pages/Dashboard';
import ProtectedPage from './Components/ProtectedPage';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Navbar from './Components/Navbar';

function App() {

  
  return (
    <div className="App">
     <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>} />
      <Route path='/' element={
        <ProtectedPage>
          <Dashboard/>
        </ProtectedPage>
      }/>
     </Routes>
    </div>
  );
}

export default App;
