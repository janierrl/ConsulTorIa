import React from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from '@react-navigation/native';

export default function ({ navigation }) {
  const { data } = useRoute().params;
  
  const DetailItem = ({ title, value, lastItem }) => (
    <View style={{ marginBottom: lastItem ? 0 : 10 }}>
      <Text style={styles.titleDetailItem}>{title}</Text>
      <Text style={styles.valueDetailItem}>{value}</Text>
      {!lastItem && <View style={styles.separatorItem} />}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View
            style={[
              styles.avatarContainer,
              !data.photo &&
                styles.noPhoto
            ]}
          >
            {data.photo ?
              <Image
                source={{
                  uri: `data:image/png;base64,${data.photo}`,
                }}
                style={styles.image}
              /> :
              <MaterialCommunityIcons name="account" style={styles.accountIcon} />
            }
          </View>
          <Text style={styles.titleHeader}>
            {data.name} {data.lastname}
          </Text>
        </View>
        <View style={styles.containerDetails}>
          <DetailItem title="Usuario" value={data.user} />
          <DetailItem title="Correo" value={data.email} lastItem />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    width: 130,
    height: 130,
    borderRadius: 70,
    marginVertical: 20, 
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  noPhoto: {
    borderWidth: 2.5,
    borderColor: 'black',
    borderStyle: 'solid',
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 70,
  },
  accountIcon: {
    fontSize: 125,
    marginTop: '16%',
    color: 'black',
  },
  titleHeader: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
  },
  containerDetails: {
    backgroundColor: "#f0f0f0",
    marginTop: 10,
    borderRadius: 20,
    padding: 20,
  },
  titleDetailItem: {
    fontSize: 12,
    color: "#888888",
    marginBottom: 4,
  },
  valueDetailItem: {
    fontSize: 14,
  },
  separatorItem: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginTop: 10
  },
});