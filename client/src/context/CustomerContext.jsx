// client/src/context/CustomerContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
} from "react";

export const CUSTOMER_THEMES = {
  flytoget: {
    key: "flytoget",
    label: "Flytoget",
    primary: "#f36f21",
    background: "#fff9f4",
    border: "#ffd9b8",
    cardBg: "#ffffff",
    muted: "#8a6a4a",
  },
  vy: {
    key: "vy",
    label: "Vy",
    primary: "#007c6a",
    background: "#f4fbfa",
    border: "#cde7e2",
    cardBg: "#ffffff",
    muted: "#4a6d68",
  },
  coop: {
    key: "coop",
    label: "Coop",
    primary: "#005aa3",
    background: "#f4f7fc",
    border: "#c9d9f5",
    cardBg: "#ffffff",
    muted: "#4f6484",
  },
};

const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
  const [customerKey, setCustomerKey] = useState("flytoget"); // default

  const value = useMemo(() => {
    const theme = CUSTOMER_THEMES[customerKey];
    return {
      customerKey,
      theme,
      setCustomerKey,
      customerLabel: theme.label,
    };
  }, [customerKey]);

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) {
    throw new Error("useCustomer must be used inside CustomerProvider");
  }
  return ctx;
}
