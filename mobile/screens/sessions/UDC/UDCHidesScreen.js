import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Button, ButtonGroup, Divider } from 'react-native-elements';
import { Field, formValueSelector } from 'redux-form';

import { container, formContainer, center } from '../../../constants/Styles';
import { connectReduxForm, renderReduxDropdown, renderDropdown } from '../../../components/helpers';
import { HidesInfo } from '../../../constants/sessions/UDCConstants';
import Colors from '../../../constants/Colors';
import * as actions from '../../../redux/actions/index.actions';
import store from '../../../redux/store';

class UDCHidesScreen extends React.Component {
  constructor(props) {
    super(props);
    this._renderForm = this._renderForm.bind(this);
    this.state = {
      addedHides: {}, 
      addHideConcentration: '', 
      addHideSize: '',
      addHideLocation: this.props.addHideLocationReduxValue, 
      addHideIsConcealed: this.props.addHideIsConcealedReduxValue, 
      addHidePlacementArea: this.props.addHidePlacementAreaReduxValue, 
      addHidePlacementHeight: this.props.addHidePlacementHeightReduxValue, 
    }
  }

  _onSubmit = sessionInfo => {
    this.props.saveNewSession({
      temperature: sessionInfo.Temperature,
      humidity: sessionInfo.Humidity,
      wind: sessionInfo.Wind,
      windDirection: sessionInfo['Wind Direction'],
      hides: this.state.addedHides
    });

    console.log(this.props.addHideLocationReduxValue);
    this.props.navigation.navigate('UDC');
  };

  _updateHideState = (concentration, size, property, value) => {
    this.setState(prevState => ({
      ...prevState,
      addedHides: {
        ...prevState.addedHides,
        [concentration]: {
          ...prevState.addedHides[concentration],
          [size]: {
            ...prevState.addedHides[concentration][size],
            [property]: value
          }
        }
      }
    }))
  }

  _renderHideFields = (concentration, size, userIsAddingHide = false) => (
    <View
      style={{
        flexDirection: 'row',
        marginTop: 15,
        justifyContent: 'space-between',
        width: '90%'
      }}
    >
      <View style={{ flexDirection: 'column', ...center }}>
        {/* Location */}
        <Text>Location:</Text>
        {renderReduxDropdown(
          `Hides.${concentration}.${size}.location`,
          HidesInfo.Locations,
          styles.dropdown,
          location => userIsAddingHide ? 
            this.setState({ addHideLocation: location}) : 
            this._updateHideState(concentration, size, 'location', location),
          userIsAddingHide ? this.state.addHideLocation : this.state.addedHides[concentration][size].location,
          ' '
        )}
      </View>
      <View style={{ flexDirection: 'column', ...center, marginBottom: 30 }}>
        {/* Concealed */}
        <Text>Concealed:</Text>
        <View>
          <Field
            name={`Hides.${concentration}.${size}.isConcealed`}
            component={inputProps => 
              <ButtonGroup
                onPress={isConcealed => userIsAddingHide ? 
                  this.setState({ addHideIsConcealed: isConcealed }) :
                  this._updateHideState(concentration, size, 'isConcealed', isConcealed)}
                selectedIndex={userIsAddingHide ? this.state.addHideIsConcealed : this.state.addedHides[concentration][size].isConcealed}
                buttons={['No', 'Yes']}
                containerStyle={{ height: 40, width: 100}}
              /> 
            }
          />
        </View>
      </View>
      {/* Placement Area */}
      <View style={{ flexDirection: 'column', ...center }}>
        <Text>Placement Area:</Text>
        {renderReduxDropdown(
          `Hides.${concentration}.${size}.placementArea`,
          HidesInfo.PlacementAreas,
          styles.dropdown,
          placementArea => userIsAddingHide ? 
            this.setState({ addHidePlacementArea: placementArea}) : 
            this._updateHideState(concentration, size, 'placementArea', placementArea),
          userIsAddingHide ? this.state.addHidePlacementArea : this.state.addedHides[concentration][size].placementArea
        )}
      </View>
      {/* Placement Height */}
      <View style={{ flexDirection: 'column', ...center }}>
        <Text>Placement Height:</Text>
        {renderReduxDropdown(
          `Hides.${concentration}.${size}.placementHeight`,
          HidesInfo.PlacementHeights,
          styles.dropdown,
          placementHeight => userIsAddingHide ? 
            this.setState({ addHidePlacementHeight: placementHeight}) : 
            this._updateHideState(concentration, size, 'placementHeight', placementHeight),
          userIsAddingHide ? this.state.addHidePlacementHeight : this.state.addedHides[concentration][size].placementHeight
        )}
      </View>
    </View>
  );

  _renderSubmitBtn = () => (
    <Button
      raised
      rounded
      title='Create'
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
  );

