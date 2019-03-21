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
import { OBDInfo } from "../../../constants/SessionsConstants";
import API from "../../../constants/Api";
import Colors from "../../../constants/Colors";
import {
  deleteOBDSession,
  saveOBDSession
} from "../../../redux/actions/obd.actions";
import { guidGenerator } from "../../../redux/actions/connection.actions";
import CheckboxContainer from "../../../components/CheckboxContainer";

class OBDNewSessionScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addedDogs: {}
    };

    let previousDogs = {};

    const sessionInfo = this.props.navigation.getParam("sessionInfo", false);

    const addDogState = {
      addDogNumber: 1
    };

    // If data comes from server
    if (sessionInfo) {
      sessionInfo.dogs.forEach(dog => {
        previousDogs[dog.dogNumber] = {
          handler: dog.handler,
          familiar: dog.familiar,
          notes: dog.notes
        };
      });
      this.state = {
        ...addDogState,
        addedDogs: previousDogs,
        isNew: false,
        sessionId: sessionInfo.sessionId,
        showAddDogModal: false,
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
        ...addDogState,
        addedDogs: {},
        isNew: true,
        sessionId: localID,
        isEditing: false,
        showAddDogModal: false,
        createdAt: new Date(),
        temperature: null,
        humidity: null,
        wind: null,
        windDirection: null
      };
    }
  }

  _onSubmit = () => {
    console.log(JSON.stringify(this.state));
    let session = {
      isNew: this.state.isNew,
      temperature: this.state.temperature,
      humidity: this.state.humidity,
      wind: this.state.wind,
      windDirection: this.state.windDirection,
      complete: false,
      sessionId: this.state.sessionId,
      createdAt: this.state.createdAt,
      dogs: this.state.addedDogs
    };
    console.log("On SUbmit");
    console.log(JSON.stringify(session));
    this.props.dispatch(saveOBDSession({ sessionInfo: session }));
    this.props.navigation.navigate("OBD");
  };

  _updateGeneralState = (property, val) => this.setState({ [property]: val });

  _renderGeneralForm = () => (
    <View
      style={{
        center,
        ...styles.fieldsContainer,
        marginTop: 30,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly"
      }}
    >
      {Object.keys(OBDInfo.General).map(name => (
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
            OBDInfo.General[name],
            { width: 150, height: 100 },
            val => this._updateGeneralState(name, val),
            this.state.isEditing,
            20
          )}
        </View>
      ))}
    </View>
  );

  _renderAddedDogs = () => (
    <View>
      {Object.keys(this.state.addedDogs).map(dogNumber => {
        console.log(JSON.stringify(this.state.addedDogs[dogNumber]));
        return (
          <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: "row", marginBottom: 20 }}>
              <Text style={{ marginLeft: 30, fontSize: 22, fontWeight: "bold" }}>K9 Name: </Text>
              <Text style={{ fontSize: 22 }}>{dogNumber} </Text>
              <Text style={{ marginLeft: 30, fontSize: 22, fontWeight: "bold" }}>Handler: </Text>
              <Text style={{ fontSize: 22 }}>{this.state.addedDogs[dogNumber].handler} </Text>
              <Text style={{ marginLeft: 30, fontSize: 22, fontWeight: "bold" }}>Familiar: </Text>
              <Text style={{ fontWeight: "bold", fontSize: 22 }}>{this.state.addedDogs[dogNumber].familiar}</Text>
            </View>
            <View style={center}>
              <Divider
                style={{
                  backgroundColor: "black",
                  height: 2,
                  width: "90%",
                  marginTop: -30
                }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );

  _updateDogState = (dogNumber, property, value) => {
    this.setState(prevState => ({
      addedDogs: {
        ...prevState.addedDogs,
        [dogNumber]: {
          ...prevState.addedDogs[dogNumber],
          [property]: value
        }
      }
    }));
  };

  _renderAddDogModal = () => {
    let dogFields = (
      <View style={center}>{this._renderDogFields(null, true)}</View>
    );

    return (
      this.state.showAddDogModal && (
        <Modal
          isVisible={this.state.showAddDogModal}
          onBackdropPress={() => this.setState({ showAddDogModal: false })}
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
                <Text h3>Adding a dog</Text>
              </View>
              {dogFields}
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
                onPress={() => this._addDog()}
              />
            </View>
          </View>
        </Modal>
      )
    );
  };

  _renderDogFields = (dogNumber, userIsAddingDog = false) => (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "space-between",
        marginBottom: 100,
        ...center
      }}
    >
      {/* K9 Name */}
      <Text style={styles.labelStyle}>K9 Name:</Text>
      {renderReduxDropdown(
        `Dogs.${dogNumber}.dogName`,
        ["Moxie"],
        styles.dropdown,
        userIsAddingDog
          ? null
          : dogName =>
            this._updateDogState(
              dogNumber,
              "dogName",
              dogName
            ),
        userIsAddingDog
          ? null
          : this.state.addedDogs[dogNumber].dogName
      )}
      {/* Handler */}
      <Text style={{ ...styles.labelStyle, paddingBottom: 10 }}>Handler:</Text>
      {renderReduxDropdown(
        `Dogs.${dogNumber}.handlerName`,
        ["Desmond"],
        styles.dropdown,
        userIsAddingDog
          ? null
          : handlerName =>
            this._updateDogState(
              dogNumber,
              "handlerName",
              handlerName
            ),
        userIsAddingDog
          ? null
          : this.state.addedDogs[dogNumber].handlerName
      )}
      {/* Familiar */}
      <Text style={styles.labelStyle}>Familiar:</Text>
      <View>
        <Field
          name={`Dogs.${dogNumber}.isFamiliar`}
          component={inputProps => (
            <ButtonGroup
              onPress={
                userIsAddingDog
                  ? inputProps.input.onChange
                  : isFamiliar =>
                    this._updateDogState(
                      dogNumber,
                      "isFamiliar",
                      isFamiliar
                    )
              }
              selectedIndex={
                userIsAddingDog
                  ? this.props.addDogIsFamiliar
                  : this.state.addedDogs[dogNumber].isFamiliar
              }
              buttons={["No", "Yes"]}
              textStyle={outlineButtonTextStyle}
              containerStyle={{ height: 40, width: 100 }}
            />
          )}
        />
      </View>
      {/* Notes */}
      <View style={{ ...center, paddingTop: 10 }}>
        <Text style={styles.labelStyle}>Notes:</Text>
        {renderReduxFormInput(`Dogs.${dogNumber}.notes`, {
          containerStyle: { width: 400 },
          numberOfLine: 4,
          multiline: true,
          placeholder: userIsAddingDog
            ? null
            : this.state.addedDogs[dogNumber].notes
        })}
      </View>
    </View>
  );

  _toggleAddDogModal = () =>
    this.setState(prevState => ({
      showAddDogModal: !prevState.showAddDogModal
    }));

  _renderAddDogButton = () => (
    <Button
      rounded
      title={`Add Dog`}
      buttonStyle={buttonStyle}
      textStyle={buttonTextStyle}
      fontSize={22}
      rightIcon={{
        name: "plus",
        type: "font-awesome",
        size: 26
      }}
      containerViewStyle={{ paddingBottom: 10 }}
      onPress={() => this._toggleAddDogModal()}
    />
  );

  _onDeleteSession = () => {
    this.props.dispatch(deleteOBDSession({ sessionId: this.state.sessionId }));
    this.props.navigation.navigate("OBD");
  };

  _renderSubmitBtn = () => {
    let width = this.state.isEditing ? 150 : 300;
    console.log(this.state.isEditing);
    let createBtn = (
      <Button
        raised
        rounded
        title={this.state.isEditing ? "Update" : "Create"}
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
      this.props.dispatch(change("obd", field, ""));
      //reset the field's error
      this.props.dispatch(untouch("obd", field));
    });
  };

  _addDog = () => {
    console.log("Dog", this.state.addDogNumber);
    const placements = this.props.addDogPlacements;
    const location = this.props.addDogLocation;
    const notes = this.props.addDogNotes;
    const dogNumber = this.state.addDogNumber;

    // reset Add Hide section state
    this.setState({ addDogNumber: null });
    this._resetFields([
      `Dogs[null]placements`,
      `Dogs[null]location`,
      `Dogs[null]notes`
    ]);
    // store new hide
    this.setState(prevState => ({
      showAddDogModal: false,
      addedDogs: {
        ...prevState.addedDogs,
        [dogNumber]: {
          location,
          placements,
          notes
        }
      }
    }));
  };

  _renderDogsForm = () => (
    <View style={{ ...center, width: "100%" }}>
      <View
        style={{
          ...center,
          ...styles.fieldsContainer,
          height: "84%",
          padding: 20
        }}
      >
        <Text h3>Added Dogs</Text>
        <ScrollView
          style={{ width: "100%" }}
          keyboardShouldPersistTaps={"handled"}
        >
          {Object.keys(this.state.addedDogs).length > 0
            ? this._renderAddedDogs()
            : null}
        </ScrollView>
        {this._renderAddDogButton()}
      </View>
      {this._renderSubmitBtn()}
    </View>
  );

  render = () => (
    <View style={styles.container}>
      <View>{this._renderGeneralForm()}</View>
      <View style={{}}>{this._renderDogsForm()}</View>
      {this._renderAddDogModal()}
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

const selector = formValueSelector("obd");
export default connectReduxForm("obd", OBDNewSessionScreen, state => ({
  addDogLocation: selector(state, `Dogs.null.location`),
  addDogNotes: selector(state, `Dogs.null.notes`),
  addDogPlacements: selector(state, `Dogs.null.placements`)
}));
