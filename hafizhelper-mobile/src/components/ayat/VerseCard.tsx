import React from "react";
import { Text, View, ImageBackground } from "react-native";
import { AyatCardProps, VerseStyle } from "./interface";
import { styles } from "./styles";

const VerseCard: React.FC<AyatCardProps & VerseStyle> = ({
  content,
  fontSizeStyle,
}) => {
  return (
    <View style={styles.card} testID="verse-card">
      <View style={styles.verseContainer}>
        <View
          style={{
            ...styles.numberContainer,
            paddingVertical: fontSizeStyle.numberPaddingVertical,
          }}
        >
          <ImageBackground
            source={require("../../assets/images/container-nomor-ayat.png")}
            resizeMode="cover"
            style={styles.image}
          >
            <Text style={styles.number}>{content.ayat_nomor}</Text>
          </ImageBackground>
        </View>
        <View style={styles.arabicContainer}>
          <Text
            testID="arabic-test"
            style={{
              ...styles.arabic,
              fontSize: fontSizeStyle.arabicFontSize,
              lineHeight: fontSizeStyle.arabiclineHeight,
            }}
          >
            {content.arabic}
          </Text>
        </View>
      </View>
      {content.arti_setting && (
        <View>
          <Text
            testID="arti-test"
            style={{
              ...styles.description,
              fontSize: fontSizeStyle.meaningFontSize,
            }}
          >
            {content.id_translate}
          </Text>
        </View>
      )}
    </View>
  );
};

export default VerseCard;
