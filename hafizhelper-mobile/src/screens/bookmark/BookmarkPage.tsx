import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { styles } from "./styles";
import {
  DrawerActions,
  NavigationProp,
  ParamListBase,
  useIsFocused,
} from "@react-navigation/native";
import ScreenName from "../../utils/ScreenName";
import useAyahBookmarkQuery from "../../hooks/bookmark/useAyahBookmarkQuery";
import useSurahBookmarkQuery from "../../hooks/bookmark/useSurahBookmarkQuery";
import { AyahBookmark } from "../../interfaces/AyahBookmark";
import MarkedAyahCard from "../../components/bookmark/MarkedAyahCard";
import { SurahBookmark } from "../../interfaces/SurahBookmark";
import MarkedSurahCard from "../../components/bookmark/MarkedSurahCard";
import ErrorPage from "../error/ErrorPage";
import LoadingIndicator from "../../components/utils/LoadingIndicator";
import { useAuth } from "../../context/AuthContext";
import useDeleteAyahBookmarkQuery from "../../hooks/bookmark/useDeleteAyahBookmarkQuery";
import useDeleteSurahBookmarkQuery from "../../hooks/bookmark/useDeleteSurahBookmarkQuery";

interface BookmarkPageProps {
  navigation: NavigationProp<ParamListBase>;
}

const BookmarkPage: React.FC<BookmarkPageProps> = ({
  navigation,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [showLayout, setShowLayout] = useState(true);

  const { authState } = useAuth();

  const isFocused = useIsFocused();

  const {
    data: dataAyat,
    isLoading: isAyahLoading,
    error: ayahError,
    refetch: refetchAyah,
  } = useAyahBookmarkQuery(authState.isLoggedIn);
  const {
    data: dataSurat,
    isLoading: isSurahLoading,
    error: surahError,
    refetch: refetchSurah,
  } = useSurahBookmarkQuery(authState.isLoggedIn);

  const onRefresh = () => {
    setRefreshing(!refreshing);
    refetchAyah();
    refetchSurah();
  };

  useEffect(() => {
    if (isFocused) {
      navigation.getParent()?.setOptions({ swipeEnabled: false });
    }
    refetchAyah();
    refetchSurah();
  }, [isFocused]);

  const navigateToVerseListPage = useCallback(
    (surahNo: number) => {
      navigation.getParent()?.setOptions({ swipeEnabled: false });
      navigation.dispatch(DrawerActions.closeDrawer());
      navigation.navigate(ScreenName.VERSE_LIST_PAGE, {
        suratId: surahNo,
      });
    },
    [navigation],
  );

  // istanbul ignore next
  const navigateToVerseDetail = async (
    suratNo: number,
    ayatNo: number,
  ) => {
    const response = await fetch(
      `https://equran.id/api/v2/surat/${suratNo}`,
    );
    const json = await response.json();

    const responseMadinah = await fetch(
      `https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${suratNo}`,
    );
    const jsonMadinah = await responseMadinah.json();

    navigation.navigate(ScreenName.VERSE_DETAIL_PAGE, {
      data: json.data.ayat[ayatNo - 1],
      dataMadinah: jsonMadinah.verses[ayatNo - 1],
      surah: json.data.namaLatin,
      jumlahAyat: json.data.jumlahAyat,
      allAyat: json.data.ayat,
      allAyatMadinah: jsonMadinah.verses,
      noSurat: suratNo,
    });
  };

  const HandleDeleteAyahBookmark = async (
    noSurat: number,
    noAyat: number,
  ) => {
    await useDeleteAyahBookmarkQuery(noSurat, noAyat);
    refetchAyah();
  };

  const HandleDeleteSurahBookmark = async (noSurat: number) => {
    await useDeleteSurahBookmarkQuery(noSurat);
    refetchSurah();
  };

  const navigateToLoginPage = () => {
    navigation.navigate(ScreenName.LOGIN_PAGE);
  };

  if (!authState.isLoggedIn) {
    return (
      <ErrorPage
        error={new Error("Login Error")}
        buttonName={"login"}
        resetError={navigateToLoginPage}
      />
    );
  }

  if (ayahError) {
    return <ErrorPage error={ayahError} resetError={onRefresh} />;
  }

  if (surahError) {
    return <ErrorPage error={surahError} resetError={onRefresh} />;
  }

  const isButtonSelected = showLayout
    ? styles.ButtonSelected
    : styles.ButtonUnselected;
  const isButtonNotSelected = showLayout
    ? styles.ButtonUnselected
    : styles.ButtonSelected;
  const textIsButtonSelected = showLayout
    ? styles.selectedButtonText
    : styles.unselectedButtonText;
  const textIsButtonNotSelected = showLayout
    ? styles.unselectedButtonText
    : styles.selectedButtonText;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bookmarks</Text>
        <Text style={styles.subtitle}>
          Lihat kembali surat & ayat yang telah ditandai
        </Text>
        <View style={styles.line}></View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isButtonSelected]}
          onPress={() => setShowLayout(true)}
          testID="surat-layout"
        >
          <Text style={textIsButtonSelected}>Surat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isButtonNotSelected]}
          onPress={() => setShowLayout(false)}
          testID="ayat-layout"
        >
          <Text style={textIsButtonNotSelected}>Ayat</Text>
        </TouchableOpacity>
      </View>
      {isAyahLoading && isSurahLoading ? (
        <LoadingIndicator />
      ) : (
        <React.Fragment>
          {/* istanbul ignore next */}
          {showLayout ? (
            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              testID="scroll-view"
            >
              {dataSurat?.map((item: SurahBookmark) => (
                <React.Fragment key={item.created_at}>
                  <TouchableOpacity
                    style={styles.cardContainer}
                    onPress={() =>
                      navigateToVerseListPage(item.surah_number)
                    }
                    testID="surat-card"
                  >
                    <MarkedSurahCard
                      content={{
                        latin_title: item.surah,
                        surah_no: item.surah_number,
                      }}
                      onDeleteBookmark={() =>
                        HandleDeleteSurahBookmark(item.surah_number)
                      }
                      style={styles.card}
                    />
                    <View style={styles.line} />
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </ScrollView>
          ) : (
            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              testID="scroll-view"
            >
              {dataAyat?.map((item: AyahBookmark) => (
                <React.Fragment key={item.created_at}>
                  <TouchableOpacity
                    style={styles.cardContainer}
                    onPress={() =>
                      navigateToVerseDetail(
                        item.surah_number,
                        item.ayat,
                      )
                    }
                    testID="ayat-card"
                  >
                    <MarkedAyahCard
                      content={{
                        ayat_no: item.ayat,
                        latin_title: item.surah,
                        surah_no: item.surah_number,
                      }}
                      onDeleteBookmark={() =>
                        HandleDeleteAyahBookmark(
                          item.surah_number,
                          item.ayat,
                        )
                      }
                      style={styles.card}
                    />
                    <View style={styles.line} />
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </ScrollView>
          )}
        </React.Fragment>
      )}
    </View>
  );
};

export default BookmarkPage;
