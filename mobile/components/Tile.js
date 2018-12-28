import React from 'react';
import Colors from '../constants/Colors';
import { center } from '../constants/Styles';
import { Button } from 'react-native-elements';
import {
  StyleSheet,
} from 'react-native';

export default Tile = ({text, onPress}) => {
  return (
    <Button
      title={text}
      buttonStyle={styles.tile}
      titleStyle={styles.text}
      onPress={onPress}
      color='black'
    />
  );
}

const styles = StyleSheet.create({
  tile: {
    ...center,
    backgroundColor: Colors.tileColor,
    margin: 30,
    width: 110,
    height: 100,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  text: {
    fontSize: 20
  }
})