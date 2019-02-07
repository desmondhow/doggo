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

import { container, center, buttonStyle, outlineButtonTextStyle, buttonTextStyle, outlineButtonStyle } from '../../../constants/Styles';
import { connectReduxForm, renderDropdown, renderReduxDropdown, renderTextInput, request } from '../../../components/helpers';
import { UDCInfo } from '../../../constants/SessionsConstants';
import API, { loadUserProfile } from '../../../constants/Api';
import Colors from '../../../constants/Colors';
import CheckboxContainer from '../../../components/CheckboxContainer';

export class UDCBuildingSearchScreen extends React.Component {
  constructor(props) {
    super(props);
    const sessionInfo = this.props.navigation.getParam('sessionInfo', false);
    if (sessionInfo) {
      const hideSections = [];
      sessionInfo.hides.forEach(hide => 
        hideSections.push({
          title: this._renderSectionTitle(hide),
          data: [hide]
        })
      );
      this.state = {
        activeSection: '',
        dog: this.props.dog,
        dogs: [],
        trainers: [],
        hides: hideSections,
        sessionId: sessionInfo._id,
        createdAt: sessionInfo.createdAt,
        stopwatchTime: { seconds: 0, minutes: 0, hours: 0 },
        interval: null,
      };
    }

  }

  componentDidMount() {
    loadUserProfile()
    .then(profile => this.setState({ dogs: profile.dogs, trainers: profile.trainers }))
    .catch(err => {
      console.log(err);
      throw err;
    });
  }

