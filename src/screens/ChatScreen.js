import React from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import {TopNav,Ionicons,themeColor,useTheme,Layout}from 'react-native-rapi-ui';
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from '../components/utils/MessageStyles';

const Messages = [
  {
    id: '1',
    userName: 'Dalila ',
    userImg: require('../../assets/users/user-3.jpg'),
    messageTime: '4 mins ago',
    messageText:
      'Hola , que tal va el desarrollo ?.',
  },
  {
    id: '2',
    userName: 'Carlos Ramon ',
    userImg: require('../../assets/users/user-1.jpg'),
    messageTime: '2 hours ago',
    messageText:
      'Aqui tienes la info que me pediste de la autenticacion ',
  },
  {
    id: '3',
    userName: 'Fernando Picallo',
    userImg: require('../../assets/users/user-4.jpg'),
    messageTime: '1 hours ago',
    messageText:
      'Preguntale por el modulo de insertar',
  },
  {
    id: '4',
    userName: 'Amanda ',
    userImg: require('../../assets/users/user-6.jpg'),
    messageTime: '1 day ago',
    messageText:
      'por favor chequea el email.',
  },
  {
    id: '5',
    userName: 'Claudia',
    userImg: require('../../assets/users/user-7.jpg'),
    messageTime: '2 days ago',
    messageText:
      'La reunion es a las 10 am .',
  },
];

const MessagesScreen = ({navigation}) => {
	const { isDarkmode } = useTheme();
    return (
		
      <Container>
	    <TopNav
	        middleContent="Chat"
	        
	        leftAction={() => navigation.goBack()}
	    />

        <FlatList 
          data={Messages}
          keyExtractor={item=>item.id}
          renderItem={({item}) => (
            <Card onPress={() => navigation.navigate('ChatDos', {userName: item.userName})}>
              <UserInfo>
                <UserImgWrapper>
                  <UserImg source={item.userImg} />
                </UserImgWrapper>
                <TextSection>
                  <UserInfoText>
                    <UserName>{item.userName}</UserName>
                    <PostTime>{item.messageTime}</PostTime>
                  </UserInfoText>
                  <MessageText>{item.messageText}</MessageText>
                </TextSection>
              </UserInfo>
            </Card>
          )}
        />
      </Container>
      
    );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});
