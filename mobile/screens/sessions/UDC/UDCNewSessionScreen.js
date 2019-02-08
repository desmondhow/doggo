import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import {
  Text,
  Button,
  ButtonGroup,
  Divider,
  FormInput
} from "react-native-elements";
import { Field, formValueSelector, change, untouch } from "redux-form";
import Modal from "react-native-modal";

import {
  center,
  buttonStyle,
  buttonTextStyle,
  outlineButtonTextStyle
} from "../../../constants/Styles";
import {
  connectReduxForm,
  renderReduxDropdown,
  renderReduxFormInput
} from "../../../components/helpers";
import { UDCInfo } from "../../../constants/SessionsConstants";
import API from "../../../constants/Api";
import Colors from "../../../constants/Colors";
import {
  deleteUDCSession,
  saveUDCSession
} from "../../../redux/actions/udc.actions";
import { guidGenerator } from "../../../redux/actions/connection.actions";

class UDCNewSessionScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addedHides: {},
      addHideRoomNumber: null
    };

    let previousHides = {};
    const sessionInfo = this.props.navigation.getParam("sessionInfo", false);
    console.log("sessionInfo", sessionInfo);

    const addHideState = {
      addHideRoomNumber: null,
      addHideType: null
    };

    // If data comes from server
    if (sessionInfo) {
      sessionInfo.hides.forEach(hide => {
        previousHides[hide.roomNumber] = {
          concentration: hide.concentration,
          size: hide.size,
          location: hide.location,
          isConcealed: hide.isConcealed,
          placementArea: hide.placementArea,
          placementHeight: hide.placementHeight,
          roomNumber: hide.roomNumber,
          hideType: hide.hideType,
          notes: hide.notes
        };
      });
      this.state = {
        ...addHideState,
        addedHides: previousHides,
        isNew: false,
        sessionId: sessionInfo.sessionId,
        showAddHideModal: false,
        isEditing: this.props.navigation.getParam("isEditing", false),
        createdAt: sessionInfo.createdAt,
        temperature: sessionInfo.temperature,
        humidity: sessionInfo.humidity,
        wind: sessionInfo.wind,
        windDirection: sessionInfo.windDirection
      };
    } else {
      //We are creating a new session
      const localID = guidGenerator();
      this.state = {
        ...addHideState,
        addedHides: {},
        isNew: true,
        sessionId: localID,
        showAddHideModal: false,
        isEditing: false,
        createdAt: new Date(),
        temperature: null,
        humidity: null,
        wind: null,
        windDirection: null
      };
    }
  }

  _onSubmit = () => {
    let session = {
      isNew: this.state.isNew,
      temperature: this.state.temperature,
      humidity: this.state.humidity,
      wind: this.state.wind,
      windDirection: this.state.windDirection,
      complete: false,
      sessionId: this.state.sessionId,
      createdAt: this.state.createdAt,
      hides: this.state.addedHides
    };

    this.props.dispatch(saveUDCSession({ sessionInfo: session }));
    this.props.navigation.navigate("UDC");
  };

  _updateGeneralState = (property, val) => this.setState({ [property]: val });

  _renderGeneralForm = () => (
    <View
      style={{
        center,
        ...styles.fieldsContainer,
        marginTop: 30,
        flexDirection: "row"
      }}
    >
      {Object.keys(UDCInfo.General).map(name => (
        <View
          style={{
            marginTop: 30,
            height: 100,
            width: "23.5%",
            marginLeft: 20
          }}
          key={name}
        >
          <Text style={styles.labelStyle}>
            {name[0].toUpperCase() + name.substr(1)}:
          </Text>
          {renderReduxDropdown(
            name,
            UDCInfo.General[name],
            { width: 150, height: 100 },
            this.state.isEditing
              ? val => this._updateGeneralState(name, val)
              : null,
            this.state.isEditing ? this.state[name] : null,
            20
          )}
        </View>
      ))}
    </View>
  );

  _renderAddedHides = () => (
    <View>
      {Object.keys(this.state.addedHides).map(roomNumber => (
        <View>
          <View style={{ flexDirection: "row", marginBottom: 15 }}>
            <Text style={{ marginLeft: 30, fontSize: 22, fontWeight: "bold" }}>
              Room #:{" "}
            </Text>
            <Text style={{ fontSize: 22 }}>{roomNumber} | </Text>
            <Text style={{ fontWeight: "bold", fontSize: 22 }}>
              {this.state.addedHides[roomNumber].hideType}
            </Text>
          </View>
          <View style={center}>
            {this.state.addedHides[roomNumber].type === "Hot"
              ? this._renderAddHideConcentrationDropdowns()
              : null}
            {this._renderHideFields(roomNumber)}
          </View>
        </View>
      ))}
      <View style={center}>
        <Divider
          style={{ backgroundColor: "black", height: 2, width: "90%" }}
        />
      </View>
    </View>
  );

  _renderAddHideConcentrationDropdowns = (
    roomNumber,
    userIsAddingHide = false
  ) => {
    const containerStyle = { flexDirection: "column", width: "40%", ...center };
    // const dropdownContainerStyle = { marginTop: -20, width: "100%" };

    return (
      <View
        style={{
          flexDirection: "row",
          width: "55%",
          ...center
        }}
      >
        <View style={containerStyle}>
          <Text style={styles.labelStyle}>Concentration:</Text>
          {renderReduxDropdown(
            `Hides.${roomNumber}.concentration`,
            UDCInfo.Hides.Measurements.Concentrations,
            styles.dropdown,
            userIsAddingHide
              ? null
              : roomNumber =>
                  this._updateHideState(
                    roomNumber,
                    "concentration",
                    concentration
                  ),
            userIsAddingHide
              ? this.props.addHideConcentration
              : this.state.addedHides[roomNumber].concentration
          )}
        </View>
        <View style={containerStyle}>
          <Text style={styles.labelStyle}>Size:</Text>
          {renderReduxDropdown(
            `Hides.${roomNumber}.size`,
            UDCInfo.Hides.Measurements.Sizes.map(size =>
              size.replace("#", ".")
            ),
            styles.dropdown,
            userIsAddingHide
              ? null
              : roomNumber => this._updateHideState(roomNumber, "size", size),
            userIsAddingHide
              ? this.props.addHideSize
              : this.state.addedHides[roomNumber].size
          )}
        </View>
      </View>
    );
  };

  _updateHideState = (roomNumber, property, value) => {
    this.setState(prevState => ({
      addedHides: {
        ...prevState.addedHides,
        [roomNumber]: { [property]: value }
      }
    }));
  };

  _renderAddHideModal = () => {
    let hideFields = null;
    if (this.state.addHideType === "Hot") {
      hideFields = (
        <View style={center}>
          {this._renderAddHideConcentrationDropdowns(
            this.state.addHideRoomNumber,
            true
          )}
          {this._renderHideFields(this.state.addHideRoomNumber, true)}
        </View>
      );
    } else if (this.state.addHideType === "Blank") {
      hideFields = this._renderHideFields(this.state.addHideRoomNumber, true);
    }

    return (
      this.state.showAddHideModal && (
        <Modal
          isVisible={this.state.showAddHideModal}
          onBackdropPress={() => this.setState({ showAddHideModal: false })}
        >
          <View
            style={{
              ...center,
              flexDirection: "column",
              backgroundColor: "white",
              borderRadius: 5
            }}
          >
            <View style={{ margin: 20, ...center }}>
              <View style={{ flexDirection: "row", marginBottom: 20 }}>
                <Text h3>Adding a </Text>
                <Text h3 style={{ color: Colors.blue }}>
                  {this.state.addHideType.toLowerCase()}
                </Text>
                <Text h3> hide</Text>
              </View>
              <View>
                <View style={center}>
                  <Text style={styles.labelStyle}>Room #:</Text>
                  <FormInput
                    containerStyle={{
                      width: 150,
                      marginBottom: 20
                    }}
                    value={this.state.addHideRoomNumber}
                    onChangeText={roomNumber =>
                      this.setState({ addHideRoomNumber: roomNumber })
                    }
                  />
                </View>
              </View>
              {hideFields}
              <Button
                rounded
                title="Add"
                buttonStyle={buttonStyle}
                textStyle={buttonTextStyle}
                fontSize={22}
                rightIcon={{
                  name: "plus",
                  type: "font-awesome",
                  size: 26
                }}
                containerViewStyle={{ paddingBottom: 10, marginRight: 50 }}
                onPress={() => this._addHide()}
              />
            </View>
          </View>
        </Modal>
      )
    );
  };

  _renderHideFields = (roomNumber, userIsAddingHide = false) => (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "space-between",
        marginBottom: 100
      }}
    >
      <View style={{ flexDirection: "row", ...center }}>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          {/* Location */}
          <Text style={styles.labelStyle}>Location:</Text>
          {renderReduxDropdown(
            `Hides.${roomNumber}.location`,
            UDCInfo.Hides.Locations,
            styles.dropdown,
            userIsAddingHide
              ? null
              : location =>
                  this._updateHideState(roomNumber, "location", location),
            userIsAddingHide
              ? this.props.addHideLocation
              : this.state.addedHides[roomNumber].location
          )}
        </View>
        <View style={{ flexDirection: "column", ...center, marginBottom: 30 }}>
          {/* Concealed */}
          <Text style={styles.labelStyle}>Concealed:</Text>
          <View>
            <Field
              name={`Hides.${roomNumber}.isConcealed`}
              component={inputProps => (
                <ButtonGroup
                  onPress={
                    userIsAddingHide
                      ? inputProps.input.onChange
                      : isConcealed =>
                          this._updateHideState(
                            roomNumber,
                            "isConcealed",
                            isConcealed
                          )
                  }
                  selectedIndex={
                    userIsAddingHide
                      ? this.props.addHideIsConcealed
                      : this.state.addedHides[roomNumber].isConcealed
                  }
                  buttons={["No", "Yes"]}
                  textStyle={outlineButtonTextStyle}
                  containerStyle={{ height: 40, width: 100 }}
                />
              )}
            />
          </View>
        </View>
        {/* Placement Area */}
        <View style={{ flexDirection: "column", ...center }}>
          <Text style={styles.labelStyle}>Placement Area:</Text>
          {renderReduxDropdown(
            `Hides.${roomNumber}.placementArea`,
            UDCInfo.Hides.PlacementAreas,
            styles.dropdown,
            userIsAddingHide
              ? null
              : placementArea =>
                  this._updateHideState(
                    roomNumber,
                    "placementArea",
                    placementArea
                  ),
            userIsAddingHide
              ? this.props.addHidePlacementArea
              : this.state.addedHides[roomNumber].placementArea
          )}
        </View>
        {/* Placement Height */}
        <View style={{ flexDirection: "column", ...center }}>
          <Text style={styles.labelStyle}>Placement Height:</Text>
          {renderReduxDropdown(
            `Hides.${roomNumber}.placementHeight`,
            UDCInfo.Hides.PlacementHeights,
            styles.dropdown,
            userIsAddingHide
              ? null
              : placementHeight =>
                  this._updateHideState(
                    roomNumber,
                    "placementHeight",
                    placementHeight
                  ),
            userIsAddingHide
              ? this.props.addHidePlacementHeight
              : this.state.addedHides[roomNumber].placementHeight
          )}
        </View>
      </View>
      {/* Notes */}
      <View style={center}>
        <Text style={styles.labelStyle}>Notes:</Text>
        {renderReduxFormInput(
          `Hides.${roomNumber}.notes`, 
          { width: "80%" },
          4,
          true
        )}
      </View>
    </View>
  );

  _toggleAddHideModal = type =>
    this.setState(prevState => ({
      addHideType: type,
      showAddHideModal: !prevState.showAddHideModal
    }));

  _renderAddHideButton = type => (
    <Button
      rounded
      title={`Add ${type}`}
      buttonStyle={buttonStyle}
      textStyle={buttonTextStyle}
      fontSize={22}
      rightIcon={{
        name: "plus",
        type: "font-awesome",
        size: 26
      }}
      containerViewStyle={{ paddingBottom: 10, marginRight: 50 }}
      onPress={() => this._toggleAddHideModal(type)}
    />
  );

  _renderAddHideButtons = () => (
    <View style={{ ...center, flexDirection: "row", marginLeft: "8%" }}>
      {this._renderAddHideButton("Hot")}
      {this._renderAddHideButton("Blank")}
      {this._renderAddHideButton("Empty")}
    </View>
  );

  _onDeleteSession = () => {
    this.props.dispatch(deleteUDCSession({ sessionId: this.state.sessionId }));
    this.props.navigation.navigate("UDC");
  };

  _renderSubmitBtn = () => {
    let width = this.state.isEditing ? 150 : 300;
    let createBtn = (
      <Button
        raised
        rounded
        title={this.state.isEditing ? "Edit" : "Create"}
        onPress={this.props.handleSubmit(this._onSubmit)}
        fontSize={26}
        buttonStyle={{
          ...center,
          ...buttonStyle,
          marginLeft: 60,
          marginTop: 20,
          width: width
        }}
      />
    );

    let deleteBtn = (
      <Button
        raised
        rounded
        title="Delete"
        onPress={() => this._onDeleteSession()}
        fontSize={26}
        buttonStyle={{
          ...center,
          ...buttonStyle,
          marginLeft: 60,
          marginTop: 20,
          width: width
        }}
      />
    );

    return this.state.isEditing ? (
      <View style={{ flexDirection: "row" }}>
        {deleteBtn}
        {createBtn}
      </View>
    ) : (
      createBtn
    );
  };
  _resetFields = fields => {
    fields.forEach(field => {
      //reset the field's value
      this.props.dispatch(change("udc", field, ""));

      //reset the field's error
      this.props.dispatch(untouch("udc", field));
    });
  };

  _addHide = () => {
    const concentration = this.props.addHideConcentration;
    const size = this.props.addHideSize;
    const location = this.props.addHideLocation;
    const isConcealed = this.props.addHideIsConcealed;
    const placementArea = this.props.addHidePlacementArea;
    const placementHeight = this.props.addHidePlacementHeight;
    const hideType = this.state.addHideType;
    const roomNumber = this.state.addHideRoomNumber;

    // reset Add Hide section state
    this.setState({ addHideRoomNumber: 0, hideType: "" });
    this._resetFields([
      "Hides.null.concentration",
      "Hides.null.size",
      "Hides.null.location",
      "Hides.null.isConcealed",
      "Hides.null.placementArea",
      "Hides.null.placementHeight",
      "Hides.null.hideType"
    ]);

    // store new hide
    this.setState(prevState => ({
      showAddHideModal: false,
      addedHides: {
        ...prevState.addedHides,
        [roomNumber]: {
          concentration,
          size,
          location,
          isConcealed,
          placementArea,
          placementHeight,
          hideType
        }
      }
    }));
  };

  _renderHidesForm = () => (
    <View style={{ ...center, width: "100%" }}>
      <View
        style={{
          ...center,
          ...styles.fieldsContainer,
          height: "80%",
          marginTop: 50
        }}
      >
        <Text h3>Added Hides</Text>
        <ScrollView
          style={{ width: "100%" }}
          keyboardShouldPersistTaps={"handled"}
        >
          {Object.keys(this.state.addedHides).length > 0
            ? this._renderAddedHides()
            : null}
        </ScrollView>
        {this._renderAddHideButtons()}
      </View>
      {this._renderSubmitBtn()}
    </View>
  );

  render = () => (
    <View style={styles.container}>
      <View>{this._renderGeneralForm()}</View>
      <View style={{}}>{this._renderHidesForm()}</View>
      {this._renderAddHideModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  fieldsContainer: {
    borderColor: Colors.darkGrey,
    borderRadius: 10,
    borderWidth: 8
  },
  dropdown: {
    width: 150,
    height: 100,
    marginTop: -20
  },
  labelStyle: {
    fontWeight: "bold",
    fontSize: 18
  }
});

const selector = formValueSelector("udc");
export default connectReduxForm("udc", UDCNewSessionScreen, state => ({
  addHideConcentration: selector(state, "Hides.null.concentration"),
  addHideSize: selector(state, "Hides.null.size"),
  addHideLocation: selector(state, "Hides.null.location"),
  addHideIsConcealed: selector(state, "Hides.null.isConcealed"),
  addHidePlacementArea: selector(state, "Hides.null.placementArea"),
  addHidePlacementHeight: selector(state, "Hides.null.placementHeight"),
  addHideType: selector(state, "Hides.null.hideType")
}));
