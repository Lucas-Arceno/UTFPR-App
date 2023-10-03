import * as React from "react";
import {
  TouchableOpacity,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useThemeContext,
  lightTheme,
  darkTheme,
} from "../../context/themeContext";

function Register({ navigation, setAuth }) {
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");

  const { selectedTheme } = useThemeContext();
  const theme = selectedTheme === "light_theme" ? lightTheme : darkTheme;

  const storeToken = async (value) => {
    try {
      await AsyncStorage.setItem("token", value);
    } catch (e) {
      console.log(e.message);
    }
  };

  onSubmitForm = async () => {
    try {
      const body = { email, password, name };
      const response = await fetch("http://10.0.2.2:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();
      storeToken(parseRes.token);
      setAuth(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={{ backgroundColor: theme.backgroundColor, flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TextInput
        style={styles.input}
        value={email}
        placeholder={"Email"}
        secureTextEntry={false}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        value={name}
        placeholder={"Name"}
        secureTextEntry={false}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder={"Password"}
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={{
          backgroundColor: theme.secondColor  ,
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
          elevation: 3, // Sombra no Android
          shadowColor: "#000", // Sombra no iOS
          shadowOpacity: 0.3, // Sombra no iOS
          shadowOffset: { width: 2, height: 2 }, // Sombra no iOS
          shadowRadius: 3, // Sombra no iOS
          marginTop: 25,
          width: 100
        }}
        onPress={onSubmitForm}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: theme.secondColor  ,
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
          elevation: 3, // Sombra no Android
          shadowColor: "#000", // Sombra no iOS
          shadowOpacity: 0.3, // Sombra no iOS
          shadowOffset: { width: 2, height: 2 }, // Sombra no iOS
          shadowRadius: 3, // Sombra no iOS
          width: 100,
          marginTop: 25
        }}
        onPress={()=>navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

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
  },
});

export default Register;
