import { Outlet } from 'react-router-dom';
import Admin from "./Admin";

export default function AdminLayout() {
  return (
    <div className="flex flex-col">
      <div className="flex">
        <Admin />
        <main className="min-h-screen w-full bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}