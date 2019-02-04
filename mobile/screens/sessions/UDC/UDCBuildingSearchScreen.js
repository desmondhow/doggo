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
            if (typeof hideInfo[field] === 'object') {
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
    <View>
      <Text h4>{label}</Text>
      <View>
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
              />
            );
          }}
        />
      </View>
    </View>
  );

  _renderContent = sectionId => {
    const buttonGroupContainerStyle = { height: 50 }
    const scrollViewContainerStyle = { height: 300 }
    const yesNoButtons = ['No', 'Yes'];
    
    const dogId = this.state.dog._id;
    const BuildingSearchInfo = UDCInfo.BuildingSearch;
    return (
      <View style={{
        marginTop: 20,
       justifyContent: 'center'
      }}>
        {this._renderLabeledButtonGroup(
          'Handler Radius - Alert', 
          `${dogId}.performance.${sectionId}.radiusAlert`, 
          BuildingSearchInfo.HandlerRadius, 
          buttonGroupContainerStyle
        )}
        {this._renderLabeledButtonGroup(
          'Handler Radius - Reward', 
          `${dogId}.performance.${sectionId}.radiusReward`, 
          BuildingSearchInfo.HandlerRadius, 
          buttonGroupContainerStyle
        )}
        {this._renderLabeledButtonGroup(
          'Handler Radius - Search', 
          `${dogId}.performance.${sectionId}.radiusSearch`, 
          BuildingSearchInfo.HandlerRadius, 
          buttonGroupContainerStyle
        )}
        {this._renderLabeledButtonGroup(
          'Rewarder', 
          `${dogId}.performance.${sectionId}.rewarder`, 
          ['Handler', 'Trainer'], 
          buttonGroupContainerStyle
        )}
        <Text h4>Barks</Text>
        <View>
          {renderReduxDropdown(
            `${dogId}.performance.${sectionId}.barks`, 
            BuildingSearchInfo.Barks, 
            { width: '100%', height: 100 }, 
            null, null,
            20
          )}
        </View>
        {this._renderLabeledButtonGroup(
          'Handler Knows', 
          `${dogId}.performance.${sectionId}.handlerKnows`, 
          yesNoButtons, 
          buttonGroupContainerStyle
        )}
        {this._renderLabeledButtonGroup(
          'Fringe', 
          `${dogId}.performance.${sectionId}.fringe`, 
          yesNoButtons, 
          buttonGroupContainerStyle
        )}
        {this._renderLabeledButtonGroup(
          'Reset', 
          `${dogId}.performance.${sectionId}.reset`, 
          yesNoButtons, 
          buttonGroupContainerStyle
        )}
        {this._renderLabeledButtonGroup(
          'False Alert', 
          `${dogId}.performance.${sectionId}.falseAlert`, 
          yesNoButtons, 
          buttonGroupContainerStyle
        )}
        {this._renderLabeledButtonGroup(
          'On Lead', 
          `${dogId}.performance.${sectionId}.lead`, 
          yesNoButtons, 
          buttonGroupContainerStyle
        )}
        {this._renderLabeledButtonGroup(
          'False Indication', 
          `${dogId}.performance.${sectionId}.falseIndication`, 
          yesNoButtons, 
          buttonGroupContainerStyle
        )}
        {this._renderLabeledButtonGroup(
          'Detail Search', 
          `${dogId}.performance.${sectionId}.detailSearch`, 
          yesNoButtons, 
          buttonGroupContainerStyle
        )}
        {this._renderLabeledButtonGroup(
          'Successful', 
          `${dogId}.performance.${sectionId}.successful`, 
          yesNoButtons, 
          buttonGroupContainerStyle
        )}
        <View>
          <Text h4>Failure Codes</Text>
          <ScrollView style={scrollViewContainerStyle}>
            <CheckboxContainer name={`${dogId}.performance.${sectionId}.failCodes`} checkboxes={BuildingSearchInfo.FailCodes}/>
          </ScrollView>
        </View>
        <View>
          <Text h4>Distractions</Text>
          <ScrollView style={scrollViewContainerStyle}>
            <CheckboxContainer name={`${dogId}.performance.${sectionId}.distractions`} checkboxes={BuildingSearchInfo.Distractions}/>
          </ScrollView>     
        </View>
      </View>
    );
  };

  setActiveSection = section => {
    this.setState(prevState => ({ activeSection: prevState.activeSection ? '' : section }));
    //not sure if this works
    if (this.state.interval) {
      clearInterval(this.state.interval);
      this.setState({ interval: null })
    }
    let value = this.props.addStopwatchTime(this.state.dog._id, this.state.activeSection._id);
    if (value) {
      this.setState({ stopwatchTime: value })
    }
  }
  
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
    !!this.state.activeSection && 
    <Field 
      name={`${this.state.dog._id}.performance.${this.state.activeSection._id}.time`}
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
    const labelFieldContainerStyle = { flexDirection: 'column', width: '30%', ...center }
    const dropdownStyle = { width: '60%', height: 100, marginTop: -30 };
    const dropdownFontSize = 16;
    const labelStyle = { fontWeight: 'bold', fontSize: 16 };

    return (
      <View style={{
        marginTop: 30,
        backgroundColor: 'white',
        alignItems: 'center',
        width: '70%',
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
            renderSectionHeader={({ section }) => (
              <Button 
                title={section.title}
                buttonStyle={outlineButtonStyle}
                textStyle={outlineButtonTextStyle}
                fontSize={20}
                onPress={() => this.setActiveSection(section)}
              />
            )}
            renderItem={({ item, section }) => (
              <Collapsible
                key={item}
                collapsed={section.title !== this.state.activeSection.title}>
                {this._renderContent(item._id)}
              </Collapsible>
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

const selector = formValueSelector('udc')
export default connectReduxForm(
    'udc',
    UDCBuildingSearchScreen,
    state => ({
      dog: state.udc.dog,
      addStopwatchTime: (dogId, hideId) => selector(state, 'Hides.'+dogId+'.'+hideId+'.time'),
    })
  )
