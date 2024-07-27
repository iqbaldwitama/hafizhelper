import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { styles } from "./styles";
import {
  DrawerActions,
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";
import useHistoryQuery from "../../hooks/useHistoryQuery";
import HistoryCard from "../../components/history/HistoryCard";
import ScreenName from "../../utils/ScreenName";
import DateSeparator from "../../components/DateSeparator";
import { History } from "../../interfaces/History";
import { useAuth } from "../../context/AuthContext";
import LoadingIndicator from "../../components/utils/LoadingIndicator";
import ErrorPage from "../error/ErrorPage";

interface HistoryProps {
  navigation: NavigationProp<ParamListBase>;
}

// istanbul ignore next
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const HistoryPage = ({ navigation }: HistoryProps) => {
  const [refreshing, setRefreshing] = useState(false);
  const { authState } = useAuth();

  const { data, isLoading, error, refetch } = useHistoryQuery(
    authState.isLoggedIn,
  );

  const navigateToVerseListPage = useCallback(
    (surahNo: number, verseNumber: number) => {
      navigation.getParent()?.setOptions({ swipeEnabled: false });
      navigation.dispatch(DrawerActions.closeDrawer());
      navigation.navigate(ScreenName.VERSE_LIST_PAGE, {
        suratId: surahNo,
        verseNumber: verseNumber,
      });
    },
    [navigation],
  );

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

  if (isLoading) {
    return <LoadingIndicator />;
  }

  const onRefresh = () => {
    setRefreshing(!refreshing);
    refetch();
  };

  if (error) {
    return <ErrorPage error={error} resetError={onRefresh} />;
  }

  const getJustDate = (dateTime: string) => {
    return dateTime.split("T")[0];
  };

  let lastDate = "";
  // istanbul ignore next
  if (!authState.isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.message} testID="error-msg">
          Login terlebih dahulu untuk menggunakan fitur ini
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Riwayat Bacaan</Text>
        <Text style={styles.subtitle}>
          Lihat kembali bacaan terakhir Anda
        </Text>
        <View style={styles.line}></View>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        testID="scroll-view"
      >
        {data?.map((item: History) => {
          const itemDate = getJustDate(item.created_at);
          const dateSeparator =
            itemDate !== lastDate ? (
              <DateSeparator date={formatDate(item.created_at)} />
            ) : null;

          lastDate = itemDate;

          return (
            <React.Fragment key={item.id}>
              {dateSeparator}
              <TouchableOpacity
                testID="history-card"
                onPress={() =>
                  navigateToVerseListPage(
                    item.surah_number,
                    item.verse,
                  )
                }
                style={styles.cardContainer}
              >
                <HistoryCard
                  content={{
                    ...item,
                    surah_number: item.surah_number,
                  }}
                  style={styles.card}
                />
                <View style={styles.line} />
              </TouchableOpacity>
            </React.Fragment>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default HistoryPage;
