import React from "react";
import { ImageBackground, Text, View } from "react-native";
import { CardProps } from "./interface";
import { styles } from "./styles";

const SurahCard: React.FC<CardProps> = ({ content }) => {
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
            {content.meaning} <Text style={styles.dot}>&#9679;</Text>{" "}
            {content.verses_count} Ayat
          </Text>
        </View>
        <View>
          <Text style={styles.arabic}>{content.title}</Text>
        </View>
      </View>
    </View>
  );
};

export default SurahCard;
