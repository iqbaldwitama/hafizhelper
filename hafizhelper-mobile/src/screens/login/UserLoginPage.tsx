import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import ScreenName from "../../utils/ScreenName";
import {
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { loginUser } from "../../networks/auth/loginUser";
import { useAuth } from "../../context/AuthContext";

interface UserLoginPageProps {
  navigation: NavigationProp<ParamListBase>;
}

const UserLoginPage = ({ navigation }: UserLoginPageProps) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsFormValid(email.trim() !== "" && password.trim() !== "");
  }, [email, password]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await loginUser(email, password);
      if (response.errors?.code === "error") {
        Alert.alert("Login Failed", response.errors.error_message);
        return;
      } else {
        const { user, token } = response;
        await login(token, {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
        });
        navigation.navigate(ScreenName.SURAH_LIST_PAGE, {
          name: "HomePage",
        });
      }
    } catch (error) {
      Alert.alert(
        "Login Error",
        "An error occurred during login, please try again",
      );
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title} testID="login-text">
        Login
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          testID="email-input"
        />
        <View>
          <TextInput
            placeholder="Password"
            value={password}
            secureTextEntry={!passwordVisible}
            style={styles.input}
            onChangeText={setPassword}
            testID="password-input"
          />
          <TouchableOpacity
            style={styles.togglePasswordVisibility}
            onPress={togglePasswordVisibility}
          >
            <Icon
              name={passwordVisible ? "eye-off" : "eye"}
              size={24}
              color="#aaa"
              testID="toggle-password-visibility"
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.button, !isFormValid && styles.disabledButton]}
        onPress={handleLogin}
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color="#fff"
            testID="loading-indicator"
          />
        ) : (
          <Text style={styles.buttonText} testID="login-button">
            Login
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(ScreenName.SIGN_UP_PAGE, {
            name: "SignUpPage",
          })
        }
      >
        <Text style={styles.switchText} testID="sign-up">
          Don&apos;t have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserLoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0F543F",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#0F543F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  switchText: {
    color: "#0F543F",
    fontSize: 14,
    marginTop: 20,
  },
  togglePasswordVisibility: {
    position: "absolute",
    right: 10,
    bottom: 10,
    justifyContent: "center",
    padding: 10,
  },
});
