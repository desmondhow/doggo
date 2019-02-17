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
// import {
//   deleteUDCSession,
//   saveUDCSession
// } from "../../../redux/actions/udc.actions";
import { guidGenerator } from "../../../redux/actions/connection.actions";

class LHSNewSessionScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };

    const sessionInfo = this.props.navigation.getParam("sessionInfo", false);


    // If data comes from server
    if (sessionInfo) {
      // sessionInfo.hides.forEach(hide => {
      //   previousHides[hide.roomNumber] = {
      //     concentration: hide.concentration,
      //     size: hide.size,
      //     location: hide.location,
      //     isConcealed: hide.isConcealed,
      //     placementArea: hide.placementArea,
      //     placementHeight: hide.placementHeight,
      //     roomNumber: hide.roomNumber,
      //     hideType: hide.hideType,
      //     notes: hide.notes
      //   };
      // });
      // this.state = {
      //   ...addHideState,
      //   addedHides: previousHides,
      //   isNew: false,
      //   sessionId: sessionInfo.sessionId,
      //   showAddHideModal: false,
      //   isEditing: this.props.navigation.getParam("isEditing", false),
      //   createdAt: sessionInfo.createdAt,
      //   temperature: sessionInfo.temperature,
      //   humidity: sessionInfo.humidity,
      //   wind: sessionInfo.wind,
      //   windDirection: sessionInfo.windDirection
      // };
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

    // this.props.dispatch(saveUDCSession({ sessionInfo: session }));
    // this.props.navigation.navigate("UDC");
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

  render = () => (
    <View style={styles.container}>
      <View>{this._renderGeneralForm()}</View>
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
// export default connectReduxForm("udc", UDCNewSessionScreen, state => ({
//   addHideConcentration: selector(state, `Hides.null.concentration`),
//   addHideSize: selector(state, `Hides.null.size`),
//   addHideLocation: selector(state, `Hides.null.location`),
//   addHideIsConcealed: selector(state, `Hides.null.isConcealed`),
//   addHidePlacementArea: selector(state, `Hides.null.placementArea`),
//   addHidePlacementHeight: selector(state, `Hides.null.placementHeight`),
//   addHideType: selector(state, `Hides.null.hideType`),
//   addHideNotes: selector(state, `Hides.null.notes`)
// }));
export default connectReduxForm("lhs", LHSNewSessionScreen, state => ({

}));
