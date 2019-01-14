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

import { container, formContainer, center } from '../../../constants/Styles';
import { connectReduxForm, renderDropdown } from '../../../components/helpers';
import { BuildingSearchInfo } from '../../../constants/SessionsConstants';
import Colors from '../../../constants/Colors';
import * as actions from '../../../redux/actions/index.actions';
import CustomButtonGroup from '../../../components/CustomButtonGroup';
import CheckboxContainer from '../../../components/CheckboxContainer';

export class UDCBuildingSearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this._renderPage = this._renderPage.bind(this);

    const sessionInfo = this.props.navigation.getParam('sessionInfo', false);

    this.state = {
        activeSections: [],
        barks: '0',
        dog: {},
        hides: sessionInfo,
        sessionId: sessionInfo._id,
        createdAt: sessionInfo.createdAt,
    }

  }

  _onSubmit = (performanceInfo) => {
    console.log(performanceInfo)
    this.props.saveDogTraining(performanceInfo);
    Alert.alert('Finish Dog Training, save info for this session for this dog - requires submitting multiple forms with one click, thus maintaining a key for each search');
    this.props.navigation.navigate('UDC');
  }

  checkNumber = (text) => {
    this.setState({
        barks: text.replace(/[^0-9]/g, ''),
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

  _renderHeader = section => {
    return (
      <View style={styles.field}>
        <Text h3>{section.location}, {section.placement}, {section.concealed}</Text>
      </View>
    );
  };

  // section is each BuildingSearchInfo.TempSessions[0].Hides
  _renderContent = section => {
    return (
      <View style={styles.content}>
        <Text h4>Handler Radius - Alert</Text>
        <View>
            <Field name={`dogs.${this.state.dog.id}.${section.concentration}.${section.size}.radiusAlert`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <ButtonGroup
                  onPress={onChange}
                  selectedIndex={value}
                  buttons={BuildingSearchInfo.HandlerRadius}
                  containerStyle={{height: 50}}
                />
              )}}
            />
        </View>
        <Text h4>Handler Radius - Reward</Text>
        <View>
            <Field name={`dogs.${this.state.dog.id}.${section.concentration}.${section.size}.radiusReward`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <ButtonGroup
                  onPress={onChange}
                  selectedIndex={value}
                  buttons={BuildingSearchInfo.HandlerRadius}
                  containerStyle={{height: 50}}
                />
              )}}
            />
        </View>
        <Text h4>Handler Radius - Search</Text>
        <View>
            <Field name={`dogs.${this.state.dog.id}.${section.concentration}.${section.size}.radiusSearch`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <ButtonGroup
                  onPress={onChange}
                  selectedIndex={value}
                  buttons={BuildingSearchInfo.HandlerRadius}
                  containerStyle={{height: 50}}
                />
              )}}
            />
        </View>
        {/* need to show actual string of the things instead of "selectedIndex" being returned */}
        <Text h4>Rewarder</Text>
        <View>
            <Field name={`dogs.${this.state.dog.id}.${section.concentration}.${section.size}.rewarder`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <ButtonGroup
                  onPress={onChange}
                  selectedIndex={value}
                  buttons={['Handler', 'Trainer']}
                  containerStyle={{height: 50}}
                />
              )}}
            />
        </View>

        <Text h4>Barks</Text>
        <View>
            <Field name={`dogs.${this.state.dog.id}.${section.concentration}.${section.size}.barks`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <TextInput 
                    style={styles.input}
                    keyboardType='numeric'
                    onChangeText={(text)=> this.checkNumber(text)}
                    value={this.state.barks}
                    maxLength={3}  //setting limit of input
                />
              )}}
            />
        </View>

        <Text h4>Handler Knows</Text>
        <View>
            <Field name={`dogs.${this.state.dog.id}.${section.concentration}.${section.size}.handlerKnows`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <ButtonGroup
                  onPress={onChange}
                  selectedIndex={value}
                  buttons={['No', 'Yes']}
                  containerStyle={{height: 50}}
                />
              )}}
            />
        </View>
        <Text h4>Fringe</Text>
        <View>
            <Field name={`dogs.${this.state.dog.id}.${section.concentration}.${section.size}.fringe`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <ButtonGroup
                  onPress={onChange}
                  selectedIndex={value}
                  buttons={['No', 'Yes']}
                  containerStyle={{height: 50}}
                />
              )}}
            />
        </View>
        <Text h4>Reset</Text>
        <View>
            <Field name={`dogs.${this.state.dog.id}.${section.concentration}.${section.size}.reset`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <ButtonGroup
                  onPress={onChange}
                  selectedIndex={value}
                  buttons={['No', 'Yes']}
                  containerStyle={{height: 50}}
                />
              )}}
            />
        </View>
        <Text h4>False Alert</Text>
        <View>
            <Field name={`dogs.${this.state.dog.id}.${section.concentration}.${section.size}.falseAlert`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <ButtonGroup
                  onPress={onChange}
                  selectedIndex={value}
                  buttons={['No', 'Yes']}
                  containerStyle={{height: 50}}
                />
              )}}
            />
        </View>
        <Text h4>On Lead</Text>
        <View>
            <Field name={`dogs.${this.state.dog.id}.${section.concentration}.${section.size}.lead`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <ButtonGroup
                  onPress={onChange}
                  selectedIndex={value}
                  buttons={['No', 'Yes']}
                  containerStyle={{height: 50}}
                />
              )}}
            />
        </View>
        <Text h4>False Indication</Text>
        <View>
            <Field name={`dogs.${this.state.dog.id}.${section.concentration}.${section.size}.falseIndication`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <ButtonGroup
                  onPress={onChange}
                  selectedIndex={value}
                  buttons={['No', 'Yes']}
                  containerStyle={{height: 50}}
                />
              )}}
            />
        </View>
        <Text h4>Detail Search</Text>
        <View>
            <Field name={`dogs.${this.state.dog.id}.${section.concentration}.${section.size}.detailSearch`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <ButtonGroup
                  onPress={onChange}
                  selectedIndex={value}
                  buttons={['No', 'Yes']}
                  containerStyle={{height: 50}}
                />
              )}}
            />
        </View>
        <Text h4>Successful</Text>
        <View>
            <Field name={`dogs.${this.state.dog.id}.${section.concentration}.${section.size}.successful`} component={(inputProps) => {
              const { input: { value, onChange } } = inputProps;
              return (
                <ButtonGroup
                  onPress={onChange}
                  selectedIndex={value}
                  buttons={['No', 'Yes']}
                  containerStyle={{height: 50}}
                />
              )}}
            />
        </View>
        
        <Text h4>Failure Codes</Text>
        <ScrollView style={{height: '20%'}}>
            <Field name={`dogs.${this.state.dog.id}.${section.concentration}.${section.size}.failCodes`} component={(inputProps) => {
                const { input: { value, onChange } } = inputProps;
                // what to do with the selectedIndex={value} thing for these checkboxes to get actual values
                return (
                    <CheckboxContainer checkboxes={BuildingSearchInfo.FailCodes}/>
                )}}
                /> 
        </ScrollView>
        <Text h4>Distractions</Text>
        <ScrollView style={{height: '20%'}}>
        <Field name={`dogs.${this.state.dog.id}.${section.concentration}.${section.size}.distractions`} component={(inputProps) => {
                const { input: { value, onChange } } = inputProps;
                // what to do with the selectedIndex={value} thing for these checkboxes to get actual values
                return (
                    <CheckboxContainer checkboxes={BuildingSearchInfo.Distractions}/>
                )}}
                /> 
        </ScrollView>
      </View>
    );
  };

  setSections = sections => {
    this.setState({
      activeSections: sections.includes(undefined) ? [] : sections,
    });
  };

  _renderPage = () => (
    <View style={center}>
        <View>
            <Text>K9 Name</Text>
            {renderDropdown(this.state.dog, (dog) => this.setState({ dog: dog }), BuildingSearchInfo.TempDogs, { width: 200, height: 100 })}
        </View>
      <View>
        <Text>Handler</Text>
        {renderDropdown(`dogs.${this.state.dog.id}.Handler`, null, BuildingSearchInfo.TempTrainers, { width: 200, height: 100 })}
      </View>
      <View>
        <Text>Recorder</Text>
        {renderDropdown(`dogs.${this.state.dog.id}.Recorder`, null, BuildingSearchInfo.TempTrainers, { width: 200, height: 100 })}
      </View>
      <Text h2>Searches</Text>
      {/* Desmond represents Hides as concentration_1: { size_1: {placement...}, size_2: {placement...} }, concentration_2: {...} which fucks everything up */}
      <Accordion
            activeSections={this.state.activeSections}
            sections={this.state.hides}
            touchableComponent={TouchableOpacity}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            onChange={this.setSections}
            expandMultiple={false}
        />
      {this._renderSubmitBtn()}
    </View>
  )

  render = () => (
    <View style={container}>
    <ScrollView style={formContainer} keyboardShouldPersistTaps={'handled'}>
      <View>
        <Text h2>Building Search</Text>
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
    UDCBuildingSearchScreen,
    state => ({
        dog: state.udc.dog
    }),
    dispatch => ({
        saveDogTraining: performanceInfo =>
          dispatch({ type: actions.SAVE_UDC_DOG_TRAINING, performanceInfo })
      })
  )