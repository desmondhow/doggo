import React from "react";
import { StyleSheet, View, ScrollView, SectionList } from "react-native";
import { Text, Button, ButtonGroup, FormInput } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import Collapsible from "react-native-collapsible/Collapsible";
import { Field, formValueSelector } from "redux-form";

import {
  container,
  center,
  buttonStyle,
  buttonTextStyle
} from "../../../constants/Styles";
import {
  connectReduxForm,
  renderReduxDropdown
} from "../../../components/helpers";
import { OBDInfo } from "../../../constants/SessionsConstants";
import API from "../../../constants/Api";
import Colors from "../../../constants/Colors";
import CheckboxContainer from "../../../components/CheckboxContainer";
import { saveOBDTraining } from "../../../redux/actions/obd.actions";

export class OBDFunctionScreen extends React.Component {
  constructor(props) {
    super(props);
    const sessionInfo = this.props.navigation.getParam("sessionInfo", false);

    if (sessionInfo) {
      // const searchSections = [];
      // sessionInfo.searches.forEach(hide => {
      //   searchSections.push({
      //     title: this._renderSectionTitle(hide),
      //     data: [hide]
      //   });
      // });

      this.state = {
        sessionInfo: sessionInfo,
        activeSection: "",
        functions: [],
        sessionId: sessionInfo._id,
        createdAt: sessionInfo.createdAt,
        stopwatchTime: { seconds: 0, minutes: 0, hours: 0 },
        interval: null
      };
    }
  }

  componentDidMount() {
    this.setState({
      handlers: this.props.handlers,
      dogs: this.props.dogs
    });
  }

  _onSubmit = dogTrainingData => {
    if (dogTrainingData.length === 0) {
      alert("Please fill the training session.");
    } else {
      const sessionInfo = this.state.sessionInfo;
      sessionInfo.dogsTrained = dogTrainingData;

      // this.props.dispatch(
      //   saveOBDTraining({
      //     sessionInfo: sessionInfo,
      //     handlers: this.state.handlers
      //   })
      // );
      this.props.navigation.navigate("OBD");
    }
  };

  _renderSubmitBtn = () => (
    <Button
      raised
      rounded
      title="Finish Training"
      onPress={this.props.handleSubmit(this._onSubmit)}
      fontSize={26}
      buttonStyle={{
        ...center,
        ...buttonStyle,
        marginTop: 20
      }}
      titleStyle={{
        fontSize: 20,
        fontWeight: "bold"
      }}
    />
  );

  // _renderSectionTitle = section =>
  //   `${section.searchNumber ? ` Search #${section.searchNumber}` : ""}`;

  _renderLabeledButtonGroup = (label, fieldName, buttons, containerStyle) => (
    <View style={{ flexDirection: "column" }}>
      <Text h4>{label}</Text>
      <Field
        name={fieldName}
        component={inputProps => {
          const {
            input: { value, onChange }
          } = inputProps;
          return (
            <ButtonGroup
              onPress={i => onChange({ i: i, text: buttons[i] })}
              selectedIndex={value.i}
              buttons={buttons}
              containerStyle={containerStyle}
              selectedBackgroundColor={"#9EDEF5"}
              buttonStyle={{ borderColor: "grey", borderWidth: 1 }}
            />
          );
        }}
      />
    </View>
  );

