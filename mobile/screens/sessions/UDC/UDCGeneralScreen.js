import React from 'react';
import {
  View,
  ScrollView,
} from 'react-native';
import { Icon, Button, Form } from 'native-base';
import { Text } from 'react-native-elements';

import { container, formContainer, fieldsContainer, center } from '../../../constants/Styles';
import { renderField, renderSubmitBtn, connectReduxForm } from '../../../components/helpers';
import { GeneralInfo } from '../../../constants/sessions/UDC';
import * as actions from '../../../redux/actions/index.actions';

class UDCGeneralScreen extends React.Component {
  constructor(props) {
    super(props);
    this._renderForm = this._renderForm.bind(this);
    this.props.getInitialState();
  }

  _renderForm = () => 
    <ScrollView style={fieldsContainer} keyboardShouldPersistTaps={'handled'}>
    {
      Object.keys(GeneralInfo).map(inputType => (
        Object.keys(GeneralInfo[inputType]).map(property => (
          renderField(
            property, 
            inputType, 
            inputType == 'dropdown' ? 
              Object.values(GeneralInfo[inputType][property]) :
              []
            )
        ))
      ))
    }
    </ScrollView>

  _onSubmit = () => 
    this.props.navigation.navigate('Hides');


  _renderSubmitBtn = () => 
    <Button light onPress={this.props.handleSubmit(this._onSubmit)} style={{
      ...center,
      marginLeft: 60, 
      marginTop: 20, 
      width: '80%',     
    }}>
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>Next</Text>
      <Icon
        name='arrow-circle-right'
        type="FontAwesome"
        size={10}
      />
    </Button>
  
  render = () => 
    <View style={container}>
      <View style={formContainer}>
        <Text h2>General</Text>
        <Form>
          {this._renderForm()}
        </Form>
        {this._renderSubmitBtn(this.props.handleSubmit, () => {
          this.props.navigation.navigate('Hides');
        })}
      </View>
    </View>
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
