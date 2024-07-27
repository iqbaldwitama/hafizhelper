import React, { useState, useEffect } from "react";
import {
  View,
  Switch,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./styles";
import Colors from "../../utils/Colors";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import FontSize from "../../utils/FontSize";

const audioOptions = [
  { name: "Abdullah-Al-Juhany", key: "01" },
  { name: "Abdul-Muhsin-Al-Qasim", key: "02" },
  { name: "Abdurrahman-as-Sudais", key: "03" },
  { name: "Ibrahim-Al-Dossari", key: "04" },
  { name: "Misyari-Rasyid-Al-Afasi", key: "05" },
];

const fontSizeOptions = [
  { name: FontSize.SMALL, key: FontSize.SMALL },
  { name: FontSize.MEDIUM, key: FontSize.MEDIUM },
  { name: FontSize.LARGE, key: FontSize.LARGE },
];

const arabicOptions = [
  { name: "Mushaf Madinah", key: "01" },
  { name: "Mushaf Standar Indonesia", key: "02" },
];

const SettingsPage: React.FC = () => {
  const [latinOption, setLatinOption] = useState<boolean>(true);
  const [artiOption, setArtiOption] = useState<boolean>(true);
  const [audioOption, setAudioOption] = useState<string>("01");
  const [fontSizeOption, setFontSizeOption] =
    useState<string>("Kecil");
  const [arabicOption, setArabicOption] = useState<string>("01");
  const [showAudioModal, setShowAudioModal] =
    useState<boolean>(false);
  const [showFontSizeModal, setShowFontSizeModal] =
    useState<boolean>(false);
  const [showArabicModal, setShowArabicModal] =
    useState<boolean>(false);
  const [showLatinInfo, setShowLatinInfo] = useState(false);
  const [showArtiInfo, setShowArtiInfo] = useState(false);
  const [showAudioInfo, setShowAudioInfo] = useState(false);
  const [showFontSizeInfo, setShowFontSizeInfo] = useState(false);
  const [showArabicInfo, setShowArabicInfo] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Load settings from AsyncStorage
    navigation.getParent()?.setOptions({ swipeEnabled: true });
    loadSettings();
  }, []);

  // istanbul ignore next
  const loadSettings = async () => {
    try {
      const artiSetting = await AsyncStorage.getItem("artiEnabled");
      const latinSetting = await AsyncStorage.getItem("latinEnabled");
      const audioSetting = await AsyncStorage.getItem("audioOption");
      const fontSizeSetting =
        await AsyncStorage.getItem("fontSizeOption");
      const arabicSetting =
        await AsyncStorage.getItem("arabicOption");

      if (latinSetting == null) {
        await AsyncStorage.setItem("latinEnabled", "true");
        setLatinOption(true);
      } else {
        setLatinOption(latinSetting == "true");
      }
      if (audioSetting !== null) {
        setAudioOption(audioSetting);
      } else {
        await AsyncStorage.setItem("audioOption", "01");
      }
      if (artiSetting == null) {
        await AsyncStorage.setItem("artiEnabled", "true");
      } else {
        setArtiOption(artiSetting == "true");
      }
      if (fontSizeSetting == null) {
        await AsyncStorage.setItem("fontSizeOption", FontSize.SMALL);
      } else {
        setFontSizeOption(fontSizeSetting);
      }
      if (arabicSetting !== null) {
        setArabicOption(arabicSetting);
      } else {
        await AsyncStorage.setItem("arabicOption", "01");
      }
    } catch (error) {
      console.error("Error loading settings", error);
    }
  };

  const handleLatinToggle = async (isEnabled: boolean) => {
    await AsyncStorage.setItem("latinEnabled", isEnabled.toString());
    setLatinOption(isEnabled);
  };

  const handleArtiToggle = async (isEnabled: boolean) => {
    await AsyncStorage.setItem("artiEnabled", isEnabled.toString());
    setArtiOption(isEnabled);
  };

  const handleAudioOptionChange = async (option: {
    name: string;
    key: string;
  }) => {
    await AsyncStorage.setItem("audioOption", option.key);
    setAudioOption(option.key);
    Alert.alert("Opsi Telah Diubah", `Pilihan Qari: ${option.name}`);
  };

  const handleFontSizeChange = async (itemValue: string) => {
    await AsyncStorage.setItem("fontSizeOption", itemValue);
    setFontSizeOption(itemValue);
  };

  const handleArabicOptionChange = async (option: {
    name: string;
    key: string;
  }) => {
    await AsyncStorage.setItem("arabicOption", option.key);
    setArabicOption(option.key);
    Alert.alert(
      "Opsi Telah Diubah",
      `Pilihan Mushaf: ${option.name}`,
    );
  };

  const renderAudioItem = ({
    item,
  }: {
    item: { name: string; key: string };
  }) => (
    <TouchableOpacity
      style={styles.audioOptionItem}
      onPress={() => {
        handleAudioOptionChange(item);
        setShowAudioModal(false);
      }}
    >
      <Text style={styles.audioOptionText}>
        {item.key} : {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderFontSizeOption = ({
    item,
  }: {
    item: { name: string; key: string };
  }) => (
    <TouchableOpacity
      style={styles.audioOptionItem}
      onPress={() => {
        handleFontSizeChange(item.name);
        setShowFontSizeModal(false);
      }}
    >
      <Text style={styles.audioOptionText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderArabicItem = ({
    item,
  }: {
    item: { name: string; key: string };
  }) => (
    <TouchableOpacity
      style={styles.audioOptionItem}
      onPress={() => {
        handleArabicOptionChange(item);
        setShowArabicModal(false);
      }}
    >
      <Text style={styles.audioOptionText}>
        {item.key} : {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>
          Tunjukkan Latin{" "}
          <TouchableOpacity
            onPressIn={() => setShowLatinInfo(true)}
            onPressOut={() => setShowLatinInfo(false)}
            testID="latin-info-icon"
          >
            <FontAwesome5
              name="question-circle"
              size={15}
              color={Colors.DARK_GREEN}
            />
          </TouchableOpacity>
        </Text>
        <Switch
          value={latinOption}
          onValueChange={handleLatinToggle}
          trackColor={{ false: "black", true: Colors.AQUA_GREEN }}
          testID="latin-switch"
        />
      </View>
      {showLatinInfo && (
        <View style={styles.hangingBoxLatin}>
          <Text>
            Pada bacaan ayat suatu surat, kamu dapat memunculkan atau
            menghilangkan teks latin pada ayat tersebut.
          </Text>
        </View>
      )}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>
          Tunjukkan Arti{" "}
          <TouchableOpacity
            onPressIn={() => setShowArtiInfo(true)}
            onPressOut={() => setShowArtiInfo(false)}
            testID="arti-info-icon"
          >
            <FontAwesome5
              name="question-circle"
              size={15}
              color={Colors.DARK_GREEN}
            />
          </TouchableOpacity>
        </Text>
        <Switch
          value={artiOption}
          onValueChange={handleArtiToggle}
          trackColor={{ false: "black", true: Colors.AQUA_GREEN }}
          testID="arti-switch"
        />
      </View>
      {showArtiInfo && (
        <View style={styles.hangingBoxArti}>
          <Text>
            Saat membaca suatu surat, kamu dapat menghilangkan teks
            arti pada ayat-ayat agar memudahkan kamu dalam membaca
            Al-Quran
          </Text>
        </View>
      )}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>
          Opsi Qari{" "}
          <TouchableOpacity
            onPressIn={() => setShowAudioInfo(true)}
            onPressOut={() => setShowAudioInfo(false)}
            testID="audio-info-icon"
          >
            <FontAwesome5
              name="question-circle"
              size={15}
              color="black"
            />
          </TouchableOpacity>
        </Text>
        <TouchableOpacity
          style={styles.audioOptionButton}
          onPress={() => setShowAudioModal(true)}
          testID="audio-option-button"
        >
          <Text style={styles.audioOptionButtonText}>
            {audioOption}
          </Text>
        </TouchableOpacity>
      </View>
      {showAudioInfo && (
        <View style={styles.hangingBoxAudio}>
          <Text>
            Kamu dapat kustomisasi pilihan Qari yang akan membuat kamu
            lebih nyaman untuk membaca dan menghafal suatu ayat.
          </Text>
        </View>
      )}
      <Modal
        visible={showAudioModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAudioModal(false)}
        testID="audio-modal"
      >
        <TouchableWithoutFeedback
          onPress={() => setShowAudioModal(false)}
          testID="audio-modal-backdrop"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={audioOptions}
                renderItem={renderAudioItem}
                keyExtractor={(item) => item.key}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>
          Opsi Mushaf{" "}
          <TouchableOpacity
            onPressIn={() => setShowArabicInfo(true)}
            onPressOut={() => setShowArabicInfo(false)}
            testID="arabic-info-icon"
          >
            <FontAwesome5
              name="question-circle"
              size={15}
              color="black"
            />
          </TouchableOpacity>
        </Text>
        <TouchableOpacity
          style={styles.audioOptionButton}
          onPress={() => setShowArabicModal(true)}
          testID="arabic-option-button"
        >
          <Text style={styles.audioOptionButtonText}>
            {arabicOption}
          </Text>
        </TouchableOpacity>
      </View>
      {showArabicInfo && (
        <View style={styles.hangingBoxAudio}>
          <Text>
            Kamu dapat kustomisasi pilihan Mushaf yang akan membuat
            kamu lebih nyaman untuk membaca dan menghafal suatu ayat.
          </Text>
        </View>
      )}
      <Modal
        visible={showArabicModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowArabicModal(false)}
        testID="arabic-modal"
      >
        <TouchableWithoutFeedback
          onPress={() => setShowArabicModal(false)}
          testID="arabic-modal-backdrop"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={arabicOptions}
                renderItem={renderArabicItem}
                keyExtractor={(item) => item.key}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>
          Ukuran Font{" "}
          <TouchableOpacity
            onPressIn={() => setShowFontSizeInfo(true)}
            onPressOut={() => setShowFontSizeInfo(false)}
            testID="font-size-info-icon"
          >
            <FontAwesome5
              name="question-circle"
              size={15}
              color={Colors.DARK_GREEN}
            />
          </TouchableOpacity>
        </Text>
        <TouchableOpacity
          style={styles.audioOptionButton}
          onPress={() => setShowFontSizeModal(true)}
          testID="font-size-option-button"
        >
          <Text style={styles.audioOptionButtonText}>
            {fontSizeOption}
          </Text>
        </TouchableOpacity>
      </View>
      {showFontSizeInfo && (
        <View style={styles.hangingBoxFontSize}>
          <Text testID="font-size-info">
            Pada bacaan ayat, Kamu dapat mengatur ukuran font tulisan
            arabnya, terjemahannya, dan juga latinnya.
          </Text>
        </View>
      )}
      <Modal
        visible={showFontSizeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFontSizeModal(false)}
        testID="font-size-modal"
      >
        <TouchableWithoutFeedback
          onPress={() => setShowFontSizeModal(false)}
          testID="font-size-modal-backdrop"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={fontSizeOptions}
                renderItem={renderFontSizeOption}
                keyExtractor={(item) => item.key}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default SettingsPage;
