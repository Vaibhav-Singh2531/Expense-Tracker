export async function setCurrencySymbol() {
  if (typeof window === "undefined") return; // prevent SSR

  if (!localStorage.getItem("currencySymbol")) {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      const symbol = data.country_code === "IN" ? "₹" : "$";
      localStorage.setItem("currencySymbol", symbol);
    } catch {
      localStorage.setItem("currencySymbol", "$"); // fallback
    }
  }
}