  _renderContent = functionName => {
    const scrollViewContainerStyle = { height: 300 };
    // sectionId = this.state.sectionId.toString();
    // const dogId = this.props.dog._id;
    const OBDFunctionInfo = OBDInfo.Function;
    return (
      <View
        style={{
          marginTop: 20,
          justifyContent: "center"
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {this._renderLabeledButtonGroup(
            "K9\nPosition",
            `${this.state.sessionId}.${functionName}.k9Position`,
            OBDFunctionInfo.K9Position,
            {
              flexDirection: "column",
              justifyContent: "flex-between",
              height: 250,
              width: 125
            }
          )}
          {this._renderLabeledButtonGroup(
            "Handler\nPosition",
            `${this.state.sessionId}.${functionName}.handlerPosition`,
            OBDFunctionInfo.HandlerPosition,
            {
              flexDirection: "column",
              justifyContent: "flex-between",
              height: 250,
              width: 125
            }
          )}
          {this._renderLabeledButtonGroup(
            "Handler\nRadius",
            `${this.state.sessionId}.${functionName}.handlerRadius`,
            OBDFunctionInfo.HandlerRadius,
            {
              flexDirection: "column",
              justifyContent: "flex-between",
              height: 250,
              width: 125
            }
          )}
          {this._renderLabeledButtonGroup(
            "Sit\nPosition",
            `${this.state.sessionId}.${functionName}.sitPosition`,
            OBDFunctionInfo.SitPosition,
            {
              flexDirection: "column",
              justifyContent: "flex-between",
              height: 250,
              width: 125
            }
          )}
          <View>
            <Text h4>Duration</Text>
            <View style={{ flexDirection: "col" }}>
              <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                {renderReduxDropdown(
                  `${this.state.sessionId}.${functionName}.duration.minutes`,
                  OBDFunctionInfo.Time,
                  { width: 100, height: 100 },
                  null,
                  null,
                  20
                )}
                <Text h6>mins</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                {renderReduxDropdown(
                  `${this.state.sessionId}.${functionName}.duration.seconds`,
                  OBDFunctionInfo.Time,
                  { width: 100, height: 100 },
                  null,
                  null,
                  20
                )}
                <Text h6>secs</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  _addStopwatchTime = onChange => {
    let time = this.state.stopwatchTime;

    time.seconds++;
    if (time.seconds >= 60) {
      time.seconds = 0;
      time.minutes++;
      if (time.minutes >= 60) {
        time.minutes = 0;
        time.hours++;
      }
    }

    onChange(time);
    this.setState({ stopwatchTime: time });
  };

  _clearStopwatch = onChange => {
    this.setState({ stopwatchTime: { seconds: 0, minutes: 0, hours: 0 } });
  };

  _toggleStopwatch = onChange => {
    if (this.state.interval) {
      clearInterval(this.state.interval);
      this.setState({ interval: null });
    } else {
      let int = setInterval(() => this._addStopwatchTime(onChange), 1000);
      this.setState({ interval: int });
    }
  };

  _renderStopwatch = () => (
    <Field
      name={`${this.props.dog._id}.performance.${
        this.state.activeSection._id
      }.time`}
      component={inputProps => {
        const { input } = inputProps;

        const time = this.state.stopwatchTime;
        const hours =
          time.hours === 0
            ? "00"
            : time.hours < 10
            ? "0" + time.hours
            : time.hours;
        const minutes =
          time.minutes === 0
            ? "00"
            : time.minutes < 10
            ? "0" + time.minutes
            : time.minutes;
        const seconds =
          time.seconds === 0
            ? "00"
            : time.seconds < 10
            ? "0" + time.seconds
            : time.seconds;

        return (
          <View style={{ flexDirection: "row" }}>
            <Button
              title={
                !this.state.interval ? "Start Stopwatch" : "Stop Stopwatch"
              }
              onPress={() => this._toggleStopwatch(input.onChange)}
              textStyle={buttonTextStyle}
              buttonStyle={buttonStyle}
            />
            <Text
              style={{ marginTop: 15 }}
            >{`${hours}:${minutes}:${seconds}`}</Text>
            {!this.state.interval && (
              <Button
                title={"Clear"}
                onPress={() => this._clearStopwatch(input.onChange)}
                textStyle={buttonTextStyle}
                buttonStyle={buttonStyle}
              />
            )}
          </View>
        );
      }}
    />
  );

  _renderPage = () => {
    const sections = [];
    OBDInfo.Function.FunctionNames.map(functionName => {
      sections.push({
        title: functionName,
        data: [""]
      });
    });
    return (
      <View
        style={{
          marginTop: 30,
          backgroundColor: "white",
          alignItems: "center",
          width: "90%",
          height: "89%",
          paddingHorizontal: 10
        }}
      >
        <View style={{ height: "90%", marginTop: 30, alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Text h3>Functions</Text>
            {/* {this._renderStopwatch()} */}
          </View>
          <SectionList
            sections={sections}
            keyExtractor={a => a}
            style={{ marginTop: 15 }}
            renderSectionHeader={({ section }) => (
              <View
                style={{
                  backgroundColor: "#EEEEEE",
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text h3 style={{ paddingLeft: 10 }}>
                  {section.title}
                </Text>
                {!!section.notes && (
                  <Button
                    icon={
                      <Icon
                        name="info-circle"
                        size={15}
                        color="white"
                        onPress={() => alert("notes")}
                      />
                    }
                    type="clear"
                    title="i"
                  />
                )}
              </View>
            )}
            renderItem={({ item, section }) => {
              console.log(`section.title: ${JSON.stringify(section.title)}`);
              return (
                <View key={item}>{this._renderContent(section.title)}</View>
              );
            }}
          />
        </View>
      </View>
    );
  };

  // this is never used anywhere?
  // _renderAddDogNameField(inputProps) {
  //   return (
  //     <FormInput
  //       placeholder="Name"
  //       value={inputProps.input.value}
  //       onChangeText={inputProps.input.onChange}
  //       editable={true}
  //       maxLength={35}
  //       multiline={false}
  //       containerStyle={{ width: "40%" }}
  //     />
  //   );
  // }

  render = () => (
    <View style={container}>
      {this._renderPage()}
      {this._renderSubmitBtn()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  hideContainer: {
    flexDirection: "column",
    paddingLeft: 65,
    paddingRight: 65,
    ...center
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
  input: {
    height: 40,
    width: 100
  }
});

const selector = formValueSelector("obd");
export default connectReduxForm("obd", OBDFunctionScreen, state => ({
  dog: state.obd.dog,
  dogs: state.general.dogs,
  handlers: state.general.handlers
}));
