import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./src/constants/queryClient";
import { Provider } from "react-redux";
import { registerRootComponent } from "expo";
import { CustomDrawer } from "./src/navigation";
import { AuthProvider } from "./src/context/AuthContext";
import store from "./src/redux/store";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Provider store={store}>
          <AuthProvider>
            <CustomDrawer />
          </AuthProvider>
        </Provider>
      </NavigationContainer>
    </QueryClientProvider>
  );
};

registerRootComponent(App);

export default App;
