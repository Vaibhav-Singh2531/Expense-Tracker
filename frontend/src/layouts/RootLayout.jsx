import { Outlet } from "react-router-dom";
import Header from "../components/header.jsx";
import { Toaster } from "sonner";

export default function RootLayout() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Toaster richColors />
      <footer className="bg-blue-50 py-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>Cents 2025. All rights reserved</p>
        </div>
      </footer>
    </>
  );
}
