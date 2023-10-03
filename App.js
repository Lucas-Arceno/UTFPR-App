import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./src/screens/Login";
import Register from "./src/screens/Register";
import Dashboard from "./src/screens/Dashboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Calendar from "./src/components/Calendar";
import GradesSalvas from "./src/screens/GradesSalvas";
import { ThemeContextProvider } from "./src/context/themeContext";
import { PremiumContextProvider } from "./src/context/premiumContext";

const Stack = createNativeStackNavigator();

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      if (value !== null) {
        return value;
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  async function isAuth() {
    try {
      const token_ = await getData();
      const response = await fetch("http://10.0.2.2:5000/auth/is-verify", {
        method: "GET",
        headers: { token: token_ },
      });

      const parseRes = await response.json();
      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.log(err.message);
    }
  }

  React.useEffect(() => {
    isAuth();
  });

  //TESTE

  return (
    <ThemeContextProvider>
      <PremiumContextProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {!isAuthenticated ? (
              <>
                <Stack.Screen name="Login" options={{ headerShown: false }}>
                  {(props) => <Login {...props} setAuth={setAuth} />}
                </Stack.Screen>
                <Stack.Screen name="Register" options={{ headerShown: false }}>
                  {(props) => <Register {...props} setAuth={setAuth} />}
                </Stack.Screen>
              </>
            ) : (
              <>
                <Stack.Screen name="Dashboard" options={{ headerShown: false }}>
                  {(props) => <Dashboard {...props} setAuth={setAuth} />}
                </Stack.Screen>
                <Stack.Screen name="Calendar" options={{ headerShown: false }}>
                  {(props) => <Calendar {...props} />}
                </Stack.Screen>
                <Stack.Screen
                  name="GradesSalvas"
                  options={{ headerShown: false }}
                >
                  {(props) => <GradesSalvas {...props} />}
                </Stack.Screen>
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PremiumContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
