import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import SignInPage from "./pages/auth/SignIn.jsx";
import SignUpPage from "./pages/auth/SignUp.jsx";
import RootLayout from "./layouts/RootLayout.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Home />} />
            
            <Route element={<MainLayout />}>
              {/* Dashboard and related pages will be added in Part 2 */}
              <Route path="/dashboard" element={<div className="text-xl font-bold">Dashboard Migrating in Part 2...</div>} />
            </Route>

            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
