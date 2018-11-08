import React from 'react';
import {
  Text,
  TouchableOpacity,
} from 'react-native';

export default Button = ({text, onPress, buttonStyle, textStyle}) => {
  return (
    <TouchableOpacity style={[buttonStyle]} onPress={onPress}>
      <Text style={textStyle}>{text}</Text>
    </TouchableOpacity>
  );
}