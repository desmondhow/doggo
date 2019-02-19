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
import { LHSInfo } from "../../../constants/SessionsConstants";
import API from "../../../constants/Api";
import Colors from "../../../constants/Colors";
import {
  deleteLHSSession,
  saveLHSSession
} from "../../../redux/actions/lhs.actions";
import { guidGenerator } from "../../../redux/actions/connection.actions";
import CheckboxContainer from "../../../components/CheckboxContainer";

class LHSNewSessionScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addedSearches: {},
      addSearchNumber: null
    };

    let previousSearches = {};

    const sessionInfo = this.props.navigation.getParam("sessionInfo", false);

    const addSearchState = {
      addSearchNumber: null,
    };


    // If data comes from server
    if (sessionInfo) {
      sessionInfo.searches.forEach(search => {
        previousSearches[search.searchNumber] = {
          location: search.location,
          subject1: search.subject1, 
          subject2: search.subject2, 
          subject3: search.subject3,
          notes: search.notes
        };
      });
      this.state = {
        ...addSearchState,
        addedSearches: previousSearches,
        isNew: false,
        sessionId: sessionInfo.sessionId,
        showAddSearchModal: false,
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
        ...addSearchState,
        addedSearches: {},
        isNew: true,
        sessionId: localID,
        isEditing: false,
        showAddSearchModal: false,
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
    };

    this.props.dispatch(saveLHSSession({ sessionInfo: session }));
    this.props.navigation.navigate("LHS");
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
      {Object.keys(LHSInfo.General).map(name => (
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
            LHSInfo.General[name],
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

  _renderAddedSearches = () => (
    <View>
      {Object.keys(this.state.addedSearches).map(searchNumber => {
        console.log(JSON.stringify(this.state.addedSearches[searchNumber]));
        return (
          <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: "row", marginBottom: 20 }}>
              <Text
                style={{ marginLeft: 30, fontSize: 22, fontWeight: "bold" }}
              >
                Search #:
              </Text>
              <Text style={{ fontSize: 22 }}>{roomNumber} | </Text>
              <Text style={{ fontWeight: "bold", fontSize: 22 }}>
                {this.state.addedSearches[searchNumber].location}
              </Text>
            </View>
            <View style={center}>
              { this._renderSearchFields(searchNumber)}
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

  _updateSearchState = (searchNumber, property, value) => {
    this.setState(prevState => ({
      addedSearches: {
        ...prevState.addedSearches,
        [searchNumber]: {
            ...prevState.addedSearches[searchNumber],
           [property]: value 
        }
      }
    }));
  };

  _renderAddSearchModal = () => {
    let searchFields = (
      <View style={center}>
        {this._renderSearchFields(null, true)}
      </View>
    )

    return (
      this.state.showAddSearchModal && (
        <Modal
          isVisible={this.state.showAddSearchModal}
          onBackdropPress={() => this.setState({ showAddSearchModal: false })}
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
                <Text h3>Adding a search</Text>
              </View>
              <View>
                <View style={center}>
                  <Text style={styles.labelStyle}>Search #:</Text>
                  <FormInput
                    containerStyle={{
                      width: 150,
                      marginBottom: 20
                    }}
                    value={this.state.addSearchNumber}
                    onChangeText={searchNumber =>
                      this.setState({ addSearchNumber: searchNumber })
                    }
                  />
                </View>
              </View>
              {searchFields}
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
                onPress={() => this._addSearch()}
              />
            </View>
          </View>
        </Modal>
      )
    );
  };

  _renderSearchFields = (searchNumber, userIsAddingSearch = false) => (
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
            `Searches.${searchNumber}.location`,
            LHSInfo.SearchSetup.Locations,
            styles.dropdown,
            userIsAddingSearch
              ? null
              : searchNumber =>
                  this._updateSearchState(searchNumber, "searchNumber", searchNumber),
            userIsAddingSearch ? null : this.state.addedSearches[searchNumber].location
          )}
        </View>
        {/* Subject Placement */}
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <CheckboxContainer
            name={`Searches.${searchNumber}.placements`}
            checkboxes={LHSInfo.SearchSetup.Placements}
          />
        </View>
        {/* Notes */}
        <View style={center}>
          <Text style={styles.labelStyle}>Notes:</Text>
          {renderReduxFormInput(`Searches.${searchNumber}.notes`, {
            containerStyle: { width: 400 },
            numberOfLine: 4,
            multiline: true
          })}
        </View>
      </View>
    </View>
  );

  _toggleAddSearchModal = () =>
  this.setState(prevState => ({
    showAddSearchModal: !prevState.showAddSearchModal
  }));

  _renderAddSearchButton = () => (
    <Button
      rounded
      title={`Add Search`}
      buttonStyle={buttonStyle}
      textStyle={buttonTextStyle}
      fontSize={22}
      rightIcon={{
        name: "plus",
        type: "font-awesome",
        size: 26
      }}
      containerViewStyle={{ paddingBottom: 10, marginRight: 50 }}
      onPress={() => this._toggleAddSearchModal()}
    />
  );

  _onDeleteSession = () => {
    this.props.dispatch(deleteLHSSession({ sessionId: this.state.sessionId }));
    this.props.navigation.navigate("LHS");
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
      this.props.dispatch(change("lhs", field, ""));

      //reset the field's error
      this.props.dispatch(untouch("lhs", field));
    });
  };

_addSearch = () => {
  const placements = this.props.addSearchPlacements;
  const location = this.props.addSearchLocation;
  const notes = this.props.addSearchNotes;
  const searchNumber = this.state.addSearchNumber;

  // reset Add Hide section state
  this.setState({ addSearchNumber: 0});
  this._resetFields([
    `Searches[null]placements`,
    `Searches[null]location`,
    `Searches[null]notes`
  ]);

  // store new hide
  this.setState(prevState => ({
    showAddSearchModal: false,
    addedSearches: {
      ...prevState.addedSearches,
      [searchNumber]: {
        location,
        placements,
        notes
      }
    }
  }));
};

_renderSearchesForm = () => (
  <View style={{ ...center, width: "100%" }}>
    <View
      style={{
        ...center,
        ...styles.fieldsContainer,
        height: "84%"
      }}
    >
      <Text h3>Added Searches</Text>
      <ScrollView
        style={{ width: "100%" }}
        keyboardShouldPersistTaps={"handled"}
      >
        {Object.keys(this.state.addedSearches).length > 0
          ? this._renderAddedSearches()
          : null}
      </ScrollView>
      {this._renderAddSearchButton()}
    </View>
    {this._renderSubmitBtn()}
  </View>
);

  render = () => (
    <View style={styles.container}>
      <View>{this._renderGeneralForm()}</View>
      <View style={{}}>{this._renderSearchesForm()}</View>
      {this._renderAddSearchModal()}
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

const selector = formValueSelector("lhs");
export default connectReduxForm("lhs", LHSNewSessionScreen, state => ({
  addSearchLocation: selector(state, `Searches.null.location`),
  addSearchSubject1: selector(state, `Searches.null.notes`),
  addSearchSubject2: selector(state, `Searches.null.placements`)
}));
