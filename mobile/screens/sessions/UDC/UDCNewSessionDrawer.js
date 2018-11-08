import React from 'react'
import { createDrawerNavigator } from 'react-navigation';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';
import GeneralUDCScreen from './UDCGeneralScreen';


const DrawerContainer = (props) => {
  return (
    <View style={styles.container}>
      <Text
        onPress={() => this.props.navigate('GeneralUDCScreen')}
        style={styles.uglyDrawerItem}>
        General
      </Text>
    </View>
  );
}

const Drawer = createDrawerNavigator({
  GeneralUDCScreen: GeneralUDCScreen
}, {
  drawerWidth: 250,
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle',
  contentComponent: DrawerContainer,
});

export default class extends React.Component {
  render() {
    return (
      <Button text="Toggle" onPress={() => navigation.openDrawer()} buttonStyle={marginLeft=state.toggleDrawerButtonMargin}/>

      <Drawer />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    paddingTop: 40,
    paddingHorizontal: 20
  },
  uglyDrawerItem: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E73536',
    padding: 15,
    margin: 5,
    borderRadius: 2,
    borderColor: '#E73536',
    borderWidth: 1,
    textAlign: 'center'
  }
})