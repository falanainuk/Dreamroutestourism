import React, { createContext, useContext, useEffect, useState } from 'react';

interface Settings {
  siteName: string;
  description: string;
  currency: string;
  heroImage: string;
  logo: string;
  socials: {
    instagram: string;
    twitter: string;
    facebook: string;
  };
}

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
}

interface Destination {
  id: string;
  name: string;
  country: string;
  price: number;
  image: string;
}

interface AppData {
  settings: Settings;
  services: Service[];
  destinations: Destination[];
}

interface DataContextType {
  data: AppData | null;
  loading: boolean;
  updateData: (newData: AppData) => Promise<boolean>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const json = await res.json();
        setData(json);
      } else {
        const text = await res.text();
        console.error("Expected JSON from /api/data, got:", text.slice(0, 100));
      }
    } catch (e) {
      console.error("Failed to fetch data:", e);
    } finally {
      setLoading(false);
    }
  };

  const updateData = async (newData: AppData) => {
    try {
      const res = await fetch('/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
        credentials: 'include'
      });
      if (res.ok) {
        setData(newData);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Failed to update data:", e);
      return false;
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, updateData, refreshData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
