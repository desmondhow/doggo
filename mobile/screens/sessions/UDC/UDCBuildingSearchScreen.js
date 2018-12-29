import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import { Text, Icon, Button, ButtonGroup } from 'react-native-elements';
import { Field } from 'redux-form';
import { Dropdown } from 'react-native-material-dropdown';

import { container, formContainer, center } from '../../../constants/Styles';
import { connectReduxForm, renderDropdown } from '../../../components/helpers';
import { BuildingSearchInfo } from '../../../constants/sessions/UDCConstants';
import Colors from '../../../constants/Colors';
import * as actions from '../../../redux/actions/index.actions';

export class UDCBuildingSearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this._renderForm = this._renderForm.bind(this);
  }

  _onSubmit = (sessionInfo) => {
    Alert.alert('Finish Dog Training, save info for this session for this dog');
    this.props.navigation.navigate('UDC');
  }

  _renderSubmitBtn = () => (
  <Button
      raised
      rounded
      title='Finish Traning'
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

  _renderField = search => (
    <View style={styles.field} key={search}>
      <Text h4 containerStyle={{ marginTop: 5 }}>{search}:</Text>
    </View>
  );

  _renderForm = () => (
    <View style={center}>
      <ScrollView style={styles.fieldsContainer} keyboardShouldPersistTaps={'handled'}>
        {Object.keys(BuildingSearchInfo.Hides).map(search => 
          this._renderField(BuildingSearchInfo.Hides[search])
        )}
      </ScrollView>
      {this._renderSubmitBtn()}
    </View>
  )

  render = () => (
    <View style={container}>
      <View style={formContainer}>
        <Text h2>Building Search</Text>
        {this._renderForm()}
      </View>
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