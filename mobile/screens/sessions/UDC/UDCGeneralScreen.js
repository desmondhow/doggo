import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Picker
} from 'react-native';
import { Text } from 'react-native-elements';
import { Field, reduxForm } from 'redux-form'
import ModalDropdown from 'react-native-modal-dropdown';
import { Icon } from 'native-base';

import { center, buttonStyle } from '../../../constants/Styles';
import Colors from '../../../constants/Colors';
import { Locations, GeneralInfo } from '../../../constants/sessions/UDC';

class InputComponent extends React.Component {
  render() {
    const { value, onChange } = this.props
    return (
      <Text>Dsdfsf</Text>
    )
  }
}

class UDCGeneralScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  _getLocationDropdown() {
    locations = [...Object.values(Locations)]

    return (
      <ModalDropdown 
        style={{
          ...buttonStyle,
          width: 220,
          marginLeft: 15
        }}
        dropdownStyle={{
          width: 220,
          ...buttonStyle,
          height: 130
        }}
        dropdownTextStyle={{
          ...center,
          fontSize: 15,
          width: 220,
          textAlign: 'center',

        }}
        options={locations}
      >
        <View style={{ ...center, flexDirection: 'row' }}>
          <Text style={{fontSize: 19, marginTop: 3}}>Choose a location...</Text>
          <Icon
            name='sort-down'
            type="FontAwesome"
            size={10}
            color='white'
            style={{ marginLeft: 10, marginBottom: 10 }}
          />
        </View>
      </ModalDropdown>
    );
  }

  _getFields() {
    return (
      <ScrollView style={styles.fieldsContainer} keyboardShouldPersistTaps={'handled'}>
        <Field name={GeneralInfo.Location} component={(props) => (
          <View style={{
            flexDirection: 'row',
            marginLeft: 30,
            marginTop: 30
          }}>
            <Text h4 style={{ marginTop: 5 }}>{GeneralInfo.Location}:</Text>
            {this._getLocationDropdown()}
          </View>
        )}/>
        <Field name={GeneralInfo.Temperature} component={(props) => (
          <View style={{
            flexDirection: 'row',
            marginLeft: 30,
            marginTop: 30
          }}>
            <Text h4 style={{ marginTop: 5 }}>{GeneralInfo.Temperature}:</Text>
            <TextInput 
              style={{width: 100, height: 100}}
              keyboardType = 'numeric'
              // onChangeText = {(text)=> this.onChanged(text)}
              value = '34'
            /> 
          </View>
        )}/>
      </ScrollView>
    );
  }

  render() {
    const { handleSubmit } = this.props
    const fields = this._getFields();

    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text h2>General</Text>
          {fields}
        </View>
      </View>
    );
  }
}

export default reduxForm({
  // a unique name for the form
  form: 'udc.general'
})(UDCGeneralScreen)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  formContainer: {
    marginLeft: 30,
    marginTop: 50
  },
  fieldsContainer: {
    marginLeft: 60,
    marginTop: 50,
    borderColor: Colors.darkGrey,
    borderRadius: 10,
    borderWidth: 15,
    height: '80%',
    width: '80%'
  }
});
