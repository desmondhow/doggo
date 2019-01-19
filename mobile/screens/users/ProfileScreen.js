import React, { Component } from "react";
import { StyleSheet, View, ListView, ScrollView } from "react-native";
import { Text, Button, FormInput, Divider } from "react-native-elements";
import { Field, formValueSelector } from "redux-form";
import {
  Table,
  TableWrapper,
  Row,
  Cell,
  Col
} from "react-native-table-component";
import DatePicker from "react-native-datepicker";

import API from "../../constants/Api";
import { buttonStyle, oddTableRow, center, outlineButtonTextStyle } from "../../constants/Styles";
import * as actions from "../../redux/actions/index.actions";
import { connectReduxForm } from "../../components/helpers";

/**
 * Displays the Sign up form
 */
class ProfileScreen extends Component {

  componentDidMount() {
    // fetch profile every second
    this._loadProfile();
    this.interval = setInterval(
      () => this._loadProfile(),
      1 * 1000
    );  
  }

  _loadProfile = () => (
    API.loadProfileURL
    .then(url => (
      fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
    ))
    .then(res => res.json())
    .then(profile => {
      this.setState({ trainers: profile.user.trainers, dogs: profile.user.dogs })
    })
    .catch(err => {
      console.error(err);
      throw err;
    })
  )

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
    <Button
      transparent
      title='View'
      textStyle={outlineButtonTextStyle}
    />
  );

  _deleteTrainer = trainerId => (
    API.deleteTrainerURL(trainerId)
    .then(url => (   
      fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trainerId: trainerId })
      })
    ))
    .catch(err => {
      console.error(err);
      throw err;
    })
  )

  _renderDeleteTrainerButton = trainerId => (
    <Button
      transparent
      title='Delete'
      textStyle={outlineButtonTextStyle}
      onPress={() => this._deleteTrainer(trainerId)}
    />
  )

  _addTrainer = () => (
    API.addTrainerURL
    .then(url => (   
      fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trainerName: this.props.addTrainerName })
      })
    ))
    .catch(err => {
      console.error(err);
      throw err;
    })
  )

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
    )
  }

  _renderTrainersTable = () => {
    const headers = ["Trainer", "", ""];
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
                key={i + j}
                data={cellData}
                style={[
                  {
                    borderColor: "transparent",
                    width: 150,
                    height: 50,
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
      <Table
        style={styles.tableContainer}
        borderStyle={{ borderColor: "transparent" }}
      >
        <TableWrapper style={{ flexDirection: "row", marginTop: 20 }}>
          <Row
            data={headers}
            style={{
              borderColor: "transparent",
              borderBottomColor: "black",
              borderBottomWidth: 3,
              width: 500
            }}
            textStyle={{
              fontSize: 24,
              fontWeight: "bold",
              paddingBottom: 20,
              paddingLeft: 10,
              fontFamily: "montserrat"
            }}
          />
        </TableWrapper>
        <ScrollView>{trainerRows}</ScrollView>
        <View style={{ flexDirection: "row", marginLeft: -10, ...center }}>
          <Field
            name="add-trainer"
            component={this._renderAddTrainerField}
          />
          <Button 
            title="Add Trainer" 
            buttonStyle={buttonStyle}
            onPress={() => this._addTrainer()}
          />
        </View>
      </Table>
    );
  };

  _renderViewDogButton = dogName => {};

  _renderAddDogNameField = () => (
    <Field
      name="add-dog.name"
      component={inputProps => (
        <FormInput
          placeholder="Name"
          value={inputProps.input.value}
          onChangeText={inputProps.input.onChange}
          editable={true}
          maxLength={35}
          multiline={false}
          containerStyle={{ width: "40%" }}
        />
      )}
    />
  )

  _renderAddDogDateField = () => (
    <Field
      name="add-dog.startDate"
      component={inputProps => {
        const d = new Date();
        return (
          <DatePicker
            style={{ width: 200 }}
            date={inputProps.input.value}
            mode="date"
            placeholder="Start Date"
            format="YYYY-MM-DD"
            minDate="2015-01-01"
            maxDate={`${d.getFullYear()}-${d.getMonth() +
              1}-${d.getDate()}`}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                // display: "none",
                left: 0,
                top: 4,
                marginLeft: 10,
              },
              dateInput: {
                marginLeft: 36,
                marginTop: 10
              }
              // ... You can check the source to find the other keys.
            }}
            onDateChange={inputProps.input.onChange}
          />
        );
      }}
    />
  )
  
  _renderDogsTable = () => {
    const headers = ["Dog", "", ""];
    let dogRows = [];

    this.state.dogs.map((dog, i) => {
      const dogName = dog.name;
      const rowData = [dogName, this._renderViewDogButton(dogName)];

      dogRows.push(
        <View 
          key={dogName}
          style={{ flexDirection: "row", marginLeft: 20 }}
        >
          {rowData.map((cellData, j) => {
            return (
              <Cell
                key={j}
                data={cellData}
                style={[
                  {
                    borderColor: "transparent",
                    width: 100,
                    height: 50,
                    marginLeft: marginLeft
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
      <Table
        style={styles.tableContainer}
        borderStyle={{ borderColor: "transparent" }}
      >
        <TableWrapper style={{ flexDirection: "row", marginTop: 20 }}>
          <Row
            data={headers}
            style={{
              borderColor: "transparent",
              borderBottomColor: "black",
              borderBottomWidth: 3,
              width: 300
            }}
            textStyle={{
              fontSize: 24,
              fontWeight: "bold",
              paddingBottom: 20,
              paddingLeft: 10,
              fontFamily: "montserrat"
            }}
          />
        </TableWrapper>
        <ScrollView>{dogRows}</ScrollView>
        <View style={{ flexDirection: "column", marginLeft: -10, ...center }}>
          <View style={{flexDirection: 'row'}}>
            {this._renderAddDogNameField()}
            {this._renderAddDogDateField()}
          </View>
          <Button 
            title="Add Dog" 
            buttonStyle={{ ...buttonStyle, width: 300, marginTop: 20 }}
            
          />
        </View>
      </Table>
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
    height: "70%"
  },
  tableContainer: {
    marginTop: 25,
    height: 300,
    width: "100%",
    marginLeft: 50
  }
});

const selector = formValueSelector('profile')
export default connectReduxForm(
  "profile",
  ProfileScreen,
  state => ({
    addTrainerName: selector(state, 'add-trainer'),
  }),
  dispatch => ({
    loadProfile: () => dispatch({ type: actions.LOAD_USER_PROFILE }),
    addTrainer: trainerInfo => dispatch({ type: actions.ADD_TRAINER, trainerInfo: trainerInfo })
  })
);
