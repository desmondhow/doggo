import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView
} from 'react-native';
import { Text, Icon, Button } from 'react-native-elements';
import { Field } from 'redux-form';
import { Dropdown } from 'react-native-material-dropdown';

import { container, fieldsContainer, formContainer, center } from '../../../constants/Styles';
import { connectReduxForm } from '../../../components/helpers';
import { GeneralInfo } from '../../../constants/sessions/UDCConstants';
import Colors from '../../../constants/Colors';
import * as actions from '../../../redux/actions/index.actions';

class UDCGeneralScreen extends React.Component {
  constructor(props) {
    super(props);
    this._renderForm = this._renderForm.bind(this);
    this.props.getInitialState();
  }

  _onSubmit = () => {
    this.props.navigation.navigate('Hides');
  }

  _renderSubmitBtn = () => (
  <Button 
      raised
      rounded
      title='Next'
      onPress={this.props.handleSubmit(this._onSubmit)} 
      fontSize={26}
      buttonStyle={{
        ...center,
        marginLeft: 60, 
        marginTop: 20, 
        width: 300
      }}
      titleStyle={{
        fontSize: 20, 
        fontWeight: 'bold'
      }}
      rightIcon={{
        name: 'arrow-right',
        type: "font-awesome",
        size: 20
      }}
    />
  )

  _renderForm = () => (
    <View style={center}>
      <ScrollView style={styles.fieldsContainer} keyboardShouldPersistTaps={'handled'}>
        {Object.keys(GeneralInfo).map(fieldName => 
          renderField(fieldName, GeneralInfo[fieldName])
        )}
      </ScrollView>
      {this._renderSubmitBtn()}
    </View>

  )

  render = () => (
    <View style={container}>
      <View style={formContainer}>
        <Text h2>General</Text>
        {this._renderForm()}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  field: {
    marginTop: 30,
    height: 100, 
    flexDirection: 'column',
    paddingLeft: 65,
    paddingRight: 65
  },
  fieldsContainer: {
    marginLeft: 60,
    marginTop: 50,
    borderColor: Colors.darkGrey,
    borderRadius: 10,
    borderWidth: 8,
    height: '70%',
  }
});

const renderField = (name, dropdownOptions) => (
  <View style={styles.field} key={name}>
    <Text h4 containerStyle={{ marginTop: 5 }}>{name}:</Text>
    <Field name={name} component={(inputProps) => _renderDropdown(dropdownOptions, inputProps)}/>
  </View>
);

const _renderDropdown = (options, inputProps) => {
  const { input: { value, onChange } } = inputProps;
  return (
    <Dropdown 
      overlayStyle={{marginTop: 95}}
      containerStyle={{width: 200, height: 100}}
      value={value}
      data={options.map(option => ({ value: option }))} 
      onChangeText={onChange}
    />
  );
}

export default connectReduxForm(
  'udc.general',
  UDCGeneralScreen,
  state => ({
    initialValues: state.udc.data
  }), 
  dispatch => ({
    getInitialState: () => dispatch({ type: actions.GET_UDC_GENERAL_INITIAL_STATE })
  })
)
