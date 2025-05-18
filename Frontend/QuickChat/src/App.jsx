import { Home, Login, Signup } from "./pages/index.js"
import { Toaster } from 'react-hot-toast'
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx'
import { useSelector } from 'react-redux';
function App() {
  const logUser = useSelector(state => state.auth.success)


  return (
    <div className='flex'>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={logUser ? <Home /> : <Navigate to={"/login"} />} />
          <Route path="/login" element={!logUser ? <Login /> : <Navigate to={"/"} />} />
          <Route path="/signup" element={!logUser ? <Signup /> : <Navigate to={"/"} />} />
        </Route>
      </Routes>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </div>
  )
}

export default App
