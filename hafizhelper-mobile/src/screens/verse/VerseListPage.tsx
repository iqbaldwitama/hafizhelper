import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { VerseCard } from "../../components";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "./styles";
import {
  NavigationProp,
  ParamListBase,
  useIsFocused,
  useRoute,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import ErrorPage from "../error/ErrorPage";
import ScreenName from "../../utils/ScreenName";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useCreateUserHistory from "../../hooks/useCreateHistory";
import FontSize from "../../utils/FontSize";
import { VerseStyle } from "../../components/ayat/interface";
import useScreen from "../../hooks/useScreen";
import Colors from "../../utils/Colors";
import useSpecificSurahBookmarkQuery from "../../hooks/bookmark/useSpecificSurahBookmarkQuery";
import useDeleteSurahBookmarkQuery from "../../hooks/bookmark/useDeleteSurahBookmarkQuery";
import useCreateSurahBookmark from "../../hooks/bookmark/useCreateSurahBookmark";
import { useVerseData } from "../../hooks/useVerseData";
import { useAuth } from "../../context/AuthContext";
import LoadingIndicator from "../../components/utils/LoadingIndicator";

interface VerseListProps {
  navigation: NavigationProp<ParamListBase>;
}

const VerseListPage = ({ navigation }: VerseListProps) => {
  const { authState } = useAuth();
  const route = useRoute();
  const [fontsLoaded] = useFonts({
    "LPMQ IsepMisbah": require("../../assets/fonts/LPMQ IsepMisbah.ttf"),
  });

  const screen = useScreen();

  const [refreshing, setRefreshing] = React.useState(false);
  const isFocused = useIsFocused();

  const [inputValue, setInputValue] = useState("");
  const [arabicSetting, setArabicSetting] = useState("01");

  const { suratId = 1, verseNumber = 1 } = route.params as {
    suratId: number;
    verseNumber: number;
  };

  const [artiSwitchEnabled, setArtiSwitchEnabled] =
    useState<boolean>(true);

  const [verseStyle, setVerseStyle] = useState<VerseStyle>({
    fontSizeStyle: FontSize.SMALL_STYLE.verseList,
  });

  const [verseYCoordinates, setVerseYCoordinates] = useState([0]);

  const scrollRef = useRef<ScrollView>(null);

  const {
    verseData,
    verseLoading,
    verseError,
    verseMadinahData,
    verseMadinahLoading,
    loadVerses,
  } = useVerseData(suratId, arabicSetting);

  // istanbul ignore next
  useEffect(() => {
    if (isFocused) {
      navigation.getParent()?.setOptions({ swipeEnabled: false });
      const setupAsyncStorageAndLoadVerses = async () => {
        await loadAsyncStorage();
        loadVerses();
      };

      setupAsyncStorageAndLoadVerses();
    }
  }, [
    isFocused,
    screen.isPortrait,
    suratId,
    arabicSetting,
    verseYCoordinates,
  ]);

  const maxAyat = verseData?.jumlahAyat || 0;

  const { flag: isBookmarked, refetch: refetchBookmark } =
    useSpecificSurahBookmarkQuery(suratId, authState.isLoggedIn);

  // istanbul ignore next
  const onRefresh = () => {
    setRefreshing(!refreshing);
    loadVerses();
    refetchBookmark();
  };

  // istanbul ignore next
  const loadAsyncStorage = async () => {
    const artiSetting = await AsyncStorage.getItem("artiEnabled");
    const arabicSettingValue =
      await AsyncStorage.getItem("arabicOption");

    const fontSizeSetting =
      await AsyncStorage.getItem("fontSizeOption");

    setArtiSwitchEnabled(artiSetting != "false");

    const newFontSizeStyle = verseStyle;

    switch (fontSizeSetting) {
      case FontSize.SMALL:
        newFontSizeStyle.fontSizeStyle =
          FontSize.SMALL_STYLE.verseList;
        break;
      case FontSize.MEDIUM:
        newFontSizeStyle.fontSizeStyle =
          FontSize.MEDIUM_STYLE.verseList;
        break;
      case FontSize.LARGE:
        newFontSizeStyle.fontSizeStyle =
          FontSize.LARGE_STYLE.verseList;
        break;
    }

    setVerseStyle(newFontSizeStyle);
    setArabicSetting(arabicSettingValue ?? "01");
  };

  if (verseError) {
    return (
      <ErrorPage
        error={new Error(verseError)}
        resetError={onRefresh}
      />
    );
  }

  const navigateToVerseDetail = async (ayatNo: number) => {
    // istanbul ignore next
    if (authState.isLoggedIn) {
      await useCreateUserHistory(
        ayatNo,
        verseData?.namaLatin ?? "",
        verseData?.nomor ?? 1,
      );
    }
    navigation.navigate(ScreenName.VERSE_DETAIL_PAGE, {
      data: verseData?.ayat[ayatNo - 1],
      dataMadinah: verseMadinahData?.verses?.[ayatNo - 1],
      surah: verseData?.namaLatin,
      jumlahAyat: verseData?.jumlahAyat,
      allAyat: verseData?.ayat,
      allAyatMadinah: verseMadinahData?.verses,
      noSurat: suratId,
    });
  };

  // istanbul ignore next
  const jumpToVerse = (ayatNo: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        y: verseYCoordinates[ayatNo],
      });
    }
  };

  // istanbul ignore next
  const handleSubmit = () => {
    const ayatNo = parseInt(inputValue, 10);

    if (isNaN(ayatNo) || ayatNo < 1 || ayatNo > maxAyat) {
      Alert.alert(
        "Error",
        "Periksa kembali nomor ayat yang dimasukkan.",
      );
    } else {
      jumpToVerse(ayatNo);
      setInputValue("");
    }
  };

  // istanbul ignore next
  const HandleCreateBookmark = async () => {
    await useCreateSurahBookmark(verseData?.namaLatin ?? "", suratId);
    refetchBookmark();
  };

  // istanbul ignore next
  const HandleDeleteBookmark = async () => {
    await useDeleteSurahBookmarkQuery(suratId);
    refetchBookmark();
  };

  if (
    !fontsLoaded ||
    verseLoading ||
    (arabicSetting === "01" && verseMadinahLoading)
  ) {
    return <LoadingIndicator />;
  }

  const headerComponent = () => {
    return (
      <View testID="headerComponent">
        <View style={styles.header}>
          <Text style={styles.title}>{verseData?.namaLatin}</Text>
          <Text style={styles.subtitle}>
            {verseData?.arti} &#8226; {verseData?.jumlahAyat} Ayat
          </Text>
          {authState.isLoggedIn ? (
            <TouchableOpacity
              style={styles.bookmarkButton}
              testID="bookmark-button"
            >
              {
                // istanbul ignore next
                !isBookmarked ? (
                  <Icon
                    name="bookmark-outline"
                    size={24}
                    color={Colors.GREEN}
                    onPress={HandleCreateBookmark}
                    testID="not-bookmarked"
                  />
                ) : (
                  <Icon
                    name="bookmark"
                    size={24}
                    color={Colors.GREEN}
                    onPress={HandleDeleteBookmark}
                    testID="bookmarked"
                  />
                )
              }
            </TouchableOpacity>
          ) : (
            <View testID="bookmark-disabled"></View>
          )}
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Masukkan nomor ayat untuk dibaca..."
              placeholderTextColor={"#949494"}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="numeric"
              onSubmitEditing={handleSubmit}
              style={styles.searchBar}
              testID="verseSearchBar"
            />
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.searchButton}
              testID="searchButton"
            >
              <Text style={styles.searchText}>Cari</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.lineHeader} />
      </View>
    );
  };

  //* to combine both the verse
  // istanbul ignore next
  const combinedVerseData = verseData?.ayat.map((item, index) => {
    const madinahVerse = verseMadinahData?.verses[index];
    return {
      ...item,
      text_uthmani: madinahVerse ? madinahVerse.text_uthmani : null,
    };
  });

  const scrollRefValue =
    verseData?.jumlahAyat != 999 ? scrollRef : null;

  return (
    <View style={styles.container}>
      {screen.isPortrait && headerComponent()}
      <ScrollView
        ref={scrollRefValue} // for testing purposes make scrollRef null
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          ...styles.scrollViewContent,
          paddingHorizontal: screen.isPortrait ? 5 : 10,
        }}
      >
        {!screen.isPortrait && headerComponent()}
        {suratId != 1 && suratId != 9 && (
          <View
            testID="basmallah"
            style={{
              ...styles.basmallahContainer,
              width: screen.isPortrait ? "60%" : "40%",
            }}
          >
            <Image
              source={require("../../assets/images/bismillah.png")}
              style={styles.basmallahImage}
            />
          </View>
        )}

        {combinedVerseData?.map((item, index) => (
          <View
            key={item.nomorAyat}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              const newVerseYCoordinates = verseYCoordinates;
              newVerseYCoordinates[item.nomorAyat] = layout.y;
              setVerseYCoordinates(newVerseYCoordinates);
              if (newVerseYCoordinates.length == maxAyat + 1) {
                //offset by 1 (index 0)
                jumpToVerse(verseNumber);
              }
            }}
            testID="verse-card-container"
          >
            <TouchableOpacity
              testID="verse-card"
              onPress={() => navigateToVerseDetail(item.nomorAyat)}
              style={styles.cardContainer}
            >
              <VerseCard
                content={{
                  ayat_nomor: item.nomorAyat,
                  arabic:
                    // istanbul ignore next
                    arabicSetting === "01" &&
                    verseMadinahData?.verses?.[index]?.text_uthmani
                      ? verseMadinahData.verses[index].text_uthmani
                      : item.teksArab,
                  id_translate: item.teksIndonesia,
                  arti_setting: artiSwitchEnabled,
                }}
                fontSizeStyle={verseStyle.fontSizeStyle}
              />
            </TouchableOpacity>
            <View style={styles.line}></View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default VerseListPage;
