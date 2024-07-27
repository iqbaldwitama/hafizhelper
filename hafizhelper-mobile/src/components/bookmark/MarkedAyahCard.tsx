import React from "react";
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";
import Icon from "react-native-vector-icons/MaterialIcons";
import { BookmarkAyatCard } from "../surah/interface";
import Colors from "../../utils/Colors";

const MarkedAyahCard: React.FC<BookmarkAyatCard> = ({
  content,
  onDeleteBookmark,
}) => {
  return (
    <View style={styles.card} testID="surah-card">
      <View style={styles.imageContainer}>
        <ImageBackground
          source={require("../../assets/images/container-nomor-surat.png")}
          resizeMode="cover"
          style={styles.image}
        >
          <Text style={styles.number}>{content.surah_no}</Text>
        </ImageBackground>
      </View>
      <View style={styles.textContainer}>
        <View>
          <Text style={styles.title}>{content.latin_title}</Text>
          <Text style={styles.description}>
            Ayat {content.ayat_no}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.iconAyat}
          testID="bookmark-ayat-button"
          onPress={onDeleteBookmark}
        >
          <Icon
            name="bookmark"
            size={24}
            color={Colors.GREEN}
            testID="bookmarked"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MarkedAyahCard;
