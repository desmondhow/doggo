import React from 'react';
import {
  ListView,
  StyleSheet,
  View,
} from 'react-native';
import Api from '../../constants/Api';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'UDC',
  };

  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    this.fetchCurrentUDCSessions();
  }

  fetchCurrentUDCSessions() {
    // fetch(Api.getCurrentUDCSessions)
    // .then((res) => {
      const ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      });
      this.setState({ currentSessionsDataSource: ds.cloneWithRows(["fdfd", "adada"]) });
    // })
    // .catch((err) => {
    //   console.log(err);
    // })
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.currentSessionsDataSource}
          renderRow={(rowData) => <Tile text={rowData}/>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  }
});
