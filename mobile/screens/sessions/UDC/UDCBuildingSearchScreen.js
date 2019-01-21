import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
  SectionList
} from 'react-native';
import { Text, Icon, Button, ButtonGroup, FormInput } from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';
import Collapsible from 'react-native-collapsible/Collapsible';
import { Field } from 'redux-form';

import { container, center, buttonStyle, outlineButtonTextStyle, buttonTextStyle, outlineButtonStyle } from '../../../constants/Styles';
import { connectReduxForm, renderDropdown, renderReduxDropdown, renderTextInput, request } from '../../../components/helpers';
import { BuildingSearchInfo } from '../../../constants/SessionsConstants';
import API, { loadUserProfile } from '../../../constants/Api';
import Colors from '../../../constants/Colors';
import * as actions from '../../../redux/actions/index.actions';
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
        dog: { name: '', _id: -1, },
        trainer: { name: '', _id: -1, },
        dogs: [],
        trainers: [],
        hides: hideSections,
        sessionId: sessionInfo._id,
        createdAt: sessionInfo.createdAt,
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
      console.log(url)
      Object.keys(sessionInfo).forEach(dogId => (
        Object.keys(sessionInfo[dogId]['performance']).map(hideId => (
          Object.keys(sessionInfo[dogId]['performance'][hideId]).map(field => {
            const hideInfo = sessionInfo[dogId]['performance'][hideId];
            console.log(typeof hideInfo[field])
            sessionInfo[dogId]['performance'][hideId][field] = typeof hideInfo[field] == 'object' ? 
              hideInfo[field].text : 
              hideInfo[field]
          })
        ))
      ))
      console.log(sessionInfo);
      return request(url, JSON.stringify({ sessionId: this.state.sessionId, sessionInfo: sessionInfo }), 'POST')
    })
    .then(res => res.json())
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
    

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
    const yesNoButtons = ['No', 'Yes']

    const dogId = this.state.dog._id;
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
          <Field name={`${dogId}.performance.${sectionId}.barks`} component={_ => 
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

  setActiveSection = sectionTitle => this.setState(prevState => ({ activeSection: prevState.activeSection ? '' : sectionTitle }));
  _renderTextInput(inputProps) {
    const textInputStyle = { width: '60%', marginTop: 10 }
    return renderTextInput(inputProps, 'Name', textInputStyle)
  }

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
        <View style={{height: '75%', marginTop: 30, alignItems: 'center'}}> 
          <Text h3>Searches</Text>
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
                onPress={() => this.setActiveSection(section.title)}
              />
            )}
            renderItem={({ item, section }) => (
              <Collapsible
                key={item}
                collapsed={section.title !== this.state.activeSection}>
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

export default connectReduxForm(
    'udc',
    UDCBuildingSearchScreen,
    state => ({
      
    })
  )