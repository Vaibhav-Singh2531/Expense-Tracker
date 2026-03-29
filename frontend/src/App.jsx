import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import SignInPage from "./pages/auth/SignIn.jsx";
import SignUpPage from "./pages/auth/SignUp.jsx";
import RootLayout from "./layouts/RootLayout.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";

// Migrated Pages
import Dashboard from "./pages/dashboard/page.jsx";
import AccountPage from "./pages/account/[id]/page.jsx";
import AddTransactionPage from "./pages/transaction/create/page.jsx";

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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/account/:id" element={<AccountPage />} />
              <Route path="/transaction/create" element={<AddTransactionPage />} />
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
