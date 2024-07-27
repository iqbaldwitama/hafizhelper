import React from "react";
import { Text, View, ImageBackground } from "react-native";
import { HistoryCardProps } from "./interface";
import { styles } from "./styles";

const HistoryCard: React.FC<HistoryCardProps> = ({ content }) => {
  return (
    <View style={styles.card} testID="surah-card">
      <View style={styles.imageContainer}>
        <ImageBackground
          source={require("../../assets/images/container-nomor-surat.png")}
          resizeMode="cover"
          style={styles.image}
        >
          <Text style={styles.number}>{content.surah_number}</Text>
        </ImageBackground>
      </View>
      <View style={styles.textContainer}>
        <View>
          <Text style={styles.title}>{content.surah}</Text>
          <Text style={styles.subtitle}>Ayat {content.verse}</Text>
        </View>
      </View>
    </View>
  );
};

export default HistoryCard;
