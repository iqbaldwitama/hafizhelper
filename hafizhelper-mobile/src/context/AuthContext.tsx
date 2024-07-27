import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  fullName: string;
  email: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  userToken: string | null;
  user: User | null;
}

export interface AuthContextType {
  authState: AuthState;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
}

const defaultAuthState: AuthState = {
  isLoggedIn: false,
  userToken: null,
  user: null,
};

const AuthContext = createContext<AuthContextType>({
  authState: defaultAuthState,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] =
    useState<AuthState>(defaultAuthState);

  useEffect(() => {
    const loadStoredData = async () => {
      const storedToken = await AsyncStorage.getItem("userToken");
      const storedUser = await AsyncStorage.getItem("userObject");
      if (storedToken && storedUser) {
        setAuthState({
          isLoggedIn: true,
          userToken: storedToken,
          user: JSON.parse(storedUser),
        });
      }
    };

    loadStoredData();
  }, []);

  const login = async (token: string, user: User) => {
    await AsyncStorage.setItem("userToken", token);
    await AsyncStorage.setItem("userObject", JSON.stringify(user));
    setAuthState({ isLoggedIn: true, userToken: token, user });
    console.log("authState", authState);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userObject");
    await AsyncStorage.clear();
    setAuthState({ isLoggedIn: false, userToken: null, user: null });
  };

  const contextValue = useMemo(
    () => ({ authState, login, logout }),
    [authState, login, logout],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
