import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import PaymentPage from "../../screens/PaymentPage";
import {
  useThemeContext,
  lightTheme,
  darkTheme,
} from "../../context/themeContext";
import { usePremiumContext } from "../../context/premiumContext";

function Options({ isLogged, setAuth }) {
  const [isPaymentOpen, setIsPaymentOpen] = React.useState(false);
  const { setSelectedThemeHandler, selectedTheme } = useThemeContext();
  const { getPremium } = usePremiumContext();
  const [isConfirmingExclusion, setIsConfirmingExclusion] =
    React.useState(false);
  const [password, setPassword] = React.useState("");

  const theme = selectedTheme === "light_theme" ? lightTheme : darkTheme;

  const removeItemValue = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (err) {
      console.error("Erro ao remover o item:", err);
    }
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

  const deleteAccount = async () => {
    try {
      const token_ = await getData();
      const response = await fetch(
        "http://10.0.2.2:5000/dashboard/deleteAccount",
        {
          method: "POST",
          headers: { "Content-type": "application/json", token: token_ },
        }
      );
      await removeItemValue("token");
      setAuth(false);
      console.log(response);
    } catch (err) {
      console.log(err.message);
    }
  };

  const openPaymentHandler = async () => {
    const aux = await getPremium();
    if (aux.is_premium === null || aux.is_premium === false) {
      setIsPaymentOpen(!isPaymentOpen);
    } else {
      Alert.alert("Usuário ja é Premium");
    }
  };

  const closePaymentHandler = () => {
    setIsPaymentOpen(false);
  };

  const onLogout = async () => {
    await removeItemValue("token");
    setAuth(false);
  };

  const styles = StyleSheet.create({
    buttonStyle: {
      backgroundColor: theme.secondColor,
      marginTop: 40,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      elevation: 3, // Sombra no Android
      shadowColor: "#000", // Sombra no iOS
      shadowOpacity: 0.3, // Sombra no iOS
      shadowOffset: { width: 2, height: 2 }, // Sombra no iOS
      shadowRadius: 3, // Sombra no iOS
      width: 180,
      height: 50,
      alignItems: "center",
    },
    buttonOptionsText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    textSyle: {
      color: theme.textColor,
      fontSize: 25,
      fontWeight: "bold",
      paddingBottom: 20,
      paddingTop: 20,
    },
    container: {
      backgroundColor: theme.backgroundColor,
      paddingTop: 20,
      height: "100%",
      alignItems: "center",
    },
    exclusionButton: {
      backgroundColor: "#FF6D60",
      marginTop: 40,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      elevation: 3, // Sombra no Android
      shadowColor: "#000", // Sombra no iOS
      shadowOpacity: 0.3, // Sombra no iOS
      shadowOffset: { width: 2, height: 2 }, // Sombra no iOS
      shadowRadius: 3, // Sombra no iOS
      width: 180,
      height: 50,
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: theme.backgroundColor,
      paddingTop: 20,
      height: "100%",
      alignItems: "center",
    },
    textSyleModal: {
      color: theme.textColor,
      fontSize: 20,
      fontWeight: "bold",
      padding: 20,
    },
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
  });

  const handleAccountExclusion = (status) => {
    setIsConfirmingExclusion(status);
  };

  return isPaymentOpen ? (
    <PaymentPage paymentHandler={closePaymentHandler}></PaymentPage>
  ) : (
    <View style={styles.container}>
      <Text style={styles.textSyle}>Opções</Text>

      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={setSelectedThemeHandler}
      >
        <Text style={styles.buttonOptionsText}>MUDAR TEMA</Text>
      </TouchableOpacity>

      {isLogged == "1" ? (
        <View>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={openPaymentHandler}
          >
            <Text style={styles.buttonOptionsText}>INSCRIÇÃO</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exclusionButton}
            onPress={() => {
              handleAccountExclusion(true);
            }}
          >
            <Text style={styles.buttonOptionsText}>EXCLUIR CONTA</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonStyle} onPress={onLogout}>
            <Text style={styles.buttonOptionsText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}
      <Modal
        visible={isConfirmingExclusion}
        transparent={false}
        animationType="slide"
        onRequestClose={!isConfirmingExclusion}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.textSyleModal}>
            <Text style={{ color: "#FF6D60" }}>Aviso:</Text> Excluir a conta é
            um caminho sem volta. Após essa decisão a mesma conta não poderá ser
            recuperada
          </Text>

          <Text style={styles.textSyleModal}>
            Para prosseguir, digite no campo a baixo a sua senha e pressione o
            botão EXCLUIR.
          </Text>

          <TextInput
            style={styles.input}
            value={password}
            placeholder={"Password"}
            secureTextEntry={true}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.buttonStyle} onPress={deleteAccount}>
            <Text style={styles.buttonOptionsText}>Excluir</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => {
              handleAccountExclusion(false);
            }}
          >
            <Text style={styles.buttonOptionsText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

export default Options;
