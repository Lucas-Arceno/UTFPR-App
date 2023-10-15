import * as React from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Vibration
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../components/Header";
import {
  useThemeContext,
  lightTheme,
  darkTheme,
} from "../../context/themeContext";

function Login({ navigation, setAuth }) {
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const { selectedTheme } = useThemeContext();
  const theme = selectedTheme === "light_theme" ? lightTheme : darkTheme;

  const styles = StyleSheet.create({
    input: {
      width: "80%",
      height: 40,
      backgroundColor: "#fff",
      paddingHorizontal: 15,
      borderRadius: 8,
      borderColor: "#ccc",
      borderWidth: 1,
      fontSize: 16,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.backgroundColor,
    },
    mainText: {
      fontSize: 30,
      fontWeight: "bold",
      paddingBottom: 20,
      color: theme.textColor,
    },
    buttonStyle: {
      backgroundColor: theme.secondColor,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      elevation: 3, // Sombra no Android
      shadowColor: "#000", // Sombra no iOS
      shadowOpacity: 0.3, // Sombra no iOS
      shadowOffset: { width: 2, height: 2 }, // Sombra no iOS
      shadowRadius: 3, // Sombra no iOS
      width: 110,
      marginBottom: 10,
      marginTop: 10,
    },
  });


  const storeToken = async (value) => {
    try {
      await AsyncStorage.setItem("token", value);
    } catch (e) {
      console.log(e.message);
    }
  };

  onSubmitForm = async () => {
    try {
      const body = { email, password };

      const response = await fetch("http://10.0.2.2:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();
      if (parseRes === "Missing Credentials" || parseRes === "Invalid Email" || parseRes === "Password or Email is incorrect!") {
        Vibration.vibrate();
      } else {
        storeToken(parseRes);
        setAuth(true);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <>
      <Header name="Visitante" loginState="0" />
      <View style={styles.container}>
        <Text style={styles.mainText}>Grade UTFPR</Text>
        <Text>Login</Text>
        <TextInput
          style={styles.input}
          value={email}
          placeholder={"Email"}
          secureTextEntry={false}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          value={password}
          placeholder={"Password"}
          secureTextEntry={true}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.buttonStyle} onPress={onSubmitForm}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => Vibration.vibrate()}>
            <Text>Vibrate</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default Login;
