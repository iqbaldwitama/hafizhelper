import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
} from "react-native";
import {
  DrawerActions,
  NavigationProp,
  ParamListBase,
  useIsFocused,
} from "@react-navigation/native";
import Swiper from "react-native-swiper";

import { SurahCard } from "../../components";
import { fetchSurah } from "../../networks/surah/fetchSurah";
import SurahInterface from "../../interfaces/Surah";
import { styles } from "./styles";
import ErrorPage from "../error/ErrorPage";
import ScreenName from "../../utils/ScreenName";
import Colors from "../../utils/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthContext";
import useScreen from "../../hooks/useScreen";
import LoadingIndicator from "../../components/utils/LoadingIndicator";

interface HomePageProps {
  navigation: NavigationProp<ParamListBase>;
}

const HomePage: React.FC<HomePageProps> = ({ navigation }) => {
  const { authState } = useAuth();
  const [surahData, setSurahData] = useState<SurahInterface[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [refreshing, setRefreshing] = React.useState(false);
  const [pageError, setPageError] = useState<Error>();
  const isFocused = useIsFocused();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showPopup, setShowPopup] = useState<boolean>(true);
  const screen = useScreen();

  const onRefresh = () => {
    setRefreshing(!refreshing);
  };

  useEffect(() => {
    if (isFocused) {
      navigation.getParent()?.setOptions({ swipeEnabled: true });
      loadAsync();
    }
    const fetchData = async () => {
      try {
        setPageError(undefined);
        const data = await fetchSurah();
        setSurahData(data);
      } catch (error) {
        setPageError(error as Error);
      }
    };

    fetchData();
  }, [refreshing, isFocused, screen.isPortrait]);

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
  const loadAsync = async () => {
    try {
      const popUp = await AsyncStorage.getItem("PopupStatus");
      if (popUp) {
        setShowPopup(false);
      }
    } catch (error) {
      console.log("Error loading async storage", error);
    }
  };

  const handleSearch = useCallback((text: string) => {
    setSearchTerm(text);
  }, []);

  const filteredSurahData = surahData.filter((surah) =>
    surah.nama_latin.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // istanbul ignore next
  const handleDone = async () => {
    await AsyncStorage.setItem("PopupStatus", "true");
    setShowPopup(false);
  };

  if (pageError) {
    return <ErrorPage error={pageError} resetError={onRefresh} />;
  }

  if (surahData.length == 0) {
    return <LoadingIndicator />;
  }

  // istanbul ignore next
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.salam} testID="salam">
          Assalamualaikum
        </Text>
        <Text style={styles.title} testID="title">
          {authState.user?.fullName ?? "Sobat Hafiz"}
        </Text>
        <Text style={styles.subtitle} testID="subtitle">
          Siap berlatih mengaji hari ini?
        </Text>
        <TextInput
          placeholder="Cari surah untuk dibaca..."
          placeholderTextColor={"#949494"}
          value={searchTerm}
          onChangeText={handleSearch}
          style={styles.searchBar}
          testID="surahSearchBar"
        />
      </View>
      <View style={styles.lineHeader}></View>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        testID="scroll-view"
      >
        {filteredSurahData.map((item) => (
          <React.Fragment key={item.nomor}>
            <TouchableOpacity
              testID="surah-card"
              onPress={() => navigateToVerseListPage(item.nomor)}
              style={styles.cardContainer}
            >
              <SurahCard
                content={{
                  title: item.nama,
                  meaning: item.arti,
                  surah_no: item.nomor,
                  latin_title: item.nama_latin,
                  verses_count: item.jumlah_ayat,
                }}
                style={styles.card}
              />
              <View style={styles.line} />
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </ScrollView>
      <Modal
        visible={showPopup}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowPopup(false)}
        testID="modal"
      >
        <View style={styles.Popup}>
          <View style={styles.PopupContainer}>
            <Swiper
              loop={false}
              showsPagination={true}
              onIndexChanged={(index) => setCurrentIndex(index)}
              activeDotColor={Colors.DARK_GREEN}
              showsButtons={true}
              testID="popup"
            >
              <View style={styles.slideContainer}>
                <Image
                  style={styles.imagePopup}
                  source={require("../../assets/images/Popup_1.png")}
                />
              </View>
              <View style={styles.slideContainer}>
                <Image
                  style={styles.imagePopup}
                  source={require("../../assets/images/Popup_2.png")}
                />
              </View>
              <View style={styles.slideContainer}>
                <Image
                  style={styles.imagePopup}
                  source={require("../../assets/images/Popup_3.png")}
                />
              </View>
            </Swiper>
            <View style={styles.paginationContainer}>
              <TouchableOpacity></TouchableOpacity>
              <TouchableOpacity onPress={handleDone}>
                {currentIndex === 2 ? (
                  <Text style={styles.buttonText}>Selesai</Text>
                ) : (
                  <Text style={styles.buttonText}>Lewati</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomePage;
