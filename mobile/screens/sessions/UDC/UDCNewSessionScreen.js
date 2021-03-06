import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView
} from 'react-native';
import {Text, Button, ButtonGroup, Divider} from 'react-native-elements';
import {Field, formValueSelector, change, untouch} from 'redux-form'

import {
    center,
    buttonStyle,
    buttonTextStyle,
    outlineButtonTextStyle
} from '../../../constants/Styles';
import {GeneralInfo, HidesInfo} from '../../../constants/SessionsConstants';
import {connectReduxForm, renderReduxDropdown, renderDropdown, request} from '../../../components/helpers';
import {UDCInfo} from '../../../constants/SessionsConstants';
import API from '../../../constants/Api';
import Colors from '../../../constants/Colors';
import {deleteUDCSession, saveUDCSession} from "../../../redux/actions/udc.actions";
import {guidGenerator} from "../../../redux/actions/connection.actions";

class UDCNewSessionScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            addedHides: {},
            addHideConcentration: '',
            addHideSize: '',
        };

        let previousHides = {};
        const sessionInfo = this.props.navigation.getParam('sessionInfo', false);
        console.log("sessionInfo", sessionInfo);

        //If data comes from server
        if (sessionInfo) {
            sessionInfo.hides.forEach(hide => {
                previousHides[hide.concentration] = {
                    ...previousHides[hide.concentration],
                    [hide.size]: {
                        location: hide.location,
                        isConcealed: hide.isConcealed,
                        placementArea: hide.placementArea,
                        placementHeight: hide.placementHeight
                    }
                }
            });
            this.state = {
                isNew: false,
                sessionId: sessionInfo.sessionId,
                addedHides: previousHides,
                isEditing: this.props.navigation.getParam('isEditing', false),
                createdAt: sessionInfo.createdAt,
                temperature: sessionInfo.temperature,
                humidity: sessionInfo.humidity,
                wind: sessionInfo.wind,
                'Wind Direction': sessionInfo.windDirection
            }
        } else {
            //We are creating a new session
            const localID = guidGenerator();
            this.state = {
                isNew: true,
                sessionId: localID,
                addedHides: {},
                isEditing: false,
                createdAt: new Date(),
                temperature: null,
                humidity: null,
                wind: null,
                'Wind Direction': null
            }
        }

    }

    _onSubmit = () => {

        let session = {
            isNew: this.state.isNew,
            temperature: this.state.temperature,
            humidity: this.state.humidity,
            wind: this.state.wind,
            windDirection: this.state['Wind Direction'],
            complete: false,
            sessionId: this.state.sessionId,
            createdAt: this.state.createdAt,
            hides: this.state.addedHides,

        };

        this.props.dispatch(saveUDCSession({sessionInfo: session}));
        this.props.navigation.navigate('UDC');
    };

    _updateGeneralState = (property, val) => this.setState({[property]: val})

    _renderGeneralForm = () => (
        <View style={{center, ...styles.fieldsContainer, height: '40%', marginTop: 30, flexDirection: 'row'}}>
            {Object.keys(UDCInfo.General).map(name =>
                <View style={{
                    marginTop: 30,
                    height: 100,
                    width: '23.5%',
                    marginLeft: 20,
                }} key={name}>
                    <Text style={styles.labelStyle}>{name[0].toUpperCase() + name.substr(1)}:</Text>
                    {renderReduxDropdown(
                        name,
                        UDCInfo.General[name],
                        {width: 150, height: 100},
                        this.state.isEditing ? val => this._updateGeneralState(name, val) : null,
                        this.state.isEditing ? this.state[name] : null,
                        20
                    )}
                </View>
            )}
        </View>
    )

    _renderAddedHides = () => (
        <View>
            <View style={center}>
                <Text h3>Added Hides</Text>
            </View>
            {
                Object.keys(this.state.addedHides).map(concentration => (
                    <View>
                        <Text h4 style={{marginLeft: 10}}>{concentration} mil.</Text>
                        {Object.keys(this.state.addedHides[concentration]).map(size => (
                            <View>
                                <Text style={{marginLeft: 30, fontSize: 22}}>{size} cm.</Text>
                                <View style={center}>
                                    {this._renderHideFields(concentration, size)}
                                </View>
                            </View>
                        ))}
                    </View>
                ))
            }
            <View style={center}>
                <Divider style={{backgroundColor: 'black', height: 2, width: '90%'}}/>
            </View>
        </View>
    )

    _renderAddHideButton = () => (
        <Button
            rounded
            title='Add a Hide'
            buttonStyle={buttonStyle}
            textStyle={buttonTextStyle}
            fontSize={22}
            rightIcon={{
                name: 'plus',
                type: "font-awesome",
                size: 26,
            }}
            containerViewStyle={{paddingBottom: 10, marginRight: 50}}
            onPress={() => this._addHide()}
        />
    );

    _renderAddHideTypeDropdowns = () => {
        const containerStyle = {flexDirection: 'column', width: '40%', ...center}
        const dropdownContainerStyle = {marginTop: -20, width: '100%'}

        return (
            <View style={{flexDirection: 'row', width: '55%', justifyContent: 'space-between', marginTop: 25}}>
                <View style={containerStyle}>
                    <Text style={styles.labelStyle}>Concentration:</Text>
                    {
                        renderDropdown(
                            this.state.addHideConcentration,
                            (concentration) => this.setState({addHideConcentration: concentration}),
                            UDCInfo.Hides.Measurements.Concentrations,
                            dropdownContainerStyle
                        )
                    }
                </View>
                <View style={containerStyle}>
                    <Text style={styles.labelStyle}>Size:</Text>
                    {
                        renderDropdown(
                            this.state.addHideSize,
                            (size) => this.setState({addHideSize: size}),
                            UDCInfo.Hides.Measurements.Sizes.map(size => size.replace('#', '.')),
                            dropdownContainerStyle
                        )
                    }
                </View>
            </View>
        );
    };

    _updateHideState = (concentration, size, property, value) => {
        this.setState(prevState => ({
            addedHides: {
                ...prevState.addedHides,
                [concentration]: {
                    ...prevState.addedHides[concentration],
                    [size]: {
                        ...prevState.addedHides[concentration][size],
                        [property]: value
                    }
                }
            }
        }))

    };

    _renderHideFields = (concentration, size, userIsAddingHide = false) => (
        <View
            style={{
                flexDirection: 'row',
                marginTop: 15,
                justifyContent: 'space-between',
                width: '90%'
            }}
        >
            <View style={{flexDirection: 'column', ...center}}>
                {/* Location */}
                <Text style={styles.labelStyle}>Location:</Text>
                {renderReduxDropdown(
                    `Hides.${concentration}.${size}.location`,
                    UDCInfo.Hides.Locations,
                    styles.dropdown,
                    userIsAddingHide ? null : location => this._updateHideState(concentration, size, 'location', location),
                    userIsAddingHide ? this.props.addHideLocation : this.state.addedHides[concentration][size].location
                )}
            </View>
            <View style={{flexDirection: 'column', ...center, marginBottom: 30}}>
                {/* Concealed */}
                <Text style={styles.labelStyle}>Concealed:</Text>
                <View>
                    <Field
                        name={`Hides.${concentration}.${size}.isConcealed`}
                        component={inputProps =>
                            <ButtonGroup
                                onPress={userIsAddingHide ? inputProps.input.onChange : isConcealed => this._updateHideState(concentration, size, 'isConcealed', isConcealed)}
                                selectedIndex={userIsAddingHide ? this.props.addHideIsConcealed : this.state.addedHides[concentration][size].isConcealed}
                                buttons={['No', 'Yes']}
                                textStyle={outlineButtonTextStyle}
                                containerStyle={{height: 40, width: 100}}
                            />
                        }
                    />
                </View>
            </View>
            {/* Placement Area */}
            <View style={{flexDirection: 'column', ...center}}>
                <Text style={styles.labelStyle}>Placement Area:</Text>
                {renderReduxDropdown(
                    `Hides.${concentration}.${size}.placementArea`,
                    UDCInfo.Hides.PlacementAreas,
                    styles.dropdown,
                    userIsAddingHide ? null : placementArea => this._updateHideState(concentration, size, 'placementArea', placementArea),
                    userIsAddingHide ? this.props.addHidePlacementArea : this.state.addedHides[concentration][size].placementArea
                )}
            </View>
            {/* Placement Height */}
            <View style={{flexDirection: 'column', ...center}}>
                <Text style={styles.labelStyle}>Placement Height:</Text>
                {renderReduxDropdown(
                    `Hides.${concentration}.${size}.placementHeight`,
                    UDCInfo.Hides.PlacementHeights,
                    styles.dropdown,
                    userIsAddingHide ? null : placementHeight => this._updateHideState(concentration, size, 'placementHeight', placementHeight),
                    userIsAddingHide ? this.props.addHidePlacementHeight : this.state.addedHides[concentration][size].placementHeight
                )}
            </View>
        </View>
    );

    _renderAddHideSection = () => (
        <View style={{marginTop: 20, ...center}}>
            {this._renderAddHideButton()}
            {this._renderAddHideTypeDropdowns()}
            {this._renderHideFields(null, null, true)}
        </View>
    );

    _onDeleteSession = () => {
        this.props.dispatch(deleteUDCSession({sessionId: this.state.sessionId}));
        this.props.navigation.navigate('UDC');
    };

    _renderSubmitBtn = () => {
        let width = this.state.isEditing ? 150 : 300;
        let createBtn = <Button
            raised
            rounded
            title={this.state.isEditing ? 'Edit' : 'Create'}
            onPress={this.props.handleSubmit(this._onSubmit)}
            fontSize={26}
            buttonStyle={{
                ...center,
                ...buttonStyle,
                marginLeft: 60,
                marginTop: 20,
                width: width
            }}
        />;

        let deleteBtn = <Button
            raised
            rounded
            title='Delete'
            onPress={() => this._onDeleteSession()}
            fontSize={26}
            buttonStyle={{
                ...center,
                ...buttonStyle,
                marginLeft: 60,
                marginTop: 20,
                width: width
            }}
        />;

        return (
            this.state.isEditing ?
                <View style={{flexDirection: 'row'}}>
                    {deleteBtn}
                    {createBtn}
                </View> :
                createBtn
        )
    };
    _resetFields = (fields) => {
        fields.forEach(field => {
            //reset the field's value
            this.props.dispatch(change('udc', field, ''));

            //reset the field's error
            this.props.dispatch(untouch('udc', field));
        });
    };

    _addHide = () => {
        const concentration = this.state.addHideConcentration;
        const size = this.state.addHideSize;
        const location = this.props.addHideLocation;
        const isConcealed = this.props.addHideIsConcealed;
        const placementArea = this.props.addHidePlacementArea;
        const placementHeight = this.props.addHidePlacementHeight;

        // should all the fields be required?
        if (!concentration || !size) {
            alert('You must specify a concentration and a size to add a hide.');
            return;
        }
        else if (!location) {
            alert('You must specify a location to add a hide.');
            return;
        }
        else if (this.state.addedHides[concentration] && this.state.addedHides[concentration][size]) {
            alert('You have already added this hide. Please edit the one above.');
            return;
        }

        // reset Add Hide section state
        this.setState({addHideConcentration: '', addHideSize: ''})
        this._resetFields([
            'Hides.null.null.location',
            'Hides.null.null.isConcealed',
            'Hides.null.null.placementArea',
            'Hides.null.null.placementHeight']);

        // store new hide
        this.setState(prevState => ({
            addedHides: {
                ...prevState.addedHides,
                [concentration]: {
                    ...prevState.addedHides[concentration],
                    [size]: {
                        location: location,
                        isConcealed: isConcealed,
                        placementArea: placementArea,
                        placementHeight: placementHeight
                    }
                }
            }
        }))
    };

    _renderHidesForm = () => (
        <View style={center}>
            <ScrollView
                style={{...styles.fieldsContainer, height: '89%', marginTop: -200}}
                keyboardShouldPersistTaps={'handled'}
            >
                {
                    Object.keys(this.state.addedHides).length > 0 ? this._renderAddedHides() : null
                }
                {this._renderAddHideSection()}
            </ScrollView>
            {this._renderSubmitBtn()}
        </View>
    );

    render = () => (
        <View style={styles.container}>
            <View>
                {this._renderGeneralForm()}
            </View>
            <View style={{marginTop: -20}}>
                {this._renderHidesForm()}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    fieldsContainer: {
        borderColor: Colors.darkGrey,
        borderRadius: 10,
        borderWidth: 8,
    },
    dropdown: {
        width: 150,
        height: 100,
        marginTop: -20
    },
    labelStyle: {
        fontWeight: 'bold',
        fontSize: 18
    }
});

const selector = formValueSelector('udc');
export default connectReduxForm(
    'udc',
    UDCNewSessionScreen,
    state => ({
        addHideLocation: selector(state, 'Hides.null.null.location'),
        addHideIsConcealed: selector(state, 'Hides.null.null.isConcealed'),
        addHidePlacementArea: selector(state, 'Hides.null.null.placementArea'),
        addHidePlacementHeight: selector(state, 'Hides.null.null.placementHeight'),
    })
)
