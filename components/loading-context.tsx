
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';

const LoadingContext = createContext<LoadingContextType | null>(null);

type LoadingContextType = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

export const LoadingProvider = ({ children }: { children: any }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{loading, setLoading}}>
        {children}
    </LoadingContext.Provider>
);
};

export const useLoading = () => useContext(LoadingContext);