  _addHide = () => {
    const concentration = this.state.addHideConcentration;
    const size = this.state.addHideSize;
    const location = this.state.addHideLocation;
    const isConcealed = this.state.addHideIsConcealed;
    const placementArea = this.state.addHidePlacementArea
    const placementHeight = this.state.addHidePlacementHeight


    // should all the fields be required?
    if (!concentration || !size) {
      return;
    }
    else if (!location) {
      alert('You must specify a location to add a hide.')
      return;
    }
    else if (this.state.addedHides[concentration] && this.state.addedHides[concentration][size]) {
      alert('You have already added this hide. Please edit the one above.')
      return;
    }

    this.setState(prevState => ({
      ...prevState,
      addedHides: {
        ...prevState.addedHides,
        [concentration]: {
          ...prevState.addedHides[concentration],
          [size]: {
            location: location,
            isConcealed: isConcealed,
            placementArea: placementArea,
            placementHeight: placementHeight
          }
        }
      }
    }))
  }

  _renderAddHideButton = () => (
    <Button
      rounded
      title='Add a Hide'
      textStyle={{ fontSize: 22 }}
      color='white'
      rightIcon={{    
        name: 'plus',
        type: "font-awesome",
        size: 30,
        color: Colors.blue,
      }}
      containerViewStyle={{paddingBottom: 10, marginRight: 50}}
      onPress={() => this._addHide()}
    />
  )

  _renderAddHideTypeDropdowns = () => {
    const containerStyle = { flexDirection: 'column', width: '33%', ...center }
    const dropdownContainerStyle = { marginTop: -20, width: '100%' }
    const textStyle = { fontWeight: 'bold', fontSize: 16 }

    return (
      <View style={{flexDirection: 'row', width: '55%', justifyContent: 'space-between', marginTop: 25}}>
        <View style={containerStyle}>
          <Text style={textStyle}>Concentration</Text>
          {
            renderDropdown(
              this.state.addHideConcentration, 
              (concentration) => this.setState({ addHideConcentration: concentration }), 
              HidesInfo.Hides.Concentrations,
              dropdownContainerStyle
            )
          }
        </View>
        <View style={containerStyle}>
          <Text style={textStyle}>Size</Text>
          {
            renderDropdown(
              this.state.addHideSize, 
              (size) => this.setState({ addHideSize: size }), 
              HidesInfo.Hides.Sizes.map(size => size.replace('#', '.')),
              dropdownContainerStyle
            )
          }
        </View>
      </View>
    );
  }

  _renderAddedHides = () => (
    <View>
      <View style={center}>
        <Text h3>Added Hides</Text>
      </View>
      {
        Object.keys(this.state.addedHides).map(concentration => (
          <View>
            <Text h4 style={{marginLeft: 10}}>{concentration} mil.</Text>
            {Object.keys(this.state.addedHides[concentration]).map(size => (
              <View>
                <Text style={{marginLeft: 30, fontSize: 22}}>{size} cm.</Text>
                <View style={center}>
                  {this._renderHideFields(concentration, size)}
                </View>
              </View>
            ))}
          </View>
        ))
      }
      <View style={center}>
        <Divider style={{ backgroundColor: Colors.blue, height: 2, width: '90%' }} />
      </View>
    </View>
  )

  _renderAddHideSection = () => (
    <View style={{marginTop: 20, ...center}}>
      {this._renderAddHideButton()}
      {this._renderAddHideTypeDropdowns()}
      {this._renderHideFields(null, null, true)}
    </View>
  )

  _renderForm = () => (
    <View style={center}>
      <ScrollView
        style={styles.fieldsContainer}
        keyboardShouldPersistTaps={'handled'}
      >
        {
          Object.keys(this.state.addedHides).length > 0 ? this._renderAddedHides() : null
        }
        {this._renderAddHideSection()}
      </ScrollView>
      {this._renderSubmitBtn()}
    </View>
  );

  render = () => (
    <View style={container}>
      <View style={formContainer}>
        <Text h2>Hides</Text>
        {this._renderForm()}
      </View>
    </View>
  );
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

const selector = formValueSelector('udc')
export default connectReduxForm(
  'udc',
  UDCHidesScreen,
  state => {
    return {
      addHideLocationReduxValue: selector(state, 'Hides.null.null.location'),
      addHideIsConcealedReduxValue: selector(state, 'Hides.null.null.isConcealed'),
      addHidePlacementAreaReduxValue: selector(state, 'Hides.null.null.placementArea'),
      addHidePlacementHeightReduxValue: selector(state, 'Hides.null.null.placementHeight'),
      initialValues: state.udc.hides    
    }
  },
  dispatch => ({
    getInitialState: () => dispatch({ type: actions.GET_UDC_HIDES_INITIAL_STATE }),
    saveNewSession: sessionInfo => dispatch({ type: actions.SAVE_NEW_UDC_SESSION, sessionInfo: sessionInfo })
  })
);
