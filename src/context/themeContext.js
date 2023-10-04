import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Crie um contexto
const themeContext = createContext();

export const lightTheme = {
  backgroundColor: "#DDCE22",
  primaryColor: "#8EDD22",
  secondColor: "#DD7122",
  textColor: "black"
};

export const darkTheme = {
  backgroundColor: "#4453BB",
  primaryColor: "#7044BB",
  secondColor: "#448FBB",
  textColor: "white"
};

// Crie um provedor para o contexto
export const ThemeContextProvider = ({ children }) => {
  const [selectedTheme, setSelectedTheme] = useState("light_theme");

  const storeThemeOption = async (theme) => {
    try {
      await AsyncStorage.setItem("theme", theme);
      setSelectedTheme(theme);
    } catch (e) {
      console.log(e.message);
    }
  };

  const retrieveTheme = async () => {
    try {
      const theme = await AsyncStorage.getItem('theme');
      return theme;
    } catch (error) {
      console.log(error.message);
    }
  };

  const setSelectedThemeHandler = async () => {
    let theme = await retrieveTheme();
    if (theme === "light_theme") {
      theme = "dark_theme";
    } else {
      theme = "light_theme";
    }
    await storeThemeOption(theme);
  };

  useEffect(() => {
    retrieveTheme().then(theme => {
      if (theme) {
        setSelectedTheme(theme);
      }
    });
  }, []);

  return (
    <themeContext.Provider value={{ selectedTheme, setSelectedThemeHandler }}>
      {children}
    </themeContext.Provider>
  );
};

// Crie um hook personalizado para usar o contexto
export const useThemeContext = () => {
  const context = useContext(themeContext);
  if (!context) {
    throw new Error('useThemeContext deve ser usado dentro de um ThemeContextProvider');
  }
  return context;
};
