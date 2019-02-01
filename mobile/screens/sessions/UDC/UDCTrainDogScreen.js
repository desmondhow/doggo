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
import * as actions from '../../../redux/actions/index.actions';
import Api from '../../../constants/Api';

export class UDCTrainDogScreen extends React.Component {
  constructor(props) {
    super(props);
    this._renderPage = this._renderPage.bind(this);
  }

  componentDidMount() {
    this._loadProfile();
  }

  _loadProfile = () => {
    Api.profileApiURL
    .then(url => (
      request(url, null, 'GET')
    ))
  }



  _onSubmit = (dogInfo) => {
    temp = {
        name: dogInfo.dog,
        id: 0
    }
    this.props.saveDog(temp);
    // Dispatch action to store the current dog being trained in the state to be grabbed in the next'
    this.props.navigation.navigate('UDCBuildingSearch');
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
      <View>
        <Text>K9 Name</Text>
        {/* UDC[BuildingSearch.TempSessions[0].sessionId].dogs.dogId */}
        {/* this might have to be its own page: need to find a way to save this K9 name to the state so that it can pass to the redux fields or whatever */}
        <Field name={`dog`} component={(inputProps) => {
            const { input: { value, onChange } } = inputProps;
            return (
            <Dropdown 
                overlayStyle={{marginTop: 95}}
                containerStyle={{ width: 200, height: 100 }}
                value={value}
                data={BuildingSearch.TempDogs} 
                onChangeText={onChange}
            />
            )
        }}/>
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
          dispatch({ type: actions.SAVE_UDC_DOG, dog: dogInfo })
      })
  )