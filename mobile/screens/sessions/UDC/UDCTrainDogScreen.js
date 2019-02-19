import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SectionList
} from 'react-native';
import { Text, Icon, Button, ButtonGroup, FormInput } from 'react-native-elements';
import Collapsible from 'react-native-collapsible/Collapsible';
import { Field, formValueSelector } from 'redux-form';

import { container, center, buttonStyle, outlineButtonTextStyle, buttonTextStyle, outlineButtonStyle, formContainer } from '../../../constants/Styles';
import { connectReduxForm, renderDropdown, renderReduxFormInput, renderReduxDropdown} from '../../../components/helpers';
import { BuildingSearch, UDCInfo } from '../../../constants/SessionsConstants';
import API from '../../../constants/Api';
import Colors from '../../../constants/Colors';
import {SAVE_UDC_DOG} from "../../../redux/actions/udc.actions";

export class UDCTrainDogScreen extends React.Component {
  constructor(props) {
    super(props);
    // this._renderPage = this._renderPage.bind(this);

    this.state = {
      dog: { name: '', _id: -1 },
      dogs: [],
      handlers: [],
    };
  }

    componentDidMount() {
        this.setState(
            {
                handlers: this.props.handlers,
                dogs: this.props.dogs
            },
        );

    }


  _onSubmit = () => {
    this.props.saveDog(this.state.dog);
    const sessionInfo = this.props.navigation.getParam('sessionInfo', false);
    this.props.navigation.navigate('UDCBuildingSearch', { sessionInfo: sessionInfo });
  };



  _renderSubmitBtn = () => (
    <Button
      raised
      rounded
      title='Start Training'
      onPress={this.props.handleSubmit(this._onSubmit)} 
      fontSize={26}
      buttonStyle={{
        ...center,
        ...buttonStyle,
        marginTop: 20, 
      }}
      titleStyle={{
        fontSize: 20, 
        fontWeight: 'bold'
      }}
    />
  )
  
  _renderPage = () => {
    const labelFieldContainerStyle = { flexDirection: 'column', width: '40%', ...center }
    const dropdownStyle = { width: '60%', height: 100, marginTop: -30 };
    const dropdownFontSize = 16;
    const labelStyle = { fontWeight: 'bold', fontSize: 16 };
    const buttonGroupContainerStyle = { height: 50 }
    const yesNoButtons = ['No', 'Yes'];

    return (
      <View style={{
        marginTop: 30,
        backgroundColor: 'white',
        alignItems: 'center',
        width: '70%',
        height: '89%',
        paddingTop: 50,
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
        {/* <View style={labelFieldContainerStyle}>
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
        </View> */}
        <View style={labelFieldContainerStyle}>
            <Text style={labelStyle}>Handler</Text>
            {renderReduxDropdown(
              `${this.state.dog._id}.handler`, 
              this.state.handlers.map(handler => handler.name), 
              dropdownStyle,
              null,
              null,
              dropdownFontSize
            )}
            
        </View>
        <View style={{ paddingTop: 30, ...labelFieldContainerStyle }}>
            <Text style={labelStyle}>Recorder</Text>
            {renderReduxFormInput(
              `${this.state.dog._id}.recorder`, 
              { 
                containerStyle: { width: '60%', marginTop: 10 
              }
            })}
        </View>
        <View style={{ paddingTop: 30, ...labelFieldContainerStyle }}>
            <Text style={labelStyle}>Handler Knows</Text>
            <Field
              name={`${this.state.dog._id}.handlerKnows`}
              component={inputProps => {
                const { input: { value, onChange } } = inputProps;
                return (
                  <ButtonGroup
                    onPress={i => onChange({ i: i, text: yesNoButtons[i] })}
                    selectedIndex={value.i}
                    buttons={yesNoButtons}
                    containerStyle={buttonGroupContainerStyle}
                  />
                );
              }}
            />
        </View>
        <View style={{paddingTop: 30, ...labelFieldContainerStyle}}>
            <Text style={labelStyle}>On Lead</Text>
            <Field
              name={`${this.state.dog._id}.onLead`}
              component={inputProps => {
                const { input: { value, onChange } } = inputProps;
                return (
                  <ButtonGroup
                    onPress={i => onChange({ i: i, text: yesNoButtons[i] })}
                    selectedIndex={value.i}
                    buttons={yesNoButtons}
                    containerStyle={buttonGroupContainerStyle}
                  />
                );
              }}
            />
        </View>
      </View>
    )
  }

  render = () => (
    <View style={container}>
      {this._renderPage()}
      {this._renderSubmitBtn()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },  
  hideContainer: {
    flexDirection: 'column',
    paddingLeft: 65,
    paddingRight: 65,
    ...center
  },
  fieldsContainer: {
    borderColor: Colors.darkGrey,
    borderRadius: 10,
    borderWidth: 8,
  },
  dropdown: {
    width: 150,
    height: 100,
    marginTop: -20
  },
  input: {
    height: 40,
    width: 100,
  }
});

export default connectReduxForm(
    'udc',
    UDCTrainDogScreen,
    state => ({
        dogs: state.general.dogs,
        handlers: state.general.handlers,
    }),
    dispatch => ({
        saveDog: dogInfo =>
            dispatch({ type: SAVE_UDC_DOG, dog: dogInfo })
    })
)