  _onSubmit = (sessionInfo) => {
    console.log(JSON.stringify(sessionInfo))
    API.UDCTrainURL
    .then(url => {
      // only send the part of the object that we care about
      Object.keys(sessionInfo).forEach(dogId => {
        if (!!sessionInfo[dogId]['trainer']['_id']) {
          sessionInfo[dogId]['trainerId'] = sessionInfo[dogId]['trainer']['_id'];
        }
        Object.keys(sessionInfo[dogId]['performance']).forEach(hideId => {
          Object.keys(sessionInfo[dogId]['performance'][hideId]).forEach(field => {
            const hideInfo = sessionInfo[dogId]['performance'][hideId];
            // need to figure out how to format fields since we have each field in the udc schema
            // as its separate thing, also need to figure out how to send duration
            if (field === 'fields') {
              hideInfo[field].forEach(f => {

                }
              )
            } else if (typeof hideInfo[field] === 'object') {
              if (!!hideInfo[field]['text']) {
                sessionInfo[dogId]['performance'][hideId][field] = hideInfo[field]['text'];
              }
            }
          })
        });
      })
      console.log(sessionInfo)
      return request(url, JSON.stringify({ sessionId: this.state.sessionId, sessionInfo: sessionInfo }), 'POST')
    })
    .then(this.props.navigation.navigate('UDC'))
    .catch(err => {
      console.log(err);
      throw err;
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

  _renderSectionTitle = section => (
    `${section.location ? `${section.location}` : ''}` + 
    `${section.placementArea ? `, ${section.placementArea}` : ''}` + 
    `${section.placementHeight ? `, ${section.placementHeight} ` : ''}`
  );

  _renderLabeledButtonGroup = (
    label,
    fieldName,
    buttons,
    containerStyle
  ) => (
    <View style={{flexDirection:'column'}} >
      <Text h4>{label}</Text>
      <Field
        name={fieldName}
        component={inputProps => {
          const { input: { value, onChange } } = inputProps;
          return (
            <ButtonGroup
              onPress={i => onChange({ i: i, text: buttons[i] })}
              selectedIndex={value.i}
              buttons={buttons}
              containerStyle={containerStyle}
              selectedBackgroundColor={'#9EDEF5'}
            />
          );
        }}
      />
    </View>
  );

  _renderContent = sectionId => {
    const scrollViewContainerStyle = { height: 300 }
    const yesNoButtons = ['No', 'Yes'];
    
    const dogId = this.props.dog._id;
    const BuildingSearchInfo = UDCInfo.BuildingSearch;
    return (
      <View style={{
        marginTop: 20,
        justifyContent: 'center'
      }}>
        <Text h4>Handler Radius</Text>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          {this._renderLabeledButtonGroup(
            'Alert', 
            `${dogId}.performance.${sectionId}.radiusAlert`, 
            BuildingSearchInfo.HandlerRadius,
            {flexDirection:'column', justifyContent:'flex-start', height: 250}
          )}
          {this._renderLabeledButtonGroup(
            'Reward', 
            `${dogId}.performance.${sectionId}.radiusReward`, 
            BuildingSearchInfo.HandlerRadius,
            {flexDirection:'column', justifyContent:'flex-start', height: 250}
          )}
          {this._renderLabeledButtonGroup(
            'Search', 
            `${dogId}.performance.${sectionId}.radiusSearch`, 
            BuildingSearchInfo.HandlerRadius,
            {flexDirection:'column', justifyContent:'flex-start', height: 250}
          )}
          <View>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              {this._renderLabeledButtonGroup(
                'Rewarder', 
                `${dogId}.performance.${sectionId}.rewarder`, 
                ['Handler', 'Trainer'],
                {flexDirection:'column', justifyContent:'flex-start', height: 125}
              )}
              <View>
                <Text h4>Barks</Text>
                <View>
                  {renderReduxDropdown(
                    `${dogId}.performance.${sectionId}.barks`, 
                    BuildingSearchInfo.Barks, 
                    { width: 100, height: 100 }, 
                    null, null,
                    20
                  )}
                </View>
              </View>
            </View>
            <View>
              <Text h4>Duration</Text>
              <View style={{flexDirection:'row'}}>
                <View style={{flexDirection:'row'}}>
                  {renderReduxDropdown(
                    `${dogId}.performance.${sectionId}.duration.minutes`, 
                    BuildingSearchInfo.Time, 
                    { width: 100, height: 100 }, 
                    null, null,
                    20
                  )}
                  <Text h6>mins</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                  {renderReduxDropdown(
                    `${dogId}.performance.${sectionId}.duration.seconds`, 
                    BuildingSearchInfo.Time, 
                    { width: 100, height: 100 }, 
                    null, null,
                    20
                  )}
                  <Text h6>secs</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <Text h4>Select all that apply:</Text>
        <View style={{flexDirection: 'row', flexWrap:'wrap'}}>
          <CheckboxContainer name={`${dogId}.performance.${sectionId}.fields`} checkboxes={BuildingSearchInfo.Fields}/>
        </View>
        <Text h4>Failure Codes</Text>
        <ScrollView style={scrollViewContainerStyle}>
            <View style={{flexDirection: 'row', flexWrap:'wrap'}}>
              <CheckboxContainer name={`${dogId}.performance.${sectionId}.failCodes`} checkboxes={BuildingSearchInfo.FailCodes}/>
            </View>
        </ScrollView>
        <Text h4>Distractions</Text>
        <View style={{flexDirection: 'row', flexWrap:'wrap'}}>
          <CheckboxContainer name={`${dogId}.performance.${sectionId}.distractions`} checkboxes={BuildingSearchInfo.Distractions}/>   
        </View>
      </View>
    );
  };
  
  _renderTextInput(inputProps) {
    const textInputStyle = { width: '60%', marginTop: 10 }
    return renderTextInput(inputProps, 'Name', textInputStyle)
  }

  _addStopwatchTime = onChange => {
    let time = this.state.stopwatchTime;

    time.seconds++;
    if (time.seconds >= 60) {
      time.seconds = 0;
      time.minutes++;
      if (time.minutes >= 60) {
        time.minutes = 0;
        time.hours++;
      }
    }
    
    onChange(time);
    this.setState({ stopwatchTime: time })
  }

  _clearStopwatch = onChange => {
    this.setState({ stopwatchTime: { seconds: 0, minutes: 0, hours: 0 } })
  }

  _toggleStopwatch = onChange => {
    if (this.state.interval) {
      clearInterval(this.state.interval);
      this.setState({ interval: null })
    }
    else {
      let int = setInterval(() => this._addStopwatchTime(onChange), 1000)
      this.setState({ interval: int })
    }
  }

  _renderStopwatch = () => (
    <Field 
      name={`${this.props.dog._id}.performance.${this.state.activeSection._id}.time`}
      component={(inputProps) => {
        const { input } = inputProps;

        const time = this.state.stopwatchTime;
        const hours = time.hours === 0 ? '00' : time.hours < 10 ? '0'+time.hours : time.hours;
        const minutes = time.minutes === 0 ? '00' : time.minutes < 10 ? '0'+time.minutes : time.minutes;
        const seconds = time.seconds === 0 ? '00' : time.seconds < 10 ? '0'+time.seconds : time.seconds;

        return (
          <View style={{flexDirection: 'row'}}>
            <Button 
              title={!this.state.interval ? 'Start Stopwatch' : 'Stop Stopwatch'}
              onPress={() => this._toggleStopwatch(input.onChange)}
              textStyle={buttonTextStyle}
              buttonStyle={buttonStyle}
            />
            <Text style={{marginTop: 15}}>{`${hours}:${minutes}:${seconds}`}</Text>
            {
              !this.state.interval &&
              <Button 
                title={'Clear'}
                onPress={() => this._clearStopwatch(input.onChange)}
                textStyle={buttonTextStyle}
                buttonStyle={buttonStyle}
              />
            }
          </View>
        )
      }}
    />
  )

  _renderPage = () => {
    return (
      <View style={{
        marginTop: 30,
        backgroundColor: 'white',
        alignItems: 'center',
        width: '80%',
        height: '89%'
      }}>
        <View style={{height: '75%', marginTop: 30, alignItems: 'center'}}> 
          <View style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Text h3>Searches</Text>
            {this._renderStopwatch()}
          </View>
          <SectionList
            sections={this.state.hides}
            keyExtractor={a => a}
            style={{ marginTop: 15 }}
            renderSectionHeader={({ section }) =>
              <Text style={{
                ...outlineButtonStyle,
                fontSize:20,
                borderColor: 'black',
                borderRadius: 5,
                borderWidth: 2
              }}>{section.title}</Text>}
            renderItem={({ item, section }) => (
              <View key={item}>
                {this._renderContent(item._id)}
              </View>
            )}
          />
        </View>
      </View>
    )
  }

  _renderAddDogNameField(inputProps) {
    return (
      <FormInput
        placeholder="Name"
        value={inputProps.input.value}
        onChangeText={inputProps.input.onChange}
        editable={true}
        maxLength={35}
        multiline={false}
        containerStyle={{ width: "40%" }}
      />
    );
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
    UDCBuildingSearchScreen,
    state => ({
      dog: state.udc.dog,
    })
  )
