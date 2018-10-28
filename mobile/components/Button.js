import React from 'react';
import { center } from '../constants/Styles';
import {
  Text,
  TouchableOpacity,
} from 'react-native';

export default Button = ({text, onPress, buttonStyle, textStyle}) => {
  return (
    <TouchableOpacity style={[center, buttonStyle]} onPress={onPress}>
      <Text style={textStyle}>{text}</Text>
    </TouchableOpacity>
  );
}