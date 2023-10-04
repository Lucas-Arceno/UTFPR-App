import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
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

  const theme = selectedTheme === "light_theme" ? lightTheme : darkTheme;

  const removeItemValue = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (err) {
      console.error("Erro ao remover o item:", err);
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

  const closePaymentHandler = () =>{
    setIsPaymentOpen(false);
  }

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
  });

  return isPaymentOpen ? (
    <PaymentPage paymentHandler={closePaymentHandler}></PaymentPage>
  ) : (
    <View
      style={{
        backgroundColor: theme.backgroundColor,
        paddingTop: 20,
        height: "100%",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: theme.textColor,
          fontSize: 25,
          fontWeight: "bold",
          paddingBottom: 20,
          paddingTop: 20,
        }}
      >
        Opções
      </Text>

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
            style={{
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
    </View>
  );
}

export default Options;
