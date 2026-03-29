import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="container mx-auto my-32">
      <Outlet />
    </div>
  );
}
