import React, { useState } from "react";
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
import { LightSensor } from "expo-sensors";
import * as Brightness from 'expo-brightness';

const Stack = createNativeStackNavigator();

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  React.useEffect(() => {
    (async () => {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status === 'granted') {
        if(illuminance < 1000){
          Brightness.setSystemBrightnessAsync(1);
        }else{
          console.log("teste")
          Brightness.setSystemBrightnessAsync(0.1);
        }
      }
    })();
  }, [illuminance]);


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

  const [illuminance, setIlluminance] = useState(0);

  React.useEffect(() => {
    const toggle = () => {
      if (subscription) {
        unsubscribe();
      } else {
        subscribe();
      }
    };

    const subscribe = () => {
      subscription = LightSensor.addListener(data => {
        setIlluminance(data.illuminance);
      });
    };

    const unsubscribe = () => {
      if (subscription) {
        subscription.remove();
        subscription = null;
      }
    };

    let subscription;

    const intervalId = setInterval(() => {
      toggle();
    }, 1000);

    return () => {
      clearInterval(intervalId);
      unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    console.log(illuminance);
  }, [illuminance]);


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
