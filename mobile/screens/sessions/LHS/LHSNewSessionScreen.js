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

class LHSNewSessionScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addedSearches: {},
      addSearchLocation: null
    };

    let previousSearches = {};

    const sessionInfo = this.props.navigation.getParam("sessionInfo", false);

    const addSearchState = {
      addSearchLocation: null,
    };


    // If data comes from server
    if (sessionInfo) {
      sessionInfo.searches.forEach(search => {
        previousSearches[search.location] = {
          location: search.location,
          subject1: search.subject1, 
          subject2: search.subject2, 
          subject3: search.subject3,
          notes: hide.notes
        };
      });
      this.state = {
        ...addSearchState,
        addedSearches: previousSearches,
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
        isNew: true,
        sessionId: localID,
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

  _renderSearchFields = (location, userIsAddingSearch = false) => (
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
            `Searches.${location}.location`,
            LHSInfo.SearchSetup.Locations,
            styles.dropdown,
            userIsAddingSearch
              ? null
              : location =>
                  this._updateSearchState(location, "location", location),
            userIsAddingSearch ? null : this.state.addedSearches[location].location
          )}
        </View>
        {/* Subject Placement 1 */}
        <View style={{ flexDirection: "column", ...center }}>
          <Text style={styles.labelStyle}>Subject Placement 1:</Text>
          {renderReduxDropdown(
            `Searches.${location}.subject1`,
            LHSInfo.SearchSetup.SubjectPlacement,
            styles.dropdown,
            userIsAddingSearch
              ? null
              : placementArea =>
                  this._updateSearchState(
                    location,
                    "subject1",
                    subject1
                  ),
            userIsAddingSearch
              ? this.props.addSearchSubject1
              : this.state.addedSearches[location].subject1
          )}
        </View>
        {/* Subject Placement 2 */}
        <View style={{ flexDirection: "column", ...center }}>
          <Text style={styles.labelStyle}>Subject Placement 2:</Text>
          {renderReduxDropdown(
            `Searches.${location}.subject2`,
            LHSInfo.SearchSetup.SubjectPlacement,
            styles.dropdown,
            userIsAddingSearch
              ? null
              : placementArea =>
                  this._updateSearchState(
                    location,
                    "subject2",
                    subject2
                  ),
            userIsAddingSearch
              ? this.props.addSearchSubject2
              : this.state.addedSearches[location].subject2
          )}
        </View>
        {/* Subject Placement 3 */}
        <View style={{ flexDirection: "column", ...center }}>
          <Text style={styles.labelStyle}>Subject Placement 3:</Text>
          {renderReduxDropdown(
            `Searches.${location}.subject3`,
            LHSInfo.SearchSetup.SubjectPlacement,
            styles.dropdown,
            userIsAddingSearch
              ? null
              : placementArea =>
                  this._updateSearchState(
                    location,
                    "subject3",
                    subject1
                  ),
            userIsAddingSearch
              ? this.props.addSearchSubject3
              : this.state.addedSearches[location].subject3
          )}
        </View>
      </View>
      {/* Notes */}
      <View style={center}>
        <Text style={styles.labelStyle}>Notes:</Text>
        {renderReduxFormInput(`Searches.${location}.notes`, {
          containerStyle: { width: 400 },
          numberOfLine: 4,
          multiline: true
        })}
      </View>
    </View>
  );

  render = () => (
    <View style={styles.container}>
      <View>{this._renderGeneralForm()}</View>
      <View>{this._renderSearchFields()}</View>
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
  addSearchSubject1: selector(state, `Searches.null.subject1`),
  addSearchSubject2: selector(state, `Searches.null.subject2`),
  addSearchSubject3: selector(state, `Searches.null.subject3`),
}));
