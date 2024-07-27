import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { styles } from "./styles";
import { createUser } from "../../networks/auth/createUser";
import ScreenName from "../../utils/ScreenName";
import {
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { ActivityIndicator } from "react-native-paper";

interface SignUpPageProps {
  navigation: NavigationProp<ParamListBase>;
}

const SignUpPage = ({ navigation }: SignUpPageProps) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // istanbul ignore next
  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const response = await createUser(username, email, password);
      if (response.errors?.code === "error") {
        Alert.alert("Register Failed", response.errors.error_message);
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
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const checkUsernameValidity = (username: string) => {
    return username.length > 0;
  };

  const checkEmailValidity = (email: string) => {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const checkPasswordValidity = (password: string) => {
    return password.length >= 8;
  };

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    setIsUsernameValid(checkUsernameValidity(text));
  };
  const handleEmailChange = (text: string) => {
    setEmail(text);
    setIsEmailValid(checkEmailValidity(text));
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setIsPasswordValid(checkPasswordValidity(text));
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.title} testID="register-text">
          Register
        </Text>
        <View
          style={styles.inputValidatorContainer}
          testID="input-validator-username"
        >
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={handleUsernameChange}
            style={[
              styles.input,
              !isUsernameValid ? styles.invalidInput : null,
            ]}
            onBlur={() =>
              setIsUsernameValid(checkUsernameValidity(username))
            }
            testID="fullname-input"
          />

          {!isUsernameValid && (
            <Text style={styles.warningText}>
              Username cannot be empty.
            </Text>
          )}
        </View>

        <View
          style={styles.inputValidatorContainer}
          testID="input-validator-email"
        >
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={handleEmailChange}
            style={[
              styles.input,
              !isEmailValid ? styles.invalidInput : null,
            ]}
            onBlur={() => setIsEmailValid(checkEmailValidity(email))}
            testID="email-input"
          />

          {!isEmailValid && (
            <Text style={styles.warningText}>
              Please enter a valid email address.
            </Text>
          )}
        </View>

        <View
          style={styles.inputValidatorContainer}
          testID="input-validator-password"
        >
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry={!passwordVisible}
            style={[
              styles.input,
              !isPasswordValid ? styles.invalidInput : null,
            ]}
            onBlur={() =>
              setIsPasswordValid(checkPasswordValidity(password))
            }
            testID="password-input"
          />
          {!isPasswordValid && (
            <Text style={styles.warningText}>
              Password must be at least 8 characters.
            </Text>
          )}
          <TouchableOpacity
            style={styles.togglePasswordVisibility}
            onPress={togglePasswordVisibility}
            testID="toggle-password-visibility"
          >
            <Icon
              name={passwordVisible ? "eye-off" : "eye"}
              size={24}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          (!isEmailValid ||
            !isPasswordValid ||
            !isUsernameValid ||
            email === "" ||
            username === "" ||
            password === "") &&
            styles.disabledButton,
        ]}
        onPress={handleSignUp}
        disabled={
          !isEmailValid ||
          !isPasswordValid ||
          !isUsernameValid ||
          email === "" ||
          username === "" ||
          password === "" ||
          isLoading
        }
      >
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color="#fff"
            testID="loading-indicator"
          />
        ) : (
          <Text style={styles.buttonText} testID="signup-button">
            Sign Up
          </Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default SignUpPage;
