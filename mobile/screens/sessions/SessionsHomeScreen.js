import React from 'react';
import {
  ListView,
  StyleSheet,
  View,
} from 'react-native';
import { Card, Button, Icon,  } from 'react-native-elements';
import { connect } from 'react-redux';
import { Sessions } from '../../constants/SessionsConstants';
import { buttonStyle, buttonTextStyle } from '../../constants/Styles';
import {isOnline} from "../../redux/actions/connection.actions";
import store from "../../redux/reduxConfig";

const HomeScreen = class extends React.Component {
    componentDidMount() {
        this.interval = setInterval(() => {
            let isConnected = isOnline(store.getState);
            this.props.navigation.setParams({isConnected: isConnected})
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

  render() { 
    console.disableYellowBox = true;
    const { navigate } = this.props.navigation;
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    const names = {
      'Obedience': 'OBD',
      'Live Human Search': 'LHS',
      'UDC': 'UDC',
      'Agility': 'Agility',
      'Noise': 'Noise',
    }

    return (
      <View style={styles.container}>
        <ListView contentContainerStyle={styles.sessionsList}
          dataSource={ds.cloneWithRows(Sessions)}
          renderRow={(rowData) => (
            <Card title={rowData}>
              <View style={{
                flexDirection: 'column', 
                height: 110,
                justifyContent: 'space-between'
                }}
              >
                <Button
                  buttonStyle={buttonStyle}
                  title='Create New Session'
                  textStyle={{...buttonTextStyle, fontSize: 20 }}
                  onPress={() => navigate(`${names[rowData]}NewSession`)} />
                <Button
                  buttonStyle={buttonStyle}
                  title='View Current Sessions' 
                  textStyle={{...buttonTextStyle, fontSize: 20 }}
                  onPress={() => navigate(names[rowData])} />
              </View>
            </Card>
          )}
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
