import styled from 'styled-components';

export const Container = styled.View`
  flex: 1;
  padding-left: 20px;
  padding-right: 20px;
  align-items: center;
  background-color: #ffffff;
`;

export const Card = styled.TouchableOpacity`
  width: 100%;
`;

export const ObservacionInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const TextSection = styled.View`
  flex-direction: column;
  justify-content: center;
  padding: 15px;
  padding-left: 0;
  margin-left: 10px;
  width: 300px;
  border-bottom-width: 1px;
  border-bottom-color: #cccccc;
`;

export const ObservationInfoText = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
`;

export const ObservationName = styled.Text`
  font-size: 14px;
  font-weight: bold;
  
`;

export const DateTime = styled.Text`
  font-size: 12px;
  color: #666;
  
`;

export const ObservationText = styled.Text`
  font-size: 14px;
  color: #333333;
`;