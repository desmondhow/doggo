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
import { BuildingSearchInfo } from '../../../constants/sessions/UDCConstants';
import Colors from '../../../constants/Colors';
import * as actions from '../../../redux/actions/index.actions';
import CustomButtonGroup from '../../../components/CustomButtonGroup';
import CheckboxContainer from '../../../components/CheckboxContainer';

export class UDCBuildingSearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this._renderPage = this._renderPage.bind(this);
  }

  state = {
    activeSections: [],
    barks: '0',
  };

  toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  _onSubmit = (sessionInfo) => {
    console.log(sessionInfo)
    Alert.alert('Finish Dog Training, save info for this session for this dog - requires submitting multiple forms with one click, thus maintaining a key for each search');
    this.props.navigation.navigate('UDC');
  }

  _checkNumber = (text) => {
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
        <Text h3>{section.Location}, {section.Placement}, {section.Concealed}</Text>
      </View>
    );
  };

  _renderContent = () => {
    return (
      <View style={styles.content}>
        {/* <View>
            <Text>Handler Radius - Alert</Text>
            <CustomButtonGroup buttons={BuildingSearchInfo.HandlerRadius}></CustomButtonGroup>
        </View>
        <View>
            <Text>Handler Radius - Reward</Text>
            <CustomButtonGroup buttons={BuildingSearchInfo.HandlerRadius}></CustomButtonGroup>
        </View>
        <View>
            <Text>Handler Radius - Search</Text>
            <CustomButtonGroup buttons={BuildingSearchInfo.HandlerRadius}></CustomButtonGroup>
        </View>
        <View>
            <Text>Rewarder</Text>
            <CustomButtonGroup buttons={['Handler', 'Trainer']}></CustomButtonGroup>
        </View>
        <View>
            <Text>Barks</Text>
            <TextInput 
                keyboardType='numeric'
                onChangeText={(text)=> this.checkNumber(text)}
                value={this.state.barks}
                maxLength={3}  //setting limit of input
            />
        </View>
        <View>
            <Text>Handler Knows</Text>
            <CustomButtonGroup buttons={['Yes', 'No']}></CustomButtonGroup>
        </View>
        <View>
            <Text>Fringe</Text>
            <CustomButtonGroup buttons={['Yes', 'No']}></CustomButtonGroup>
        </View>
        <View>
            <Text>Reset</Text>
            <CustomButtonGroup buttons={['Yes', 'No']}></CustomButtonGroup>
        </View>
        <View>   
            <Text>False Alert</Text>
            <CustomButtonGroup buttons={['Yes', 'No']}></CustomButtonGroup>
        </View>
        <View>
           <Text>On Lead</Text> 
           <CustomButtonGroup buttons={['Yes', 'No']}></CustomButtonGroup>
        </View>
        <View>
            <Text>False Indication</Text>
            <CustomButtonGroup buttons={['Yes', 'No']}></CustomButtonGroup>
        </View>    
        <View>
            <Text>Detail Search</Text>
            <CustomButtonGroup buttons={['Yes', 'No']}></CustomButtonGroup>
        </View>
        <View>
            <Text>Successful</Text>
            <CustomButtonGroup buttons={['Yes', 'No']}></CustomButtonGroup>
        </View> */}
        <ScrollView style={{height: '20%'}}>
            <Text>Failure Codes</Text>
            <CheckboxContainer checkboxes={BuildingSearchInfo.FailCodes}/>
        </ScrollView>
        <ScrollView style={{height: '20%'}}>
            <Text>Distractions</Text>
            <CheckboxContainer checkboxes={BuildingSearchInfo.Distractions}/>
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
        {renderDropdown("K9 Name", BuildingSearchInfo.TempDogs, { width: 200, height: 100 })}
      </View>
      <View>
        <Text>Handler</Text>
        {renderDropdown("Handler", BuildingSearchInfo.TempTrainers, { width: 200, height: 100 })}
      </View>
      <View>
        <Text>Recorder</Text>
        {renderDropdown("Recorder", BuildingSearchInfo.TempTrainers, { width: 200, height: 100 })}
      </View>
      <Text h2>Searches</Text>
      <Accordion
            activeSections={this.state.activeSections}
            sections={BuildingSearchInfo.TempHides}
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
  }
});

export default connectReduxForm(
    'udc',
    UDCBuildingSearchScreen,
  )