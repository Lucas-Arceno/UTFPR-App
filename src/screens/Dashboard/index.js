import * as React from "react";
import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../components/Header";
import {
  useThemeContext,
  lightTheme,
  darkTheme,
} from "../../context/themeContext";
import { usePremiumContext } from "../../context/premiumContext";

function Dashboard({ navigation, setAuth }) {
  const [name, setName] = React.useState("");
  const { selectedTheme } = useThemeContext();
  const theme = selectedTheme === "light_theme" ? lightTheme : darkTheme;
  const { getPremium } = usePremiumContext();
  const [isPremium, setIsPremium] = React.useState(false);

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

  const getName = async () => {
    try {
      const token_ = await getData();
      const response = await fetch("http://10.0.2.2:5000/dashboard/", {
        method: "GET",
        headers: { token: token_ },
      });

      const parseRes = await response.json();
      setName(parseRes.user_name);
    } catch (err) {
      console.log(err.message);
    }
  };

  React.useEffect(() => {
    getName();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingTop: 50,
      backgroundColor: theme.backgroundColor,
    },
    textStyle: {
      fontSize: 30,
      fontWeight: "bold",
      color: theme.textColor,
    },
    buttonStyle: {
      marginTop: 15,
      backgroundColor: theme.secondColor,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      elevation: 3, // Sombra no Android
      shadowColor: "#000", // Sombra no iOS
      shadowOpacity: 0.3, // Sombra no iOS
      shadowOffset: { width: 2, height: 2 }, // Sombra no iOS
      shadowRadius: 3, // Sombra no iOS
      width: 150,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
    imageStyle: {
      width: "100%",
      height: 100,
    },
  });

  React.useEffect(() => {
    async function checkIsPremium() {
      const aux = await getPremium();
      if (aux.is_premium === null || aux.is_premium === false) {
        setIsPremium(false);
      } else {
        setIsPremium(true);
      }
    }

    checkIsPremium(); 

    const intervalId = setInterval(checkIsPremium, 10000); 

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <Header setAuth={setAuth} name={name} loginState={"1"} />
      <View style={styles.container}>
        {isPremium ? (
          <></>
        ) : (
          <Image
            style={styles.imageStyle}
            source={require("./Anuncie-Aqui-1.png")}
          />
        )}
        <Text style={styles.textStyle}>Ola, {name} 👋</Text>
        <Text style={styles.textStyle}>O que deseja fazer?</Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() =>
            navigation.navigate("Calendar", { fileMaterias: [], name: name })
          }
        >
          <Text style={styles.buttonText}>Montar Grade</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => navigation.navigate("GradesSalvas", { name: name })}
        >
          <Text style={styles.buttonText}>Ver Grades</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default Dashboard;
