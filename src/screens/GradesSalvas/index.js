import * as React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Calendar from "../../components/Calendar";
import {
  useThemeContext,
  lightTheme,
  darkTheme,
} from "../../context/themeContext";

function GradesSalvas({ navigation, route }) {
  const { name } = route.params;
  const [fileMaterias, setFileMaterias] = React.useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);

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

  const getGrades = async (gradeId) => {
    try {
      const token_ = await getData();
      const response = await fetch(
        `http://10.0.2.2:5000/dashboard/getGrade/${gradeId}`,
        {
          method: "GET",
          headers: { token: token_ },
        }
      );
      const parseRes = await response.json();
      console.log(parseRes);
      return parseRes;
    } catch (err) {
      console.log(err.message);
    }
  };

  function parseInput(input) {
    const courses = input.split('"'); // Divide a string em cursos separados

    const parsedCourses = [];
    for (let i = 1; i < courses.length; i += 2) {
      const courseInfo = courses[i].split(" - ");

      const code = courseInfo[0].trim();
      const nameAndSchedule = courseInfo.slice(1).join(" - ").trim();

      const [name, schedule] = separateNameAndSchedule(nameAndSchedule);

      parsedCourses.push({
        turmas: [
          {
            Turma: "",
            "Matricula Intercampus": "",
            Enquadramento: "",
            "Vagas Total": "",
            "Vagas Calouros": "",
            Reserva: "",
            "Prioridade - Curso": "",
            Horario: "",
            Professor: schedule,
            Optativa: "",
          },
        ],
        Matéria: `${code} - ${name}`,
      });
    }

    return parsedCourses;
  }

  function separateNameAndSchedule(input) {
    const parts = input.split(": ");
    const name = parts[0];
    const schedule = parts[1];
    return [name, schedule];
  }

  React.useEffect(() => {
    console.log("File Materias Atualizado:", fileMaterias);
  }, [fileMaterias]);

  const handleClick = async (gradeId) => {
    const listMaterias = await getGrades(gradeId);
    if (gradeId == 1) {
      if (listMaterias.grade_um == null) {
        console.log("vazio");
      } else {
        setFileMaterias(await parseInput(listMaterias.grade_um));
      }
    } else if (gradeId == 2) {
      if (listMaterias.grade_dois == null) {
        console.log("vazio");
      } else {
        setFileMaterias(await parseInput(listMaterias.grade_dois));
      }
    } else {
      if (listMaterias.grade_tres == null) {
        console.log("vazio");
      } else {
        setFileMaterias(await parseInput(listMaterias.grade_tres));
      }
    }
    setIsReady(true);
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.backgroundColor,
      }}
    >
      {isReady ? (
        <Calendar navigation={navigation} fileMateria_={fileMaterias} />
      ) : (
        <View>
          <TouchableOpacity
            onPress={() => {
              handleClick(1);
            }}
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
          >
            <Text style={styles.buttonText}>Grade 1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleClick(2);
            }}
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
          >
            <Text style={styles.buttonText}>Grade 2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleClick(3);
            }}
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
          >
            <Text style={styles.buttonText}>Grade 3</Text>
          </TouchableOpacity>
        </View>
      )}
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
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

export default GradesSalvas;

const styles = StyleSheet.create({
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
