import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import Options from "../Options";
import {
  useThemeContext,
  lightTheme,
  darkTheme,
} from "../../context/themeContext";

function Header({ name, loginState, setAuth }) {
  const [isOptionsOpen, setIsOptionsOpen] = React.useState(false);
  const { selectedTheme } = useThemeContext();
  const theme = selectedTheme === "light_theme" ? lightTheme : darkTheme;

  return (
    <View>
      <View
        style={{
          backgroundColor: theme.secondColor,
          paddingTop: 50,
          paddingHorizontal: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "black",
            fontSize: 25,
            fontWeight: "bold",
          }}
        >
          {name}
        </Text>
        <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            setIsOptionsOpen(!isOptionsOpen);
          }}
        >
          {!isOptionsOpen ? (
            <Text
              style={{
                color: "black",
                fontSize: 25,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              ...
            </Text>
          ) : (
            <Text
              style={{
                color: "black",
                fontSize: 25,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              x
            </Text>
          )}
        </TouchableOpacity>
      </View>
      {isOptionsOpen ? (
        <Options setAuth={setAuth} isLogged={loginState} />
      ) : (
        <></>
      )}
    </View>
  );
}

export default Header;
