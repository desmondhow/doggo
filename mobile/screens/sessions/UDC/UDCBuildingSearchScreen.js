import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Text, Icon, Button, ButtonGroup } from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';
import { Field } from 'redux-form';
import { Dropdown } from 'react-native-material-dropdown';

import { container, formContainer, center, buttonStyle } from '../../../constants/Styles';
import { connectReduxForm, renderDropdown, renderReduxDropdown } from '../../../components/helpers';
import { BuildingSearchInfo } from '../../../constants/SessionsConstants';
import Colors from '../../../constants/Colors';
import * as actions from '../../../redux/actions/index.actions';
import CheckboxContainer from '../../../components/CheckboxContainer';

export class UDCBuildingSearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this._renderPage = this._renderPage.bind(this);

    const sessionInfo = this.props.navigation.getParam('sessionInfo', false);
    console.log('UDCBUILDING SEARCH!!', sessionInfo);

    let barkStates = {};
    
    if (sessionInfo) {
      sessionInfo.hides.forEach(hide => {
        barkStates[hide.concentration] = {
          ...barkStates[hide.concentration],
          [hide.size]: {
            barks: 0,
          }
        }
      })

      this.state = {
        activeSections: [],
        barks: '0',
        dog: {
          name: '',
          id: 0,
        },
        hides: sessionInfo.hides,
        sessionId: sessionInfo._id,
        createdAt: sessionInfo.createdAt,
        barkStates: barkStates,
      }
    }

  }

  _onSubmit = (performanceInfo) => {
    console.log(performanceInfo)
    const dataToSave = {
      // dogId: this.state.dogId,
      sessionId: this.state.sessionId,
      handler: performanceInfo.Handler,
      recorder: performanceInfo.Recorder,
      ...performanceInfo.Performance
    }
    this.props.saveDogTraining(dataToSave);
    this.props.navigation.navigate('UDC');
  }

  checkNumber = (text, section) => {
    const hideId = section._id

    let barks = text.replace(/[^0-9]/g, '');
    newState = {
      ...this.state.barkStates
    }
    newState[hideId][barks] = barks;
    this.setState({
        barkStates: newState,
    });
}

  _renderSubmitBtn = () => (
    <Button
      raised
      rounded
      title='Finish Training'
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

  _renderHeader = section => {
    return (
      <View style={styles.hideContainer}>
        <Text h4>
        {
          `${section.location ? `${section.location}` : ''}` + 
          `${section.placementArea ? `, ${section.placementArea}` : ''}` + 
          `${section.placementHeight ? `, ${section.placementHeight} ` : ''}`
        }
        </Text>
      </View>
    );
  };

  _renderContent = section => {
    const buttonGroupContainerStyle = { height: 50 }
    const scrollViewContainerStyle = { height: 300 }
    const yesNoButtons = ['No', 'Yes']

    const concentration = section.concentration.toString().concat('#');
    const size = section.size.toString().replace('.', '#')  

    return (
      <View style={{
        marginTop: 20,
        marginLeft: 70
      }}>
        <Text h4>Handler Radius - Alert</Text>
        <View>
            <Field name={`Performance.${section._id}.radiusAlert`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <ButtonGroup
                  onPress={onChange}
                  selectedIndex={value}
                  buttons={BuildingSearchInfo.HandlerRadius}
                  containerStyle={buttonGroupContainerStyle}
                />
              )}}
            />
        </View>
        <Text h4>Handler Radius - Reward</Text>
        <View>
            <Field name={`Performance.${section._id}.radiusReward`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <ButtonGroup
                  onPress={onChange}
                  selectedIndex={value}
                  buttons={BuildingSearchInfo.HandlerRadius}
                  containerStyle={buttonGroupContainerStyle}
                />
              )}}
            />
        </View>
        <Text h4>Handler Radius - Search</Text>
        <View>
            <Field name={`Performance.${section._id}.radiusSearch`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <ButtonGroup
                  onPress={onChange}
                  selectedIndex={value}
                  buttons={BuildingSearchInfo.HandlerRadius}
                  containerStyle={buttonGroupContainerStyle}
                />
              )}}
            />
        </View>
        {/* need to show actual string of the things instead of "selectedIndex" being returned */}
        <Text h4>Rewarder</Text>
        <View>
            <Field name={`Performance.${section._id}.rewarder`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <ButtonGroup
                  onPress={onChange}
                  selectedIndex={value}
                  buttons={['Handler', 'Trainer']}
                  containerStyle={buttonGroupContainerStyle}
                />
              )}}
            />
        </View>
        <Text h4>Barks</Text>
        <View>
          <Field name={`Performance.${section._id}.barks`} component={_ => 
            <TextInput 
              style={styles.input}
              keyboardType='numeric'
              onChangeText={(text)=> this.checkNumber(text)}
              value={this.state.barks}
              maxLength={3}  //setting limit of input
            />
          }
          />
        </View>
        <Text h4>Handler Knows</Text>
        <View>
            <Field name={`Performance.${section._id}.handlerKnows`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <ButtonGroup
                  onPress={onChange}
                  selectedIndex={value}
                  buttons={yesNoButtons}
                  containerStyle={buttonGroupContainerStyle}
                />
              )}}
            />
        </View>
        <Text h4>Fringe</Text>
        <View>
            <Field name={`Performance.${section._id}.fringe`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <ButtonGroup
                  onPress={onChange}
                  selectedIndex={value}
                  buttons={yesNoButtons}
                  containerStyle={buttonGroupContainerStyle}
                />
              )}}
            />
        </View>
        <Text h4>Reset</Text>
        <View>
            <Field name={`Performance.${section._id}.reset`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <ButtonGroup
                  onPress={onChange}
                  selectedIndex={value}
                  buttons={yesNoButtons}
                  containerStyle={buttonGroupContainerStyle}
                />
              )}}
            />
        </View>
        <Text h4>False Alert</Text>
        <View>
            <Field name={`Performance.${section._id}.falseAlert`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <ButtonGroup
                  onPress={onChange}
                  selectedIndex={value}
                  buttons={yesNoButtons}
                  containerStyle={buttonGroupContainerStyle}
                />
              )}}
            />
        </View>
        <Text h4>On Lead</Text>
        <View>
            <Field name={`Performance.${section._id}.lead`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <ButtonGroup
                  onPress={onChange}
                  selectedIndex={value}
                  buttons={yesNoButtons}
                  containerStyle={buttonGroupContainerStyle}
                />
              )}}
            />
        </View>
        <Text h4>False Indication</Text>
        <View>
            <Field name={`Performance.${section._id}.falseIndication`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <ButtonGroup
                  onPress={onChange}
                  selectedIndex={value}
                  buttons={yesNoButtons}
                  containerStyle={buttonGroupContainerStyle}
                />
              )}}
            />
        </View>
        <Text h4>Detail Search</Text>
        <View>
            <Field name={`Performance.${section._id}.detailSearch`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <ButtonGroup
                  onPress={onChange}
                  selectedIndex={value}
                  buttons={yesNoButtons}
                  containerStyle={buttonGroupContainerStyle}
                />
              )}}
            />
        </View>
        <Text h4>Successful</Text>
        <View>
            <Field name={`Performance.${section._id}.successful`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <ButtonGroup
                  onPress={onChange}
                  selectedIndex={value}
                  buttons={yesNoButtons}
                  containerStyle={buttonGroupContainerStyle}
                />
              )}}
            />
        </View>
        <View>
          <Text h4>Failure Codes</Text>
          <ScrollView style={scrollViewContainerStyle}>
            <Field name={`Performance.${section._id}.failCodes`} component={_ => 
              // what to do with the selectedIndex={value} thing for these checkboxes to get actual values
              <CheckboxContainer name='FailCodes' checkboxes={BuildingSearchInfo.FailCodes}/>
              }
            /> 
          </ScrollView>
        </View>
        <View>
          <Text h4>Distractions</Text>
          <ScrollView style={scrollViewContainerStyle}>
            <Field name={`Performance.${section._id}.distractions`} component={_ => 
              // what to do with the selectedIndex={value} thing for these checkboxes to get actual values
                <CheckboxContainer name='Distractions' checkboxes={BuildingSearchInfo.Distractions}/>
              }
            /> 
          </ScrollView>     
        </View>
      </View>
    );
  };

  setSections = sections => {
    this.setState({
      activeSections: sections.includes(undefined) ? [] : sections,
    });
  };

  _renderPage =   () => {
    const containerStyle = { flexDirection: 'column', width: '30%', ...center }

    return (
      <View style={{
        marginTop: 50,
        backgroundColor: 'white',
        alignItems: 'center'
      }}>
        <View style={{
          marginTop: 30,
          flexDirection: 'row'
          }}>
          <View style={containerStyle}>
            <Text style={styles.labelStyle}>K9 Name</Text>
            {renderDropdown(
              this.state.dog.name, 
              (dogName) => this.setState({ dog: { name: dogName }}),
              BuildingSearchInfo.TempDogs,
              { width: 200, height: 100 },
              16
            )}
          </View>
          <View style={containerStyle}>
              <Text style={styles.labelStyle}>Handler</Text>
              {renderReduxDropdown(`Handler`, BuildingSearchInfo.TempTrainers, { width: 200, height: 100 })}
          </View>
          <View style={containerStyle}>
              <Text style={styles.labelStyle}>Recorder</Text>
              {renderReduxDropdown(`Recorder`, BuildingSearchInfo.TempTrainers, { width: 200, height: 100 })}
          </View>
        </View>
        <View style={{height: '75%'}}>
          <Text h3>Searches</Text>
          <ScrollView>
            <Accordion
              activeSections={this.state.activeSections}
              sections={this.state.hides}
              touchableComponent={TouchableOpacity}
              renderHeader={this._renderHeader}
              renderContent={this._renderContent}
              onChange={this.setSections}
              expandMultiple={false}
              containerStyle={{height: '100%'}}
            />
          </ScrollView>
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
    paddingRight: 65
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
  },
  labelStyle: {
    fontWeight: 'bold',
    fontSize: 18
  }
});

export default connectReduxForm(
    'udc',
    UDCBuildingSearchScreen,
    state => ({
        dog: state.udc.dog
    }),
    dispatch => ({
        saveDogTraining: performanceInfo =>
          dispatch({ type: actions.SAVE_UDC_DOG_TRAINING, performanceInfo })
      })
  )