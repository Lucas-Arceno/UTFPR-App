import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  TextInput,
} from "react-native";
import {
  useThemeContext,
  lightTheme,
  darkTheme,
} from "../../context/themeContext";
import { usePremiumContext } from "../../context/premiumContext";

function PaymentPage({ paymentHandler }) {
  const { selectedTheme } = useThemeContext();
  const { postPremium } = usePremiumContext();
  const theme = selectedTheme === "light_theme" ? lightTheme : darkTheme;
  const [isConfirmed, setIsConfirmed] = React.useState(false);

  const styles = StyleSheet.create({
    container: {
      height: "100%",
      alignItems: "center",
      backgroundColor: theme.backgroundColor,
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
      margin: 10,
    },
    textStyle: {
      marginTop: 50,
      marginBottom: 20,
      fontSize: 18,
      fontWeight: "bold",
      paddingBottom: 20,
      color: theme.textColor,
    },
    subTextStyle: {
      fontSize: 14,
      fontWeight: "normal",
      paddingBottom: 20,
      color: theme.textColor,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
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
      width: 130,
      marginBottom: 10,
      marginTop: 10,
    },
    cancelButtonStyle: {
      backgroundColor: "#b5353d",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      elevation: 3, // Sombra no Android
      shadowColor: "#000", // Sombra no iOS
      shadowOpacity: 0.3, // Sombra no iOS
      shadowOffset: { width: 2, height: 2 }, // Sombra no iOS
      shadowRadius: 3, // Sombra no iOS
      width: 130,
      marginBottom: 10,
      marginTop: 10,
    },
  });

  onSubmitForm = async () => {
    try {
      postPremium();
      setIsConfirmed(true);
      setTimeout(() => {
        paymentHandler();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {isConfirmed ? (
        <View>
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.textStyle}>Valor Total: R$10,45</Text>
          <Text>Nome:</Text>
          <TextInput
            style={styles.input}
            placeholder={"Nome Completo"}
            secureTextEntry={false}
          />
          <Text>CPF:</Text>
          <TextInput
            style={styles.input}
            placeholder={"CPF"}
            secureTextEntry={false}
            keyboardType={"numeric"}
            maxLength={11}
          />
          <Text>Número do Cartão:</Text>
          <TextInput
            style={styles.input}
            placeholder={"Número do Cartão"}
            secureTextEntry={false}
            keyboardType={"numeric"}
            maxLength={16}
          />
          <TouchableOpacity
            style={styles.cancelButtonStyle}
            onPress={() => {paymentHandler()}}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyle} onPress={onSubmitForm}>
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default PaymentPage;
