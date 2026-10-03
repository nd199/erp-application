import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

function Layout() {
    return (
        <div className="flex h-screen bg-[var(--bg-primary)]">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <Topbar />
                <main className="flex-1 overflow-y-auto bg-[var(--bg-body)] p-6 main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Layout
