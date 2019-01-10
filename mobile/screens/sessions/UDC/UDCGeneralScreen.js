import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView
} from 'react-native';
import { Text, Icon, Button } from 'react-native-elements';

import { container, formContainer, center, buttonStyle, buttonTextStyle} from '../../../constants/Styles';
import { connectReduxForm, renderReduxDropdown } from '../../../components/helpers';
import { GeneralInfo } from '../../../constants/SessionsConstants';
import Colors from '../../../constants/Colors';
import * as actions from '../../../redux/actions/index.actions';

class UDCGeneralScreen extends React.Component {
  constructor(props) {
    super(props);
    this._renderForm = this._renderForm.bind(this);
    this.props.getInitialState();
  }

  _onSubmit = () => {
    this.props.navigation.navigate('UDC.Hides');
  }

  _renderNextBtn = () => (
  <Button 
      raised
      rounded
      title='Next'
      onPress={this.props.handleSubmit(this._onSubmit)} 
      fontSize={26}
      buttonStyle={{
        ...center,
        ...buttonStyle,
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

  _renderField = (name, dropdownOptions) => (
    <View style={styles.field} key={name}>
      <Text h4 containerStyle={{ marginTop: 5 }}>{name}:</Text>
      {renderReduxDropdown(
        name, 
        dropdownOptions, 
        { width: 200, height: 100 }, 
        null, 
        null, 
        20
      )}
    </View>
  );

  _renderForm = () => (
    <View style={center}>
      <ScrollView style={styles.fieldsContainer} keyboardShouldPersistTaps={'handled'}>
        {Object.keys(GeneralInfo).map(fieldName => 
          this._renderField(fieldName, GeneralInfo[fieldName])
        )}
      </ScrollView>
      {this._renderNextBtn()}
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

export default connectReduxForm(
  'udc',
  UDCGeneralScreen,
  state => ({
    initialValues: state.udc.initial
  }), 
  dispatch => ({
    getInitialState: () => dispatch({ type: actions.GET_UDC_GENERAL_INITIAL_STATE })
  })
)
