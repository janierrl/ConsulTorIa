import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRoute } from '@react-navigation/native';

export default function ({ navigation }) {
  const [showMore, setShowMore] = useState(false);
  const { data, isConsultancy } = useRoute().params;

  const formatDate = (dateTime) => {
    const [date, time, meridian] = dateTime.split(" ");
    return `${date} - ${time} ${meridian}`;
  };

  const ItemList = ({ elements }) => (
    elements.length > 0 ?
      <View>
        {elements.map((element, index) => (
          <View
            key={index}
            style={styles.containerItemList}
          >
            <Text style={styles.itemPoint}>•</Text>
            <Text>{element}</Text>
          </View>
        ))}
      </View> :
      <Text style={styles.valueDetailItem}>No hay colaboradores para mostrar</Text>
  );
  
  const DetailItem = ({ title, value, lastItem, showItem }) => (
    <View style={{ marginBottom: lastItem ? 0 : 10 }}>
      {showItem ?
        <TouchableOpacity
          onPress={() => setShowMore(!showMore)}
          style={styles.showMore}
        >
          <Text style={styles.showMoreValue}>{value}</Text>
          <Feather name={showMore ? "chevron-up" : "chevron-down"} size={22} color={'#3366FF'} />
        </TouchableOpacity> :
        <>
          <Text style={styles.titleDetailItem}>{title}</Text>
          {title === "Objetivos" || title === "Equipo" ? 
            <ItemList elements={value} /> :
            <Text style={styles.valueDetailItem}>{value}</Text>
          }
        </>
      }
      {!lastItem && <View style={styles.separatorItem} />}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{
              uri: `data:image/png;base64,${data.thumbnail}`,
            }}
            style={styles.image}
          />
          <Text style={styles.titleHeader}>
            {isConsultancy ? data.nameConsultancy : data.nameScreen}
          </Text>
          <Text style={styles.fatherHeader}>
            {isConsultancy ? data.author : data.nameConsultancy}
          </Text>
        </View>

        <View style={styles.containerDetails}>
          <DetailItem title="Fecha de inicio" value={formatDate(isConsultancy ? data.startDateConsultancy : data.startDateScreen)} />
          <DetailItem title="Fecha de fin" value={formatDate(isConsultancy ? data.endDateConsultancy : data.endDateScreen)} />
          {isConsultancy ?
            <>
              <DetailItem title="Duración" value={data.duration} />
              <DetailItem title="Visualización" value={data.view} />
              <DetailItem title="Entidad" value={data.entity} />
              {!showMore &&
                <DetailItem value={"Ver más"} showItem lastItem />
              }
              {showMore && (
                <>
                  <DetailItem title="Tipo de observación" value={data.observationType} />
                  <DetailItem title="Ueb" value={data.ueb} />
                  <DetailItem title="Unidad" value={data.unit} />
                  <DetailItem title="Área" value={data.area} />
                  <DetailItem title="Proceso" value={data.process} />
                  <DetailItem title="Trabajador" value={data.worker} />
                  <DetailItem title="Equipo" value={data.collaborators} />
                  <DetailItem title="Objetivos" value={data.goals} />
                  {showMore &&
                    <DetailItem value={"Ver menos"} showItem lastItem />
                  }
                </>
              )}
            </> :
            <DetailItem title="Duración" value={data.duration} lastItem/>
          }
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
  image: {
    width: 200,
    height: 120,
    borderRadius: 10,
    marginVertical: 20, 
  },
  titleHeader: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
  },
  fatherHeader: {
    fontSize: 15,
    marginBottom: 10,
  },
  containerDetails: {
    backgroundColor: "#f0f0f0",
    marginTop: 10,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  containerItemList: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  itemPoint: {
    marginRight: 8,
  },
  showMore: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between'
  },
  showMoreValue: {
    fontSize: 14,
    color: '#3366FF',
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