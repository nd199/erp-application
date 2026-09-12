import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import ConfirmModal from './components/ConfirmModel'
import Model from './components/Model'

function App() {
    return (
        <div>
            <Model
                isOpen={true}
                title={"Model"}
                onClose={() => alert("closed")}
                children={{}}
                footer={{}}
            />
        </div>
    )
}

export default App
