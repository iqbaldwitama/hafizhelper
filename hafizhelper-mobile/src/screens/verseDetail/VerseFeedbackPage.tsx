import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { CircularButton } from "../../components";
import { styles } from "./styles";
import { Verse } from "../../interfaces/Verse";
import { useRoute } from "@react-navigation/native";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontSize from "../../utils/FontSize";
import useScreen from "../../hooks/useScreen";
import { VerseMadinah } from "../../interfaces/VerseMadinah";
import LoadingIndicator from "../../components/utils/LoadingIndicator";
import { Audio, AVPlaybackStatus } from "expo-av";
import Colors from "../../utils/Colors";
import Icon from "react-native-vector-icons/MaterialIcons";

const VerseFeedbackPage: React.FC = () => {
  const [fontSizeStyle, setFontSizeStyle] = useState({
    arabicFontSize: 35,
    arabiclineHeight: 75,
    latinFontSize: 18,
  });
  const screen = useScreen();
  const [isAudioPlaying, setIsAudioPlaying] =
    useState<boolean>(false);
  const sound = useRef<Audio.Sound>(new Audio.Sound());
  const [arabicSetting, setArabicSetting] = useState("01");
  const [fontsLoaded] = useFonts({
    "LPMQ IsepMisbah": require("../../assets/fonts/LPMQ IsepMisbah.ttf"),
  });
  const route = useRoute();

  const data = route.params as {
    data: Verse;
    dataMadinah: VerseMadinah;
    voiceURI: string;
  };

  const getHighlightedText = (text: string) => {
    if (text.length > 30) {
      const beforeHighlight = text.substring(0, text.length - 20);
      const highlight = text.substring(
        text.length - 20,
        text.length - 10,
      );
      const afterHighlight = text.substring(text.length - 10);

      return (
        <Text
          style={{
            ...styles.correctFeedback,
            fontSize: fontSizeStyle.arabicFontSize,
            lineHeight: fontSizeStyle.arabiclineHeight,
          }}
        >
          {beforeHighlight}
          <Text
            style={{
              ...styles.highlightFeedback,
              fontSize: fontSizeStyle.arabicFontSize,
              lineHeight: fontSizeStyle.arabiclineHeight,
            }}
          >
            {highlight}
          </Text>
          {afterHighlight}
        </Text>
      );
    } else {
      return <Text style={styles.correctFeedback}>{text}</Text>;
    }
  };

  useEffect(() => {
    loadSound();
    return () => {
      cleanupAudio();
      loadAsyncStorage();
    };
  }, []);

  const loadSound = async () => {
    const audioURI = data.voiceURI;
    // istanbul ignore else
    if (audioURI) {
      try {
        await sound.current.loadAsync({ uri: audioURI });
        sound.current.setOnPlaybackStatusUpdate(
          handlePlaybackStatusUpdate,
        );
      } catch (error) {
        console.error("Error loading sound");
      }
    } else {
      console.error("No audio URI provided");
    }
  };

  const handlePlaybackStatusUpdate = async (
    status: AVPlaybackStatus,
  ) => {
    // istanbul ignore next
    if ("didJustFinish" in status && status.didJustFinish) {
      setIsAudioPlaying(false);
      await sound.current.setStatusAsync({
        shouldPlay: false,
        positionMillis: 0,
      });
    }
  };

  const cleanupAudio = async () => {
    try {
      await sound.current.unloadAsync();
    } catch (error) {
      console.error("Error unloading audio", error);
    }
  };

  const togglePlayRecording = async () => {
    try {
      const result = await sound.current.getStatusAsync();
      // istanbul ignore next
      if (result.isLoaded) {
        await sound.current.setStatusAsync({
          shouldPlay: !isAudioPlaying,
        });
      }
      setIsAudioPlaying(!isAudioPlaying);
    } catch (error) {
      console.error("Error toggling playback", error);
    }
  };

  const loadAsyncStorage = async () => {
    const arabicSettingValue =
      await AsyncStorage.getItem("arabicOption");
    setArabicSetting(arabicSettingValue || "01");

    const fontSizeSetting =
      await AsyncStorage.getItem("fontSizeOption");

    switch (fontSizeSetting) {
      case FontSize.SMALL:
        setFontSizeStyle(FontSize.SMALL_STYLE.verseDetail);
        break;
      case FontSize.MEDIUM:
        setFontSizeStyle(FontSize.MEDIUM_STYLE.verseDetail);
        break;
      case FontSize.LARGE:
        setFontSizeStyle(FontSize.LARGE_STYLE.verseDetail);
        break;
      default:
        setFontSizeStyle(FontSize.SMALL_STYLE.verseDetail);
        break;
    }
  };

  if (!fontsLoaded) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.mainContainer}>
      {screen.isPortrait}
      <View style={styles.contentContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
          style={{ ...styles.arabTextContainer }}
        >
          {!screen.isPortrait}
          {Boolean(
            arabicSetting === "01" && data.dataMadinah?.text_uthmani,
          ) && (
            <Text
              testID="quran-text-test"
              style={{
                ...styles.arabText,
                fontSize: fontSizeStyle.arabicFontSize,
                lineHeight: fontSizeStyle.arabiclineHeight,
              }}
            >
              {getHighlightedText(data.dataMadinah.text_uthmani)}
            </Text>
          )}
          {
            /* istanbul ignore next */
            Boolean(
              arabicSetting === "02" && data.data?.teksArab,
            ) && (
              <Text
                testID="quran-text-test"
                style={{
                  ...styles.arabText,
                  fontSize: fontSizeStyle.arabicFontSize,
                  lineHeight: fontSizeStyle.arabiclineHeight,
                }}
              >
                {getHighlightedText(data.data.teksArab)}
              </Text>
            )
          }
        </ScrollView>
      </View>
      <View style={styles.feedbackButtonContainer}>
        <CircularButton
          testId="play-recording-button-test"
          onPress={togglePlayRecording}
          color={Colors.AQUA_GREEN}
          radius={64}
        >
          {isAudioPlaying ? (
            <Icon
              testID="pause-recording-icon-test"
              name="pause"
              size={30}
              style={styles.icon}
            />
          ) : (
            <Icon
              testID="play-recording-icon-test"
              name="play-arrow"
              size={30}
              style={styles.icon}
            />
          )}
        </CircularButton>
        <Text
          style={{
            color: Colors.AQUA_GREEN,
            marginTop: 10,
            textAlign: "center",
          }}
        >
          Putar Rekaman Suara
        </Text>
      </View>
    </View>
  );
};

export default VerseFeedbackPage;
