import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export function AppLayout() {
  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] flex flex-col">
      <Navbar />
      <Outlet />
    </div>
  )
}
