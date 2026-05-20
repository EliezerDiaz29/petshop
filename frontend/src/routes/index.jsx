import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import PetsPage from '../pages/Pets/PetsPage'
import OwnersPage from '../pages/Owner/OwnerPage'

function AppRoutes(){
    return(
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/dashboard' element={<Dashboard />}/>
            <Route path='/pets' element={<PetsPage />}/>
            <Route path='/owners' element={<OwnersPage />}/>


        </Routes>
    )
}

export default AppRoutes