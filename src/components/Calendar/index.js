import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import materias from "./groups.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useThemeContext,
  lightTheme,
  darkTheme,
} from "../../context/themeContext";

const TableComponent = ({ navigation, route = {}, fileMateria_ = []}) => {
  /////////////////// VARIAVEIS E ARRAYS //////////////////////
  const [optionGrade, setOptionGrade] = useState("1");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedMaterias, setSelectedMaterias] = useState([]);
  const [selectedHorarios, setSelectedHorarios] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [cellData, setCellData] = useState(
    [...Array(17)].map(() => [...Array(5)].map(() => " "))
  );
  const [fileMateria, setFileMaterias] = useState(fileMateria_);
  const { name, fileMaterias } = route.params || {};
  const linhaMap = {
    M1: 0,
    M2: 1,
    M3: 2,
    M4: 3,
    M5: 4,
    M6: 5,
    T1: 6,
    T2: 7,
    T3: 8,
    T4: 9,
    T5: 10,
    T6: 11,
    N1: 12,
    N2: 13,
    N3: 14,
    N4: 15,
    N5: 16,
  };
  const colunaMap = {
    2: 0,
    3: 1,
    4: 2,
    5: 3,
    6: 4,
  };
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

  const postGrade = async (gradeId) => {
    try {
      const content = selectedHorarios;
      const body = { content };
      const token_ = await getData();
      const response = await fetch(
        `http://10.0.2.2:5000/dashboard/postGrade/${gradeId}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json", token: token_ },
          body: (JSON.stringify(body)),
        }
      );
      console.log(response);
    } catch (err) {
      console.log(err.message);
    }
  };

  /////////////////// COMEÇO DAS FUNÇÕES //////////////////////

  const handleSave = () => {
    if(isSaving == true){
      console.log(optionGrade);
      postGrade(optionGrade);
    }
    setIsSaving(!isSaving);
  };

  React.useEffect(() => {
    console.log("Selected Materias:", selectedMaterias);
  }, [selectedMaterias]);

  React.useEffect(() => {
    console.log("Selected Horarios:", selectedHorarios);
  }, [selectedHorarios]);

  React.useEffect(() => {
    fileMateria.forEach((materia) => {
      handleHorarios(materia.turmas, materia.Matéria);
    });
  }, [fileMateria]);

  const handleHorarios = (turmas, _materia) => {
    const horarios = turmas.map((turma) => turma.Professor).join(" ");

    const answer = updateCellsWithHorarios(horarios, _materia);

    // 1 - REMOVER
    // 2 - ADICIONAR
    // 3 - NADA

    if (selectedMaterias.includes(_materia) && answer === 1) {
      setSelectedMaterias(
        selectedMaterias.filter((materia) => materia !== _materia) //REMOVER
      );
    }
    if (answer === 2) {
      setSelectedMaterias((prevSelected) => [...prevSelected, _materia]); //ADICIONAR
    }
  };

  const updateCellsWithHorarios = (horarios, _materia) => {
    const horarioParts = horarios.split(" - ");
    const aux = _materia + ": " + horarios;
    var counter = 0;
    const auxHorarios = selectedHorarios;

    setSelectedHorarios((prevSelected) => [
      ...prevSelected,
      _materia + ": " + horarios,
    ]);

    if (selectedHorarios.includes(aux)) {
      setSelectedHorarios(
        selectedHorarios.filter((horario) => horario !== aux)
      );

      horarioParts.forEach((part) => {
        const match = part.match(/(\d+)([A-Z]\d+)\(/);
        if (match) {
          const colIdentifier = match[1]; // Column identifier, e.g., '2'
          const rowIdentifier = match[2]; // Row identifier, e.g., 'N1'

          const colIndex = colunaMap[colIdentifier];
          const rowIndex = linhaMap[rowIdentifier];

          updateCell(rowIndex, colIndex);
        }
      });

      return 1;
    }

    horarioParts.forEach((part) => {
      const match = part.match(/(\d+)([A-Z]\d+)\(/);
      if (match) {
        const colIdentifier = match[1]; // Column identifier, e.g., '2'
        const rowIdentifier = match[2]; // Row identifier, e.g., 'N1'

        const colIndex = colunaMap[colIdentifier];
        const rowIndex = linhaMap[rowIdentifier];
        if (cellData[rowIndex][colIndex] === "X") {
          setSelectedHorarios(auxHorarios);
          Alert.alert("CONFLITO NOS HORARIOS");
          return 3;
        }
        counter++;
      }
    });
    if (counter === horarioParts.length) {
      horarioParts.forEach((part) => {
        const match = part.match(/(\d+)([A-Z]\d+)\(/);
        if (match) {
          const colIdentifier = match[1]; // Column identifier, e.g., '2'
          const rowIdentifier = match[2]; // Row identifier, e.g., 'N1'

          const colIndex = colunaMap[colIdentifier];
          const rowIndex = linhaMap[rowIdentifier];

          updateCell(rowIndex, colIndex);
        }
      });
      return 2;
    }
  };

  const updateCell = (rowIndex, colIndex) => {
    const updatedCellData = [...cellData];

    if (updatedCellData[rowIndex][colIndex] === "X") {
      updatedCellData[rowIndex][colIndex] = " ";
      setCellData(updatedCellData);
    } else {
      updatedCellData[rowIndex][colIndex] = "X";
      setCellData(updatedCellData);
    }
  };

  const handleAdding = () => {
    setIsAdding(!isAdding);
  };

  const renderizarBotoes = () => {
    return materias.map((materia, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => handleHorarios(materia.turmas, materia.Matéria)}
        style={
          selectedMaterias.includes(materia.Matéria)
            ? styles.buttonModalSelected
            : styles.buttonModal
        }
      >
        <Text style={styles.buttonText}>Matéria: {materia.Matéria}</Text>
      </TouchableOpacity>
    ));
  };

  const handleOption = (option) => {
    setOptionGrade(option);
  };


  //////////////////// FIM DAS FUNÇÕES //////////////////////

  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.backgroundColor,
    }}>
      {isSaving ? (
        <View>
          <Text style={styles.title}>ESCOLHA EM QUAL QUER SALVAR</Text>
          <TouchableOpacity
            onPress={() => handleOption("1")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>GRADE 1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleOption("2")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>GRADE 2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleOption("3")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>GRADE 3</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.tableContainer}>
          <Text style={styles.title}>GradeUTFPR</Text>
          <View style={styles.table}>
            <View style={styles.row}>
              <View style={styles.cell}></View>
              <View style={styles.cell}>
                <Text>Seg</Text>
              </View>
              <View style={styles.cell}>
                <Text>Ter</Text>
              </View>
              <View style={styles.cell}>
                <Text>Qua</Text>
              </View>
              <View style={styles.cell}>
                <Text>Qui</Text>
              </View>
              <View style={styles.cell}>
                <Text>Sex</Text>
              </View>
            </View>

            {cellData.map((rowData, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                <View style={styles.cell}>
                  <Text>
                    {rowIndex < 6
                      ? `M${rowIndex + 1}`
                      : rowIndex < 12
                      ? `T${rowIndex - 5}`
                      : `N${rowIndex - 11}`}
                  </Text>
                </View>

                {rowData.map((cell, colIndex) => (
                  <View
                    key={colIndex}
                    style={[
                      styles.cell,
                      cell === "X" && { backgroundColor: "green" },
                    ]}
                  >
                    <Text>{cell}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      )}
      {!isAdding ? (
        <View style={styles.buttonContainer}>
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
            }}
            onPress={() => navigation.navigate("Dashboard")}
          >
            <Text style={styles.buttonText}>VOLTAR</Text>
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
            }}
            onPress={() => {
              handleSave();
            }}
          >
            <Text style={styles.buttonText}>SALVAR</Text>
          </TouchableOpacity>
          {isSaving ? (
            <Text></Text>
          ) : (
            <TouchableOpacity style={{
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
            }} onPress={handleAdding}>
              <Text style={styles.buttonText}>ADICIONAR</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        ""
      )}

      <Modal
        visible={isAdding}
        transparent={true}
        animationType="slide"
        onRequestClose={!isAdding}
      >
        <ScrollView contentContainerStyle={styles.modalContent}>
          <TouchableOpacity
            style={styles.buttonModalClose}
            onPress={handleAdding}
          >
            <Text style={styles.buttonText}>FECHAR</Text>
          </TouchableOpacity>
          <View style={styles.modalContainer}>{renderizarBotoes()}</View>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tableContainer: {
    marginTop: 50, // Ajuste o valor para posicionar a tabela para baixo
  },
  table: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: 60,
    height: 30,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonModal: {
    marginTop: 5,
    marginHorizontal: 50,
    backgroundColor: "rgba(52, 152, 219, 0.9)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3, // Sombra no Android
    shadowColor: "#000", // Sombra no iOS
    shadowOpacity: 0.3, // Sombra no iOS
    shadowOffset: { width: 2, height: 2 }, // Sombra no iOS
    shadowRadius: 3, // Sombra no iOS
  },
  buttonModalSelected: {
    marginTop: 5,
    marginHorizontal: 50,
    backgroundColor: "rgba(50,205,50,0.8)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3, // Sombra no Android
    shadowColor: "#000", // Sombra no iOS
    shadowOpacity: 0.3, // Sombra no iOS
    shadowOffset: { width: 2, height: 2 }, // Sombra no iOS
    shadowRadius: 3, // Sombra no iOS
  },
  buttonModalClose: {
    marginTop: 5,
    marginHorizontal: 50,
    backgroundColor: "rgba(225, 51, 51, 0.9)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3, // Sombra no Android
    shadowColor: "#000", // Sombra no iOS
    shadowOpacity: 0.3, // Sombra no iOS
    shadowOffset: { width: 2, height: 2 }, // Sombra no iOS
    shadowRadius: 3, // Sombra no iOS
  },
  title: {
    fontFamily: "sans-serif-condensed",
    textAlign: "center",
    fontSize: 25,
  },
});

export default TableComponent;
