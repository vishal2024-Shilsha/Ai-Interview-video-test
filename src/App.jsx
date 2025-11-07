import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
// import CreateAccount from './page/Account'
// import Header from './page/Header'
// import IntroAnalysisApp from './page/REsult'
import Dashboard from './components/admin/dashboard'
import Login from './page/Login'
import NotFound from './page/NotFound'
import IntroAnalysisApp from './page/REsult'
import RecordPage from './page/Record'
import SuccessPage from './page/Success'

function App() {

  return (
    <BrowserRouter>
      <Routes>
      <Route path='/admin' element={<Dashboard />} />
      <Route path='/' element={<Login />} />
      <Route path='/result' element={<IntroAnalysisApp />} />
      <Route path='/record' element={<RecordPage/>} />
      <Route path='/success' element={<SuccessPage/>} />
      <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
