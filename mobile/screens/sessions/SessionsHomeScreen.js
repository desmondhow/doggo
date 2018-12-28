import React from 'react';
import {
  ListView,
  StyleSheet,
  View,
} from 'react-native';
import Tile from '../../components/Tile';
import { connect } from 'react-redux';

const HomeScreen = class extends React.Component {

  componentWillMount() {
    this.fetchAllSessions(); 
  }

  fetchAllSessions() {
    // fetch(Api.getAllSessions).then((res) => {
      const ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      });
      this.setState({ dataSource: ds.cloneWithRows(["UDC", "Agility"]) });
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

const mapStateToProps = (state) => ({
  state
});
const mapDispatchToProps = (dispatch) => ({
  dispatch
});
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

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
