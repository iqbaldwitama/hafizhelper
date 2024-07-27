import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { CircularButton } from "../../components";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "./styles";
import Colors from "../../utils/Colors";
import { Verse } from "../../interfaces/Verse";
import { Audio, AVPlaybackStatus } from "expo-av";
import {
  NavigationProp,
  ParamListBase,
  useRoute,
} from "@react-navigation/native";
import { RepeatIcon, EllipseIcon } from "../../components/index";
import { useFonts } from "expo-font";
import ScreenName from "../../utils/ScreenName";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontSize from "../../utils/FontSize";
import useScreen from "../../hooks/useScreen";
import { VerseMadinah } from "../../interfaces/VerseMadinah";
import useSpecificAyahBookmarkQuery from "../../hooks/bookmark/useSpecificAyahBookmarkQuery";
import useDeleteAyahBookmarkQuery from "../../hooks/bookmark/useDeleteAyahBookmarkQuery";
import useCreateAyahBookmark from "../../hooks/bookmark/useCreateAyahBookmark";
import { useAuth } from "../../context/AuthContext";
import LoadingIndicator from "../../components/utils/LoadingIndicator";

interface VerseDetailProps {
  navigation: NavigationProp<ParamListBase>;
}

const VerseDetailPage = ({ navigation }: VerseDetailProps) => {
  const { authState } = useAuth();
  const [isAudioPlaying, setIsAudioPlaying] =
    useState<boolean>(false);

  const [isRepeatEnabled, setIsRepeatEnabled] =
    useState<boolean>(false);

  const [isAudioFinished, setIsAudioFinished] =
    useState<boolean>(true);

  const [isRecording, setIsRecording] = useState<boolean>(false);

  const sound = useRef<Audio.Sound>(new Audio.Sound());

  const recordingRef = useRef<Audio.Recording | null>(null);

  const [latinSwitchEnabled, setLatinSwitchEnabled] =
    useState<boolean>(true);

  const [fontSizeStyle, setFontSizeStyle] = useState({
    arabicFontSize: 35,
    arabiclineHeight: 75,
    latinFontSize: 18,
  });

  const isRepeatEnabledRef = useRef(isRepeatEnabled);

  const screen = useScreen();

  const [arabicSetting, setArabicSetting] = useState("01");

  useEffect(() => {
    isRepeatEnabledRef.current = isRepeatEnabled;
  }, [isRepeatEnabled, screen.isPortrait]);

  const [fontsLoaded] = useFonts({
    "LPMQ IsepMisbah": require("../../assets/fonts/LPMQ IsepMisbah.ttf"),
  });
  const route = useRoute();
  // get data that passed from navigation
  const data = route.params as {
    data: Verse;
    dataMadinah?: VerseMadinah;
    surah: string;
    jumlahAyat: number;
    allAyat: Verse[];
    noSurat: number;
    allAyatMadinah: VerseMadinah[];
  };

  const { flag: isBookmarked, refetch: refetchBookmark } =
    useSpecificAyahBookmarkQuery(
      data?.noSurat,
      data?.data?.nomorAyat,
      authState.isLoggedIn,
    );
  console.info(isBookmarked);

  useEffect(() => {
    loadAudio();
    return () => {
      cleanupAudio();
      loadAsyncStorage();
    };
  }, [data.data?.audio?.["01"]]);

  const loadAsyncStorage = async () => {
    const arabicSettingValue =
      await AsyncStorage.getItem("arabicOption");
    setArabicSetting(arabicSettingValue || "01");
  };

  const loadAudio = async () => {
    const latinSetting = await AsyncStorage.getItem("latinEnabled");
    setLatinSwitchEnabled(latinSetting != "false");

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

    const audioSetting = await AsyncStorage.getItem("audioOption");

    const audioUri = data.data?.audio?.[audioSetting || "01"];
    if (audioUri) {
      try {
        await sound.current.loadAsync({ uri: audioUri });
        sound.current.setOnPlaybackStatusUpdate(
          handlePlaybackStatusUpdate,
        );
      } catch (error) {
        console.error("Error loading audio", error);
      }
    } else {
      console.error("Audio URI is undefined or null");
    }
  };

  const handlePlaybackStatusUpdate = async (
    status: AVPlaybackStatus,
  ) => {
    if ("didJustFinish" in status && status.didJustFinish) {
      if (isRepeatEnabledRef.current) {
        await sound.current.replayAsync();
      } else {
        setIsAudioPlaying(false);
        setIsAudioFinished(true);
        await sound.current.setStatusAsync({
          shouldPlay: false,
          positionMillis: 0,
        });
      }
    }
  };

  const cleanupAudio = async () => {
    try {
      await sound.current.unloadAsync();
    } catch (error) {
      console.error("Error unloading audio", error);
    }
  };

  const toggleAudioPlaying = async () => {
    setIsAudioFinished(false);
    try {
      if (isAudioPlaying) {
        const result = await sound.current.getStatusAsync();
        if (result.isLoaded) {
          await sound.current.setStatusAsync({ shouldPlay: false });
        }
      } else {
        const result = await sound.current.getStatusAsync();
        if (result.isLoaded) {
          await sound.current.setStatusAsync({ shouldPlay: true });
        }
      }
      setIsAudioPlaying(!isAudioPlaying);
    } catch (error) {
      console.error("Error toggling playback", error);
    }
  };

  const toggleMic = async () => {
    try {
      if (!isRecording) {
        console.log("Start recording");
        await startRecording();
      } else {
        console.log("Stop recording");
        await stopRecording();
        navigateToVerseFeedback();
      }
      setIsRecording(!isRecording);
    } catch (error) {
      /* istanbul ignore next */
      console.error("Error toggling recording", error);
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      recordingRef.current = new Audio.Recording();
      await recordingRef.current.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      //istanbul ignore next
      await recordingRef.current.startAsync();
    } catch (error) {
      console.log(error);
    }
  };

  const stopRecording = async () => {
    try {
      //istanbul ignore next
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
        const voice = recordingRef.current.getURI();
        console.log("Recording URI:", voice);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleRepeat = () => {
    setIsRepeatEnabled((prevIsRepeatEnabled) => !prevIsRepeatEnabled);
  };

  const stopAudioPlaying = async () => {
    setIsAudioPlaying(false);
    setIsAudioFinished(true);
    await sound.current.setStatusAsync({
      shouldPlay: false,
      positionMillis: 0,
    });
  };

  const navigateToPreviousVerse = async () => {
    if (data.data?.nomorAyat && data.data?.nomorAyat > 1) {
      await stopAudioPlaying();
      navigation.navigate(ScreenName.VERSE_DETAIL_PAGE, {
        surah: data.surah,
        data: data.allAyat[data.data?.nomorAyat - 2],
        dataMadinah: data.allAyatMadinah?.[data.data?.nomorAyat - 2],
        jumlahAyat: data.jumlahAyat,
        allAyat: data.allAyat,
        allAyatMadinah: data.allAyatMadinah,
        noSurat: data.noSurat,
      });
    }
  };

  const navigateToNextVerse = async () => {
    if (
      data.data?.nomorAyat &&
      data.data?.nomorAyat < data.jumlahAyat
    ) {
      await stopAudioPlaying();
      navigation.navigate(ScreenName.VERSE_DETAIL_PAGE, {
        surah: data.surah,
        data: data.allAyat[data.data?.nomorAyat],
        dataMadinah: data.allAyatMadinah?.[data.data?.nomorAyat],
        jumlahAyat: data.jumlahAyat,
        allAyat: data.allAyat,
        allAyatMadinah: data.allAyatMadinah,
        noSurat: data.noSurat,
      });
    }
  };

  // istanbul ignore next
  const navigateToVerseFeedback = async () => {
    navigation.navigate(ScreenName.VERSE_FEEDBACK_PAGE, {
      data: data.data,
      dataMadinah: data.dataMadinah,
      jumlahAyat: data.jumlahAyat,
      voiceURI: recordingRef.current
        ? recordingRef.current.getURI()
        : null,
    });
  };

  // istanbul ignore next
  const HandleCreateBookmark = async () => {
    await useCreateAyahBookmark(
      data.surah,
      data.data.nomorAyat,
      data.noSurat,
    );
    if (refetchBookmark) {
      refetchBookmark();
    }
    console.log("Bookmark pressed!");
  };

  // istanbul ignore next
  const HandleDeleteBookmark = async () => {
    await useDeleteAyahBookmarkQuery(
      data.noSurat,
      data.data.nomorAyat,
    );
    if (refetchBookmark) {
      refetchBookmark();
    }
    console.log("Bookmark pressed!");
  };

  if (!fontsLoaded) {
    return <LoadingIndicator />;
  }

  const headerComponent = () => {
    return (
      <View testID="headerComponent" style={styles.navbar}>
        <Text testID="surah-title-test" style={styles.title}>
          {data.surah}
        </Text>
        <Text testID="verse-number-test" style={styles.subtitle}>
          Ayat {data.data?.nomorAyat}
        </Text>
        {authState.isLoggedIn ? (
          <TouchableOpacity
            style={styles.bookmarkButton}
            testID="bookmark-button"
          >
            {
              //istanbul ignore next
              !isBookmarked ? (
                <Icon
                  name="bookmark-outline"
                  size={24}
                  color={Colors.GREEN}
                  onPress={HandleCreateBookmark}
                  testID="bookmark-create"
                />
              ) : (
                <Icon
                  name="bookmark"
                  size={24}
                  color={Colors.GREEN}
                  onPress={HandleDeleteBookmark}
                  testID="bookmark-delete"
                />
              )
            }
          </TouchableOpacity>
        ) : (
          <View testID="bookmark-disabled"></View>
        )}
        <View style={styles.divider} />
      </View>
    );
  };

  const CircularButtonSize = () => (screen.isPortrait ? 64 : 46);

  return (
    <View style={styles.mainContainer}>
      {screen.isPortrait && headerComponent()}
      {/* Content section */}
      <View style={styles.contentContainer}>
        {data.data?.nomorAyat !== 1 && (
          <TouchableOpacity
            testID="previous-verse-button-test"
            onPress={navigateToPreviousVerse}
          >
            <Icon
              testID="previous-icon-test"
              name="navigate-before"
              size={30}
            />
          </TouchableOpacity>
        )}
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
          style={{ ...styles.arabTextContainer }}
        >
          {!screen.isPortrait && headerComponent()}
          {
            // istanbul ignore next
            arabicSetting === "01" &&
              data.dataMadinah?.text_uthmani && (
                <Text
                  testID="quran-text-test"
                  style={{
                    ...styles.arabText,
                    fontSize: fontSizeStyle.arabicFontSize,
                    lineHeight: fontSizeStyle.arabiclineHeight,
                  }}
                >
                  {data.dataMadinah.text_uthmani}
                </Text>
              )
          }
          {
            // istanbul ignore next
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
                {data.data.teksArab}
              </Text>
            )
          }
          {Boolean(latinSwitchEnabled && data.data?.teksLatin) && (
            <Text
              testID="quran-latin-test"
              style={{
                ...styles.latinText,
                fontSize: fontSizeStyle.latinFontSize,
              }}
            >
              {data.data.teksLatin}
            </Text>
          )}
        </ScrollView>
        {data.jumlahAyat !== data.data?.nomorAyat && (
          <TouchableOpacity
            testID="next-verse-button-test"
            onPress={navigateToNextVerse}
          >
            <Icon
              testID="next-icon-test"
              name="navigate-next"
              size={30}
            />
          </TouchableOpacity>
        )}
      </View>
      {/* Footer section */}
      <View
        testID="footer-test"
        style={{
          ...styles.footer,
          paddingVertical: screen.isPortrait ? 20 : 10,
          paddingHorizontal: screen.isPortrait ? 10 : 20,
        }}
      >
        {/* Play/pause button */}
        {!isRecording && (
          <View style={styles.leftButtonContainer}>
            {!isAudioFinished && (
              <View style={styles.extraButtonContainer}>
                {/* stop button */}
                <View style={styles.extraButton}>
                  <CircularButton
                    testId="stop-button-test"
                    onPress={stopAudioPlaying}
                    color={Colors.AQUA_GREEN}
                    radius={36}
                  >
                    <Icon
                      testID="stop-icon-test"
                      name="stop"
                      size={20}
                      style={styles.icon}
                    />
                  </CircularButton>
                </View>
              </View>
            )}
            {/* play/pause button */}
            <CircularButton
              testId="play-button-test"
              onPress={toggleAudioPlaying}
              color={Colors.AQUA_GREEN}
              radius={CircularButtonSize()}
            >
              {isAudioPlaying ? (
                <Icon
                  testID="pause-icon-test"
                  name="pause"
                  size={30}
                  style={styles.icon}
                />
              ) : (
                <Icon
                  testID="play-icon-test"
                  name="play-arrow"
                  size={30}
                  style={styles.icon}
                />
              )}
            </CircularButton>
            {/* Repeat button */}
            <View style={styles.repeatButtonContainer}>
              <TouchableOpacity
                testID="repeat-button-test"
                onPress={toggleRepeat}
                style={styles.repeatButton}
              >
                <RepeatIcon />
                {isRepeatEnabled && (
                  <View
                    style={styles.ellipseButton}
                    testID="ellipse-repeat-icon-test"
                  >
                    <EllipseIcon
                      width={5}
                      height={5}
                      color={Colors.AQUA_GREEN}
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
        {/* Sound wave visualization */}
        <View>
          {(isAudioPlaying || isRecording) && (
            <Image
              testID="sound-wave-test"
              style={{
                width: screen.isPortrait ? 60 : 46,
                height: screen.isPortrait ? 60 : 46,
              }}
              source={require("../../assets/gif/sound-wave.gif")}
            />
          )}
        </View>
        {/* Microphone button */}
        {!isAudioPlaying && (
          <View style={styles.rightButtonContainer}>
            {!isRecording ? (
              <CircularButton
                testId="mic-button-test"
                onPress={toggleMic}
                color={Colors.AQUA_GREEN}
                radius={CircularButtonSize()}
              >
                <Icon
                  testID="mic-icon-test"
                  name="mic"
                  size={30}
                  style={styles.icon}
                />
              </CircularButton>
            ) : (
              <CircularButton
                testId="mic-off-button-test"
                onPress={toggleMic}
                color={Colors.AQUA_GREEN}
                radius={CircularButtonSize()}
              >
                <Icon
                  testID="mic-off-icon-test"
                  name="mic-off"
                  size={30}
                  style={styles.icon}
                />
              </CircularButton>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default VerseDetailPage;
