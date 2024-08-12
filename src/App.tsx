import { Routes, Route, useNavigate } from 'react-router-dom';
import { RoutesPaths } from './models/enums/routesPath';
import { useEffect } from 'react';
import Login from './pages/Login';
import Feed from './pages/Feed';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConnection';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const navigate = useNavigate();

  const checkLogin = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate(RoutesPaths.Feed);
      } else {
        navigate(RoutesPaths.Login);
      }
    });
  };

  useEffect(() => {
    checkLogin();
  }, [])

  return (
    <>
      <Routes>
        <Route path={RoutesPaths.Login} element={<Login />} />
        <Route path={RoutesPaths.Feed} element={<Feed />} />
      </Routes>
      <ToastContainer
        position='top-right'
        autoClose={3500}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
      />

    </>
  )
}

export default App;
