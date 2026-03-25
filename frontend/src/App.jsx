import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes, Link, Navigate } from "react-router-dom";
import SignInPage from "./pages/auth/SignIn";
import SignUpPage from "./pages/auth/SignUp";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function DefaultLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b flex justify-between items-center bg-background">
        <Link to="/" className="text-2xl font-bold gradient-title">cents</Link>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <div className="flex gap-4">
            <Link to="/sign-in" className="btn hover:bg-muted p-2 rounded">Sign In</Link>
            <Link to="/sign-up" className="btn bg-primary text-primary-foreground p-2 rounded">Sign Up</Link>
          </div>
        </SignedOut>
      </header>
      <main className="flex-1 p-4">
        <SignedIn>
          <h1 className="text-xl">Welcome to your dashboard</h1>
          {/* Dashboard components will be migrated here later */}
        </SignedIn>
        <SignedOut>
          <div className="text-center py-20">
            <h1 className="text-4xl font-extrabold mb-4">Take Control of Your Finances</h1>
            <p className="text-muted-foreground">Please sign in to continue.</p>
          </div>
        </SignedOut>
      </main>
    </div>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DefaultLayout />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
