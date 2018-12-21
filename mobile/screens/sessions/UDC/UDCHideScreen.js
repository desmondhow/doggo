import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import { Text, Icon, Button } from 'react-native-elements';
import { reduxForm } from 'redux-form'

import { connect } from 'react-redux';
import Colors from '../../../constants/Colors';
import { center, container, formContainer, fieldsContainer } from '../../../constants/Styles';
import * as actions from '../../../redux/actions/index.actions';

class UDCHidesScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  _renderForm = () => 
    <ScrollView style={fieldsContainer} keyboardShouldPersistTaps={'handled'}>
    {
      
    }
    </ScrollView>

  _onSubmit = () => 
    this.props.navigation.navigate('Dogs');

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
        type="font-awesome"
        size={10}
      />
    </Button>

  render = () => 
    <View style={container}>
      <View style={formContainer}>
        <Text>Hides</Text>
        {/* <Form>
          {this._renderForm()}
        </Form> */}
        {this._renderSubmitBtn()}
      </View>
    </View>
}

const form = reduxForm({
  // a unique name for the form
  form: 'udc.hides'
})(UDCHidesScreen)

export default connect(
  state => ({
    initialValues: state.udc.data
  }), 
  dispatch => ({
    getInitialData: () => dispatch({ type: 'GET_INITIAL_STATE' })
  })
)(form)

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
