import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

const premiumContext = createContext();

export const PremiumContextProvider = ({ children }) => {
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
  
  const getPremium = async () => {
    try {
      const token_ = await getData();
      const response = await fetch("http://10.0.2.2:5000/dashboard/getPremium", {
        method: "GET",
        headers: { token: token_ },
      });
      const parseRes = await response.json();
      return parseRes;
    } catch (err) {
      console.log(err.message);
    }
  };

  const postPremium = async () => {
    try {
      const token_ = await getData();
      const response = await fetch("http://10.0.2.2:5000/dashboard/postPremium", {
        method: "POST",
        headers: { "Content-type": "application/json", token: token_ },
      });
      console.log(response);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <premiumContext.Provider value={{ getPremium, postPremium }}>
      {children}
    </premiumContext.Provider>
  );
};

export const usePremiumContext = () => {
  const context = useContext(premiumContext);
  if (!context) {
    throw new Error('usePremiumContext deve ser usado dentro de um PremiumContextProvider');
  }
  return context;
};