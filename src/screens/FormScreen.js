import React, { useState, useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  Modal
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export default function ({ navigation }) {
  const [entityData, setEntityData] = useState([]);
  const [uebData, setUebData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [areaData, setAreaData] = useState([]);
  const [processData, setProcessData] = useState([]);
  const [workerData, setWorkerData] = useState([]);
  const [entity, setEntity] = useState("");
  const [ueb, setUeb] = useState("");
  const [unit, setUnit] = useState("");
  const [area, setArea] = useState("");
  const [process, setProcess] = useState("");
  const [worker, setWorker] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const [isEmptyData, setIsEmptyData] = useState({
    isEmptyEntityData: false,
    isEmptyUebData: false,
    isEmptyUnitData: false,
    isEmptyAreaData: false,
    isEmptyProcessData: false,
    isEmptyWorkerData: false,
  });
  const [isDisabledEditIcon, setIsDisabledEditIcon] = useState({
    isDisabledEditEntityIcon: false,
    isDisabledEditUebIcon: true,
    isDisabledEditUnitIcon: true,
    isDisabledEditAreaIcon: true,
    isDisabledEditProcessIcon: true,
    isDisabledEditWorkerIcon: true,
  });
  const urls = [
    "http://192.168.1.103:4000/api/entity",
    "http://192.168.1.103:4000/api/ueb",
    "http://192.168.1.103:4000/api/unit",
    "http://192.168.1.103:4000/api/area",
    "http://192.168.1.103:4000/api/process",
    "http://192.168.1.103:4000/api/worker"
  ];
  const infoUrls = {
    "entity": {
      "setData": setEntityData,
      "isEmptyData": "isEmptyEntityData",
      "isDisabledEditIcon": "isDisabledEditEntityIcon",
      "value": "nombre",
      "label": "nombre",
      "father": "nombre",
    },
    "ueb": {
      "setData": setUebData,
      "isEmptyData": "isEmptyUebData",
      "isDisabledEditIcon": "isDisabledEditUebIcon",
      "value": "nombre",
      "label": "nombre",
      "father": "entidad",
    },
    "unit": {
      "setData": setUnitData,
      "isEmptyData": "isEmptyUnitData",
      "isDisabledEditIcon": "isDisabledEditUnitIcon",
      "value": "Unidad",
      "label": "Unidad",
      "father": "ueb",
    },
    "area": {
      "setData": setAreaData,
      "isEmptyData": "isEmptyAreaData",
      "isDisabledEditIcon": "isDisabledEditAreaIcon",
      "value": "Area",
      "label": "Area",
      "father": "Unidad",
    },
    "process": {
      "setData": setProcessData,
      "isEmptyData": "isEmptyProcessData",
      "isDisabledEditIcon": "isDisabledEditProcessIcon",
      "value": "label",
      "label": "label",
      "father": "Area",
    },
    "worker": {
      "setData": setWorkerData,
      "isEmptyData": "isEmptyWorkerData",
      "isDisabledEditIcon": "isDisabledEditWorkerIcon",
      "value": "Nombre",
      "label": "Nombre",
      "father": "Area",
    },
  };
  const borderBottomWidth = Array.from({ length: 6 }, () => useSharedValue(1));
  const borderColor = Array.from({ length: 6 }, () => useSharedValue('#939393'));

  const dataInputStyles = (index) => {
    return useAnimatedStyle(() => {
      return {
        borderBottomWidth: borderBottomWidth[index].value,
        borderBottomColor: borderColor[index].value,
      };
    });
  };

  const animateBorder = (index, focused) => {
    borderBottomWidth[index].value = withTiming(focused ? 2 : 1, {
      duration: 75,
      easing: Easing.ease,
    });
    borderColor[index].value = focused ? 'blue' : '#939393';
  };

  const handleFocus = (index) => {
    animateBorder(index, true);
  };

  const handleBlur = (index) => {
    animateBorder(index, false);
  };

  const handleIconPress = (isEmptyDataKey) => {
    setIsEmptyData(prevState => ({
      ...prevState,
      [isEmptyDataKey]: !prevState[isEmptyDataKey],
    }));
  };

  const handleResponse = (response, setData, isEmptyDataKey, isDisabledEditIconKey, valueKey, labelKey, fatherKey) => {
    if (response && response.data) {
      if (response.data.length > 0) {
        const dataArray = response.data.map(item => ({
          value: item[valueKey].trim(),
          label: item[labelKey].trim(),
          father: item[fatherKey].trim()
        }));
        setData(dataArray);
      } else {
        setIsEmptyData(prevState => ({
          ...prevState,
          [isEmptyDataKey]: true,
        }));
        setIsDisabledEditIcon(prevState => ({
          ...prevState,
          [isDisabledEditIconKey]: true,
        }));
      }
    } else {
      setIsEmptyData(prevState => ({
        ...prevState,
        [isEmptyDataKey]: true,
      }));
      setIsDisabledEditIcon(prevState => ({
        ...prevState,
        [isDisabledEditIconKey]: true,
      }));
    }
  };

  const fetchData = async (urlsToFetch, infoUrlsToFetch, exception) => {
    urlsToFetch.map((url) => {
      if (url !== exception) {
        const name = url.split('/').pop();
        axios.get(url)
          .then(response => {
            handleResponse(
              response, 
              infoUrlsToFetch[name].setData, 
              infoUrlsToFetch[name].isEmptyData,
              infoUrlsToFetch[name].isDisabledEditIcon, 
              infoUrlsToFetch[name].value, 
              infoUrlsToFetch[name].label, 
              infoUrlsToFetch[name].father
            );
          }).catch((error) => {
            if (error.response) {
              const { config, response } = error;
              const dataKey = config.url.split('/').pop().charAt(0).toUpperCase() + config.url.split('/').pop().slice(1);
              const isEmptyDataKey = `isEmpty${dataKey}Data`;
              const isDisabledEditIconKey = `isDisabledEdit${dataKey}Icon`;
              
              if (response.status === 404) {
                console.log(`${dataKey} not found (404)`);
                setIsEmptyData(prevState => ({
                  ...prevState,
                  [isEmptyDataKey]: true,
                }));
                setIsDisabledEditIcon(prevState => ({
                  ...prevState,
                  [isDisabledEditIconKey]: true,
                }));
                fetchData(urlsToFetch, infoUrlsToFetch, config.url);
              } else {
                setInfo('Error al obtener los datos');
              }
            } else {
              setInfo('Error al obtener los datos');
            }
          });
      }
    });
  };

  const verifyDataLength = async (data, element, isEmptyDataKey, isDisabledEditIconKey) => {
    const filterData = data.filter(item => item.father === element);
    
    if (filterData.length > 0) {
      setIsEmptyData(prevState => ({
        ...prevState,
        [isEmptyDataKey]: false,
      }));
      setIsDisabledEditIcon(prevState => ({
        ...prevState,
        [isDisabledEditIconKey]: false,
      }));
    } else {
      setIsEmptyData(prevState => ({
        ...prevState,
        [isEmptyDataKey]: true,
      }));
      setIsDisabledEditIcon(prevState => ({
        ...prevState,
        [isDisabledEditIconKey]: true,
      }));
    }
  };
  
  const RenderRightIcon = () => (
    <View style={styles.chevronIcon}>
      <Feather
        name="chevron-down"
        size={22}
        color={'black'}
      />
    </View>
  );

  const RenderInputSearch = ({ onSearch }) => (
    <View style={styles.containerInputSearch}>
      <View style={styles.inputSearch}>
        <TextInput
          placeholder="Buscar"
          onChangeText={(text) => {
            onSearch(text);
          }}
        />
        </View>
    </View>
  );

  const RenderItem = ({ item, selected }) => (
    <View
      style={[
        styles.containerItem,
        { backgroundColor: selected ? 'lightblue' : null },
      ]}
    >
      <Text style={styles.dataItem}>{item.label}</Text>
      {selected && <Feather name="check" size={18} color="green" />}
    </View>
  );

  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  useEffect(() => {
    fetchData(urls, infoUrls, "noUrl");
  }, []);

  return (
    <KeyboardAvoidingView behavior="height" style={{ flexGrow: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <MaterialCommunityIcons name="folder-eye" style={styles.eyeIcon} />
            <Text style={styles.titleHeader}>Crea observaciones</Text>
          </View>
          <View style={styles.dataInputContainer}>
            <View>
              <Animated.View
                style={[
                  styles.dataInput,
                  dataInputStyles(0),
                  styles.dataInputEntityContainer,
                ]}
              >
                {isEmptyData.isEmptyEntityData ?
                  <View style={styles.dataInputView}>
                    <TextInput
                      style={styles.dataInputWidth}
                      placeholder="Introduce un nombre de entidad"
                      value={entity}
                      autoCapitalize="sentences"
                      autoCompleteType="off"
                      autoCorrect={true}
                      onChangeText={(text) => {
                        setEntity(text);
                        verifyDataLength(
                          uebData,
                          text,
                          infoUrls["ueb"].isEmptyData,
                          infoUrls["ueb"].isDisabledEditIcon
                        );
                      }}
                      onFocus={() => {handleFocus(0)}}
                      onBlur={() => {handleBlur(0)}}
                    />
                    {isDisabledEditIcon.isDisabledEditEntityIcon ?
                      null :
                      <TouchableOpacity
                        style={styles.editTextInputToggle}
                        onPress={() => {
                          handleIconPress(infoUrls["entity"].isEmptyData);
                        }}
                      >
                        <Feather
                          name={"edit"}
                          size={22}
                          color={'black'}
                        />
                      </TouchableOpacity>
                    }
                  </View> :
                  <View style={styles.dataInputView}>
                    <Dropdown
                      style={styles.dataInputWidth}
                      selectedTextStyle={{
                        fontSize: 14,
                        color: "black",
                      }}
                      placeholderStyle={{
                        fontSize: 14,
                        color: "#939393",
                      }}
                      selectedTextProps={{
                        numberOfLines: 1,
                        ellipsizeMode: 'tail',
                      }}
                      containerStyle={styles.containerDropDownMenu}
                      placeholder="Selecciona una entidad"
                      value={entity}
                      data={entityData}
                      search={true}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      searchPlaceholder="Buscar..."
                      renderRightIcon={() => (
                        <RenderRightIcon />
                      )}
                      renderInputSearch={(onSearch) => (
                        <RenderInputSearch onSearch={onSearch} />
                      )}
                      renderItem={(item, selected) => (
                        <RenderItem item={item} selected={selected} />
                      )}
                      onChange={(item) => {
                        setEntity(item.value);
                        verifyDataLength(
                          uebData,
                          item.label,
                          infoUrls["ueb"].isEmptyData,
                          infoUrls["ueb"].isDisabledEditIcon
                        );
                      }}
                      onFocus={() => {handleFocus(0)}}
                      onBlur={() => {handleBlur(0)}}
                    />
                    <TouchableOpacity
                      style={styles.editDropDownToggle}
                      onPress={() => {
                        handleIconPress(infoUrls["entity"].isEmptyData);
                      }}
                    >
                      <Feather
                        name={"edit"}
                        size={22}
                        color={'black'}
                      />
                    </TouchableOpacity>
                  </View>
                }
              </Animated.View>
            </View>
            <View>
              <Animated.View
                style={[
                  styles.dataInput,
                  dataInputStyles(1),
                  styles.dataInputUebContainer,
                ]}
              >
                {isEmptyData.isEmptyUebData ?
                  <View style={styles.dataInputView}>
                    <TextInput
                      style={styles.dataInputWidth}
                      placeholder="Introduce un nombre de ueb"
                      value={ueb}
                      autoCapitalize="sentences"
                      autoCompleteType="off"
                      autoCorrect={true}
                      onChangeText={(text) => {
                        setUeb(text);
                        verifyDataLength(
                          unitData,
                          text,
                          infoUrls["unit"].isEmptyData,
                          infoUrls["unit"].isDisabledEditIcon
                        );
                      }}
                      onFocus={() => {handleFocus(1)}}
                      onBlur={() => {handleBlur(1)}}
                    />
                    {isDisabledEditIcon.isDisabledEditUebIcon ?
                      null :
                      <TouchableOpacity
                        style={styles.editTextInputToggle}
                        onPress={() => {
                          handleIconPress(infoUrls["ueb"].isEmptyData);
                        }}
                      >
                        <Feather
                          name={"edit"}
                          size={22}
                          color={'black'}
                        />
                      </TouchableOpacity>
                    }
                  </View> :
                  <View style={styles.dataInputView}>
                    <Dropdown
                      style={
                        isDisabledEditIcon.isDisabledEditUebIcon ? 
                          { width: '100%' } : 
                          styles.dataInputWidth
                      }
                      selectedTextStyle={{
                        fontSize: 14,
                        color: "black",
                      }}
                      placeholderStyle={{
                        fontSize: 14,
                        color: "#939393",
                      }}
                      selectedTextProps={{
                        numberOfLines: 1,
                        ellipsizeMode: 'tail',
                      }}
                      containerStyle={styles.containerDropDownMenu}
                      placeholder="Selecciona una ueb"
                      value={ueb}
                      data={uebData.filter(item => item.father === entity)}
                      search={true}
                      disable={entity ? false : true}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      searchPlaceholder="Buscar..."
                      renderRightIcon={() => (
                        <RenderRightIcon />
                      )}
                      renderInputSearch={(onSearch) => (
                        <RenderInputSearch onSearch={onSearch} />
                      )}
                      renderItem={(item, selected) => (
                        <RenderItem item={item} selected={selected} />
                      )}
                      onChange={(item) => {
                        setUeb(item.value);
                        verifyDataLength(
                          unitData,
                          item.label,
                          infoUrls["unit"].isEmptyData,
                          infoUrls["unit"].isDisabledEditIcon
                        );
                      }}
                      onFocus={() => {handleFocus(1)}}
                      onBlur={() => {handleBlur(1)}}
                    />
                    {isDisabledEditIcon.isDisabledEditUebIcon ?
                      null :
                      <TouchableOpacity
                        style={styles.editDropDownToggle}
                        onPress={() => {
                          handleIconPress(infoUrls["ueb"].isEmptyData);
                        }}
                      >
                        <Feather
                          name={"edit"}
                          size={22}
                          color={'black'}
                        />
                      </TouchableOpacity>
                    }
                  </View>
                }
              </Animated.View>
            </View>
            <View>
              <Animated.View
                style={[
                  styles.dataInput,
                  dataInputStyles(2),
                  styles.dataInputUnitContainer,
                ]}
              >
                {isEmptyData.isEmptyUnitData ?
                  <View style={styles.dataInputView}>
                    <TextInput
                      style={styles.dataInputWidth}
                      placeholder="Introduce un nombre de unidad"
                      value={unit}
                      autoCapitalize="sentences"
                      autoCompleteType="off"
                      autoCorrect={true}
                      onChangeText={(text) => {
                        setUnit(text);
                        verifyDataLength(
                          areaData,
                          text,
                          infoUrls["area"].isEmptyData,
                          infoUrls["area"].isDisabledEditIcon
                        );
                      }}
                      onFocus={() => {handleFocus(2)}}
                      onBlur={() => {handleBlur(2)}}
                    />
                    {isDisabledEditIcon.isDisabledEditUnitIcon ?
                      null :
                      <TouchableOpacity
                        style={styles.editTextInputToggle}
                        onPress={() => {
                          handleIconPress(infoUrls["unit"].isEmptyData);
                        }}
                      >
                        <Feather
                          name={"edit"}
                          size={22}
                          color={'black'}
                        />
                      </TouchableOpacity>
                    }
                  </View> :
                  <View style={styles.dataInputView}>
                    <Dropdown
                      style={
                        isDisabledEditIcon.isDisabledEditUnitIcon ?
                          { width: '100%' } : 
                          styles.dataInputWidth
                      }
                      selectedTextStyle={{
                        fontSize: 14,
                        color: "black",
                      }}
                      placeholderStyle={{
                        fontSize: 14,
                        color: "#939393",
                      }}
                      selectedTextProps={{
                        numberOfLines: 1,
                        ellipsizeMode: 'tail',
                      }}
                      containerStyle={styles.containerDropDownMenu}
                      placeholder="Selecciona una unidad"
                      value={unit}
                      data={unitData.filter(item => item.father === ueb)}
                      search={true}
                      disable={ueb ? false : true}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      searchPlaceholder="Buscar..."
                      renderRightIcon={() => (
                        <RenderRightIcon />
                      )}
                      renderInputSearch={(onSearch) => (
                        <RenderInputSearch onSearch={onSearch} />
                      )}
                      renderItem={(item, selected) => (
                        <RenderItem item={item} selected={selected} />
                      )}
                      onChange={(item) => {
                        setUnit(item.value);
                        verifyDataLength(
                          areaData,
                          item.label,
                          infoUrls["area"].isEmptyData,
                          infoUrls["area"].isDisabledEditIcon
                        );
                      }}
                      onFocus={() => {handleFocus(2)}}
                      onBlur={() => {handleBlur(2)}}
                    />
                    {isDisabledEditIcon.isDisabledEditUnitIcon ?
                      null :
                      <TouchableOpacity
                        style={styles.editDropDownToggle}
                        disabled={ueb ? false : true}
                        onPress={() => {
                          handleIconPress(infoUrls["unit"].isEmptyData);
                        }}
                      >
                        <Feather
                          name={"edit"}
                          size={22}
                          color={'black'}
                        />
                      </TouchableOpacity>
                    }
                  </View>
                }
              </Animated.View>
            </View>
            <View>
              <Animated.View
                style={[
                  styles.dataInput,
                  dataInputStyles(3),
                  styles.dataInputAreaContainer,
                ]}
              >
                {isEmptyData.isEmptyAreaData ?
                  <View style={styles.dataInputView}>
                    <TextInput
                      style={styles.dataInputWidth}
                      placeholder="Introduce un nombre de área"
                      value={area}
                      autoCapitalize="sentences"
                      autoCompleteType="off"
                      autoCorrect={true}
                      onChangeText={(text) => {
                        setArea(text);
                        verifyDataLength(
                          workerData,
                          text,
                          infoUrls["worker"].isEmptyData,
                          infoUrls["worker"].isDisabledEditIcon
                        );
                        verifyDataLength(
                          processData,
                          text,
                          infoUrls["process"].isEmptyData,
                          infoUrls["process"].isDisabledEditIcon
                        );
                      }}
                      onFocus={() => {handleFocus(3)}}
                      onBlur={() => {handleBlur(3)}}
                    />
                    {isDisabledEditIcon.isDisabledEditAreaIcon ?
                      null :
                      <TouchableOpacity
                        style={styles.editTextInputToggle}
                        onPress={() => {
                          handleIconPress(infoUrls["area"].isEmptyData);
                        }}
                      >
                        <Feather
                          name={"edit"}
                          size={22}
                          color={'black'}
                        />
                      </TouchableOpacity>
                    }
                  </View> :
                  <View style={styles.dataInputView}>
                    <Dropdown
                      style={
                        isDisabledEditIcon.isDisabledEditAreaIcon ? 
                          { width: '100%' } : 
                          styles.dataInputWidth
                      }
                      selectedTextStyle={{
                        fontSize: 14,
                        color: "black",
                      }}
                      placeholderStyle={{
                        fontSize: 14,
                        color: "#939393",
                      }}
                      selectedTextProps={{
                        numberOfLines: 1,
                        ellipsizeMode: 'tail',
                      }}
                      containerStyle={styles.containerDropDownMenu}
                      placeholder="Selecciona un área"
                      value={area}
                      data={areaData.filter(item => item.father === unit)}
                      search={true}
                      disable={unit ? false : true}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      searchPlaceholder="Buscar..."
                      renderRightIcon={() => (
                        <RenderRightIcon />
                      )}
                      renderInputSearch={(onSearch) => (
                        <RenderInputSearch onSearch={onSearch} />
                      )}
                      renderItem={(item, selected) => (
                        <RenderItem item={item} selected={selected} />
                      )}
                      onChange={(item) => {
                        setArea(item.value);
                        verifyDataLength(
                          workerData,
                          item.label,
                          infoUrls["worker"].isEmptyData,
                          infoUrls["worker"].isDisabledEditIcon
                        );
                        verifyDataLength(
                          processData,
                          item.label,
                          infoUrls["process"].isEmptyData,
                          infoUrls["process"].isDisabledEditIcon
                        );
                      }}
                      onFocus={() => {handleFocus(3)}}
                      onBlur={() => {handleBlur(3)}}
                    />
                    {isDisabledEditIcon.isDisabledEditAreaIcon ?
                      null :
                      <TouchableOpacity
                        style={styles.editDropDownToggle}
                        onPress={() => {
                          handleIconPress(infoUrls["area"].isEmptyData);
                        }}
                      >
                        <Feather
                          name={"edit"}
                          size={22}
                          color={'black'}
                        />
                      </TouchableOpacity>
                    }
                  </View>
                }
              </Animated.View>
            </View>
            <View>
              <Animated.View
                style={[
                  styles.dataInput,
                  dataInputStyles(4),
                  styles.dataInputProcessContainer,
                ]}
              >
                {isEmptyData.isEmptyProcessData ?
                  <View style={styles.dataInputView}>
                    <TextInput
                      style={styles.dataInputWidth}
                      placeholder="Introduce un nombre de proceso"
                      value={process}
                      autoCapitalize="sentences"
                      autoCompleteType="off"
                      autoCorrect={true}
                      onChangeText={(text) => {
                        setProcess(text);
                      }}
                      onFocus={() => {handleFocus(4)}}
                      onBlur={() => {handleBlur(4)}}
                    />
                    {isDisabledEditIcon.isDisabledEditProcessIcon ?
                      null :
                      <TouchableOpacity
                        style={styles.editTextInputToggle}
                        onPress={() => {
                          handleIconPress(infoUrls["process"].isEmptyData);
                        }}
                      >
                        <Feather
                          name={"edit"}
                          size={22}
                          color={'black'}
                        />
                      </TouchableOpacity>
                    }
                  </View> :
                  <View style={styles.dataInputView}>
                    <Dropdown
                      style={
                        isDisabledEditIcon.isDisabledEditProcessIcon ?
                          { width: '100%' } :
                          styles.dataInputWidth
                      }
                      selectedTextStyle={{
                        fontSize: 14,
                        color: "black",
                      }}
                      placeholderStyle={{
                        fontSize: 14,
                        color: "#939393",
                      }}
                      selectedTextProps={{
                        numberOfLines: 1,
                        ellipsizeMode: 'tail',
                      }}
                      containerStyle={styles.containerDropDownMenu}
                      placeholder="Selecciona un proceso"
                      value={process}
                      data={processData.filter(item => item.father === area)}
                      search={true}
                      disable={area ? false : true}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      searchPlaceholder="Buscar..."
                      renderRightIcon={() => (
                        <RenderRightIcon />
                      )}
                      renderInputSearch={(onSearch) => (
                        <RenderInputSearch onSearch={onSearch} />
                      )}
                      renderItem={(item, selected) => (
                        <RenderItem item={item} selected={selected} />
                      )}
                      onChange={(item) => {
                        setProcess(item.value);
                      }}
                      onFocus={() => {handleFocus(4)}}
                      onBlur={() => {handleBlur(4)}}
                    />
                    {isDisabledEditIcon.isDisabledEditProcessIcon ?
                      null :
                      <TouchableOpacity
                        style={styles.editDropDownToggle}
                        onPress={() => {
                          handleIconPress(infoUrls["process"].isEmptyData);
                        }}
                      >
                        <Feather
                          name={"edit"}
                          size={22}
                          color={'black'}
                        />
                      </TouchableOpacity>
                    }
                  </View>
                }
              </Animated.View>
            </View>
            <View>
              <Animated.View
                style={[
                  styles.dataInput,
                  dataInputStyles(5),
                  styles.dataInputWorkerContainer,
                ]}
              >
                {isEmptyData.isEmptyWorkerData ?
                  <View style={styles.dataInputView}>
                    <TextInput
                      style={styles.dataInputWidth}
                      placeholder="Introduce un nombre de trabajador"
                      value={worker}
                      autoCapitalize="sentences"
                      autoCompleteType="off"
                      autoCorrect={true}
                      onChangeText={(text) => {
                        setWorker(text);
                      }}
                      onFocus={() => {handleFocus(5)}}
                      onBlur={() => {handleBlur(5)}}
                    />
                    {isDisabledEditIcon.isDisabledEditWorkerIcon ?
                      null :
                      <TouchableOpacity
                        style={styles.editTextInputToggle}
                        onPress={() => {
                          handleIconPress(infoUrls["worker"].isEmptyData);
                        }}
                      >
                        <Feather
                          name={"edit"}
                          size={22}
                          color={'black'}
                        />
                      </TouchableOpacity>
                    }
                  </View> :
                  <View style={styles.dataInputView}>
                    <Dropdown
                      style={
                        isDisabledEditIcon.isDisabledEditWorkerIcon ?
                          { width: '100%' } :
                          styles.dataInputWidth
                      }
                      selectedTextStyle={{
                        fontSize: 14,
                        color: "black",
                      }}
                      placeholderStyle={{
                        fontSize: 14,
                        color: "#939393",
                      }}
                      selectedTextProps={{
                        numberOfLines: 1,
                        ellipsizeMode: 'tail',
                      }}
                      containerStyle={styles.containerDropDownMenu}
                      placeholder="Selecciona un trabajador"
                      value={worker}
                      data={workerData.filter(item => item.father === area)}
                      search={true}
                      disable={area ? false : true}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      searchPlaceholder="Buscar..."
                      renderRightIcon={() => (
                        <RenderRightIcon />
                      )}
                      renderInputSearch={(onSearch) => (
                        <RenderInputSearch onSearch={onSearch} />
                      )}
                      renderItem={(item, selected) => (
                        <RenderItem item={item} selected={selected} />
                      )}
                      onChange={(item) => {
                        setWorker(item.value);
                      }}
                      onFocus={() => {handleFocus(5)}}
                      onBlur={() => {handleBlur(5)}}
                    />
                    {isDisabledEditIcon.isDisabledEditWorkerIcon ?
                      null :
                      <TouchableOpacity
                        style={styles.editDropDownToggle}
                        onPress={() => {
                          handleIconPress(infoUrls["worker"].isEmptyData);
                        }}
                      >
                        <Feather
                          name={"edit"}
                          size={22}
                          color={'black'}
                        />
                      </TouchableOpacity>
                    }
                  </View>
                }
              </Animated.View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate("FormScreenDos", {
                dataParams: {
                  entity: entity, 
                  ueb: ueb, 
                  unit: unit, 
                  area: area, 
                  process: process, 
                  worker: worker
                }
              });
            }}
          >
            <Text style={styles.buttonText}>Siguiente</Text>
          </TouchableOpacity>
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => {
              setIsModalVisible(false);
            }}
          >
            <TouchableOpacity
              style={styles.modalInfoOut}
              activeOpacity={1}
              onPress={() => {
                setIsModalVisible(false);
              }}
            >
              <TouchableOpacity
                style={styles.modalInfo}
                activeOpacity={1}
              >
                <Text style={styles.modalInfoTextHeader}>{infoModal}</Text>
                <View style={styles.containerModalInfoButton}> 
                  <TouchableOpacity 
                    style={styles.modalInfoButton}
                    onPress={() => {
                      setIsModalVisible(false);
                    }}
                  >
                    <Text>Aceptar</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  eyeIcon: {
    fontSize: 48,
    marginVertical: 20,
    color: 'black',
  },
  chevronIcon: {
    marginLeft: 13,
  },
  titleHeader: {
    color: 'black',
    fontWeight: '500',
    marginBottom: 15,
  },
  dataInput: {
    marginBottom: 20,
  },
  dataInputEntityContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  dataInputUebContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 50,
  },
  dataInputUnitContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    maxHeight: 35,
  },
  dataInputAreaContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 150,
    maxHeight: 35,
  },
  dataInputProcessContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 200,
    maxHeight: 35,
  },
  dataInputWorkerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 250,
    maxHeight: 35,
  },
  dataInputContainer: {
    marginTop: 10,
    height: 300,
  },
  dataInputView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dataInputWidth: {
    width: '90%',
  },
  containerInputSearch: {
    paddingHorizontal: 10,
  },
  inputSearch: {
    marginVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#939393',
  },
  containerDropDownMenu: {
    overflow: 'hidden',
    marginVertical: 5,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  dataItem: {
    width: '90%',
  },
  containerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  editTextInputToggle: {
    
  },
  editDropDownToggle: {
    
  },
  button: {
    marginTop: 35,
    backgroundColor: '#3366FF',
    borderRadius: 7,
    paddingVertical: 13,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  modalInfoOut: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalInfo: {
    alignItems: 'center',
    backgroundColor: 'white',
    margin:20,
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  modalInfoTextHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  containerModalInfoButton: {
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 25,
  },
  modalInfoButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});