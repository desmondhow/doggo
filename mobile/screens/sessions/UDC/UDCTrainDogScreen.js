import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import { Text, Button } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';
import { Field } from 'redux-form';
import { container, formContainer, center } from '../../../constants/Styles';
import { connectReduxForm, renderDropdown, request } from '../../../components/helpers';
import { BuildingSearch } from '../../../constants/SessionsConstants';
import Colors from '../../../constants/Colors';
import API, { loadUserProfile } from '../../../constants/Api';
import {SAVE_UDC_DOG} from "../../../redux/actions/udc.actions";

export class UDCTrainDogScreen extends React.Component {
  constructor(props) {
    super(props);
    this._renderPage = this._renderPage.bind(this);

    this.state = {
      dog: { name: '', _id: -1, },
      dogs: [],
      trainers: [],
    };
  }

  componentDidMount() {
    loadUserProfile()
    .then(profile => this.setState({ dogs: profile.dogs, trainers: profile.trainers }))
    .catch(err => {
      console.log(err);
      throw err;
    });
  }

  _onSubmit = (initialInfo) => {
    this.props.saveDog(this.state.dog);
    const sessionInfo = this.props.navigation.getParam('sessionInfo', false);
    const sessionData = [...sessionInfo, ...initialInfo];
    // Dispatch action to store the current dog being trained in the state to be grabbed in the next'
    this.props.navigation.navigate('UDCBuildingSearch', {sessionInfo: sessionData});
  }

  _renderSubmitBtn = () => (
  <Button
      raised
      rounded
      title='Start Training'
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
    />
  )


  _renderPage = () => (
    <View style={center}>
      <View style={{
          marginTop: 30,
          flexDirection: 'row'
          }}>
          <View style={labelFieldContainerStyle}>
            <Text style={labelStyle}>K9 Name</Text>
            {renderDropdown(
              this.state.dog.name, 
              (_, i) => this.setState({ dog: this.state.dogs[i]}),
              this.state.dogs.map(dog => dog.name),
              dropdownStyle,
              dropdownFontSize,
            )}
          </View>
          <View style={labelFieldContainerStyle}>
            <Text style={labelStyle}>Trainer</Text>
            <Field name={`${this.state.dog._id}.trainer`} component={({input}) => (
              renderDropdown(
                input.value.name,
                (_, i) => input.onChange(this.state.trainers[i]),
                this.state.trainers.map(trainer => trainer.name),
                dropdownStyle,
                dropdownFontSize,
              )
            )}/>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={labelFieldContainerStyle}>
              <Text style={labelStyle}>Handler</Text>
              <Field 
                name={`${this.state.dog._id}.handler`} 
                component={this._renderTextInput}
              />  
          </View>
          <View style={labelFieldContainerStyle}>
              <Text style={labelStyle}>Recorder</Text>
              <Field 
                name={`${this.state.dog._id}.recorder`} 
                component={this._renderTextInput}
              />  
          </View>
        </View>
      {this._renderSubmitBtn()}
    </View>
  )

  render = () => (
    <View style={container}>
    <ScrollView style={formContainer} keyboardShouldPersistTaps={'handled'}>
      <View>
        <Text h2>Select Dog to Train in this UDC Session</Text>
        {this._renderPage()}
      </View>
    </ScrollView>
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
    height: '80%',
    width: '85%'
  },
  dropdown: {
    width: 150,
    height: 100,
    marginTop: -20
  },
  input: {
    height: 40,
    width: 100,
  },
});

export default connectReduxForm(
    'udc',
    UDCTrainDogScreen,
    null,
    dispatch => ({
        saveDog: dogInfo =>
          dispatch({ type: SAVE_UDC_DOG, dog: dogInfo })
      })
  )