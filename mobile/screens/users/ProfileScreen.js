import React, { Component } from "react";
import { StyleSheet, View, ListView, ScrollView } from "react-native";
import { Text, Button, FormInput, Divider } from "react-native-elements";
import { Field, formValueSelector, change, untouch } from "redux-form";
import {
  Table,
  TableWrapper,
  Row,
  Cell,
  Col
} from "react-native-table-component";
import DatePicker from "react-native-datepicker";

import API from "../../constants/Api";
import {
  buttonStyle,
  oddTableRow,
  center,
  outlineButtonTextStyle
} from "../../constants/Styles";
import * as actions from "../../redux/actions/index.actions";
import { connectReduxForm } from "../../components/helpers";

/**
 * Displays the Sign up form
 */
class ProfileScreen extends Component {
  componentDidMount() {
    // fetch profile every second
    this._loadProfile();
    this.interval = setInterval(() => this._loadProfile(), 1 * 1000);
  }

  _loadProfile = () =>
    API.loadProfileURL
      .then(url =>
        fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        })
      )
      .then(res => res.json())
      .then(profile => {
        this.setState({ trainers: profile.trainers, dogs: profile.dogs });
      })
      .catch(err => {
        console.log(err);
        throw err;
      });

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      trainers: [],
      dogs: []
    };
  }

  _renderViewTrainerButton = trainerId => (
    <Button transparent title="View" textStyle={outlineButtonTextStyle} />
  );

  _deleteTrainer = trainerId =>
    API.deleteTrainerURL(trainerId)
      .then(url =>
        fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ trainerId: trainerId })
        })
      )
      .catch(err => {
        console.error(err);
        throw err;
      });

  _renderDeleteTrainerButton = trainerId => (
    <Button
      transparent
      title="Delete"
      textStyle={outlineButtonTextStyle}
      onPress={() => this._deleteTrainer(trainerId)}
    />
  );

  _addTrainer = () => {
    API.addTrainerURL
    .then(url =>
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ trainerName: this.props.addTrainerName })
      })
    )
    .then(res => {
      this.props.dispatch(change('profile', 'add-trainer', ''));
      this.props.dispatch(untouch('profile', 'add-trainer'));
    })
    .catch(err => {
      console.error(err);
      throw err;
    })
  }
    

  _renderAddTrainerField(inputProps) {
    return (
      <FormInput
        placeholder="Name"
        value={inputProps.input.value}
        onChangeText={inputProps.input.onChange}
        editable={true}
        maxLength={35}
        multiline={false}
        containerStyle={{ width: "40%" }}
      />
    );
  }

  _renderTrainersTable = () => {
    const headers = ["Trainers", "", ""];
    let trainerRows = [];

    this.state.trainers.map((trainer, i) => {
      const trainerName = trainer.name;
      const rowData = [
        trainerName,
        this._renderViewTrainerButton(trainer._id),
        this._renderDeleteTrainerButton(trainer._id)
      ];

      trainerRows.push(
        <View
          key={trainerName}
          style={{ flexDirection: "row", marginLeft: 20 }}
        >
          {rowData.map((cellData, j) => {
            return (
              <Cell
                data={cellData}
                style={[
                  {
                    borderColor: "transparent",
                    width: 150,
                    height: 50
                  },
                  i % 2 == 0 ? null : oddTableRow
                ]}
                textStyle={{
                  fontSize: 18,
                  fontFamily: "montserrat"
                }}
              />
            );
          })}
        </View>
      );
    });

    return (
      <View>
        <Table
          style={styles.tableContainer}
          borderStyle={{ borderColor: "transparent" }}
        >
          <TableWrapper style={{ flexDirection: "row", marginTop: 20 }}>
            <Row
              data={headers}
              style={styles.tableHeader}
              textStyle={styles.tableHeaderText}
            />
          </TableWrapper>
          <ScrollView>{trainerRows}</ScrollView>
        </Table>
        <View
          style={{
            flexDirection: "row",
            marginLeft: -10,
            ...center,
          }}
        >
          <Field name="add-trainer" component={this._renderAddTrainerField} />
          <Button
            title="Add Trainer"
            buttonStyle={{ ...buttonStyle, width: 200 }}
            onPress={() => this._addTrainer()}
            textStyle={{ fontSize: 24 }}
          />
        </View>
      </View>
    );
  };

  _renderViewDogButton = dogId => (
    <Button transparent title="View" textStyle={outlineButtonTextStyle} />
  );

  _renderAddDogNameField(inputProps) {
    return (
      <FormInput
        placeholder="Name"
        value={inputProps.input.value}
        onChangeText={inputProps.input.onChange}
        editable={true}
        maxLength={35}
        multiline={false}
        containerStyle={{ width: "40%" }}
      />
    );
  }

  _renderAddDogDateField(inputProps) {
    const d = new Date();
    return (
      <DatePicker
        style={{ width: 200 }}
        date={inputProps.input.value}
        mode="date"
        placeholder="Start Date"
        format="YYYY-MM-DD"
        minDate="2015-01-01"
        maxDate={`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            // display: "none",
            left: 0,
            top: 4,
            marginLeft: 10
          },
          dateInput: {
            marginLeft: 10,
            marginTop: 10
          }
          // ... You can check the source to find the other keys.
        }}
        onDateChange={inputProps.input.onChange}
      />
    );
  }

  _addDog = () => {
    API.addDogURL
    .then(url =>
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          dog: {
            name: this.props.addDogName,
            startDate: this.props.addDogStartDate
          }
        })
      })
    )
    .then(res => {
      this.props.dispatch(change('profile', 'add-dog-name', ''));
      this.props.dispatch(change('profile', 'add-dog-startDate', ''));
      this.props.dispatch(untouch('profile', 'add-dog-name'));
      this.props.dispatch(untouch('profile', 'add-dog-startDate'));
    })
    .catch(err => {
      console.error(err);
      throw err;
    });
  }
    

  _deleteDog = dogId =>
    API.deleteDogURL(dogId)
      .then(url =>
        fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ dogId: dogId })
        })
      )
      .catch(err => {
        console.error(err);
        throw err;
      });

  _renderDeleteDogButton = dogId => (
    <Button
      transparent
      title="Delete"
      textStyle={outlineButtonTextStyle}
      onPress={() => this._deleteDog(dogId)}
    />
  );

  _renderDogsTable = () => {
    const headers = ["Dogs", "", ""];
    let dogRows = [];

    this.state.dogs.map((dog, i) => {
      const dogId = dog._id;
      const rowData = [
        dog.name,
        this._renderViewDogButton(dogId),
        this._renderDeleteDogButton(dogId)
      ];

      dogRows.push(
        <View key={dogId} style={{ flexDirection: "row", marginLeft: 20 }}>
          {rowData.map((cellData, j) => {
            return (
              <Cell
                key={j}
                data={cellData}
                style={[
                  {
                    borderColor: "transparent",
                    width: 120,
                    height: 50
                  },
                  i % 2 == 0 ? null : oddTableRow
                ]}
                textStyle={{
                  fontSize: 18,
                  fontFamily: "montserrat"
                }}
              />
            );
          })}
        </View>
      );
    });

    return (
      <View>
        <Table
          style={{ ...styles.tableContainer, marginTop: 100 }}
          borderStyle={{ borderColor: "transparent" }}
        >
          <TableWrapper style={{ flexDirection: "row" }}>
            <Row
              data={headers}
              style={styles.tableHeader}
              textStyle={styles.tableHeaderText}
            />
          </TableWrapper>
          <ScrollView>{dogRows}</ScrollView>
        </Table>
        <View
          style={{
            flexDirection: "column",
            marginLeft: -10,
            height: "50%",
            alignItems: 'center'
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Field
              name="add-dog-name"
              component={this._renderAddDogNameField}
            />
            <Field
              name="add-dog-startDate"
              component={this._renderAddDogDateField}
            />
          </View>
          <Button
            title="Add Dog"
            buttonStyle={{ ...buttonStyle, width: 200, marginTop: 20 }}
            onPress={() => this._addDog()}
            textStyle={{ fontSize: 24 }}
          />
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          {this._renderTrainersTable()}
          {this._renderDogsTable()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(225,226,225)",
    alignItems: "center"
  },
  profileContainer: {
    flexDirection: "column",
    marginTop: 50,
    width: "90%",
    backgroundColor: "white",
    height: "90%"
  },
  tableContainer: {
    marginTop: 25,
    height: 300,
    width: "100%",
    marginLeft: 50,
    flexDirection: "column"
  },
  tableHeader: {
    borderColor: "transparent",
    borderBottomColor: "black",
    borderBottomWidth: 3,
    width: 500
  },
  tableHeaderText: {
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: 20,
    paddingLeft: 10,
    fontFamily: "montserrat"
  }
});

const selector = formValueSelector("profile");
export default connectReduxForm(
  "profile",
  ProfileScreen,
  state => ({
    addTrainerName: selector(state, "add-trainer"),
    addDogName: selector(state, "add-dog-name"),
    addDogStartDate: selector(state, "add-dog-startDtae")
  }),
  dispatch => ({
    loadProfile: () => dispatch({ type: actions.LOAD_USER_PROFILE }),
    addTrainer: trainerInfo =>
      dispatch({ type: actions.ADD_TRAINER, trainerInfo: trainerInfo })
  })
);
