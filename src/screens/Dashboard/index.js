import * as React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../components/Header";
import {
  useThemeContext,
  lightTheme,
  darkTheme,
} from "../../context/themeContext";

function Dashboard({ navigation, setAuth }) {
  const [name, setName] = React.useState("");
  const { selectedTheme } = useThemeContext();
  const theme = selectedTheme === "light_theme" ? lightTheme : darkTheme;

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

  return (
    <>
      <Header setAuth={setAuth} name={name} loginState={"1"} />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.backgroundColor,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            color: theme.textColor,
          }}
        >
          Ola, {name} 👋
        </Text>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            color: theme.textColor,
          }}
        >
          O que deseja fazer?
        </Text>
        <TouchableOpacity
          style={{
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
          }}
          onPress={() =>
            navigation.navigate("Calendar", { fileMaterias: [], name: name })
          }
        >
          <Text style={styles.buttonText}>Montar Grade</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
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
          }}
          onPress={() => navigation.navigate("GradesSalvas", { name: name })}
        >
          <Text style={styles.buttonText}>Ver Grades</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default Dashboard;

const styles = StyleSheet.create({
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
