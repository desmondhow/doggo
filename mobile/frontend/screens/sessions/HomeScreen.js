import React from 'react';
import {
  ListView,
  StyleSheet,
  View,
} from 'react-native';
import Tile from '../../components/Tile'
import Api from '../../constants/Api';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Sessions',
  };

  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    this.fetchAllSessions(); 
  }

  fetchAllSessions() {
    // fetch(Api.getAllSessions).then((res) => {
      const ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      });
      this.setState({ dataSource: ds.cloneWithRows(["UDC", "Live Human Search"]) });
    // })
    // .catch((err) => {
          // console.log(err);
    // });
  }

  render() { 
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <ListView contentContainerStyle={styles.sessionsList}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <Tile text={rowData} onPress={() => navigate(rowData)}/>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  sessionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 100,
    marginTop: 30
  }
});
