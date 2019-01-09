import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {Text, Button, ButtonGroup} from 'react-native-elements';
import {Field} from 'redux-form';

import {container, formContainer, center} from '../../../constants/Styles';
import {connectReduxForm, renderDropdown} from '../../../components/helpers';
import {HidesInfo} from '../../../constants/sessions/UDCConstants';
import Colors from '../../../constants/Colors';
import * as actions from '../../../redux/actions/index.actions';

class UDCHidesScreen extends React.Component {
    constructor(props) {
        super(props);
        this._renderForm = this._renderForm.bind(this);
        this.props.getInitialState();
    }

    _onSubmit = sessionInfo => {
        alert(JSON.stringify(sessionInfo));
        this.props.saveNewSession(sessionInfo);
        this.props.navigation.navigate('UDC');
    };

    _renderSubmitBtn = () => (
        <Button
            raised
            rounded
            title='Create'
            onPress={this.props.handleSubmit(this._onSubmit)}
            fontSize={26}
            buttonStyle={{
                ...center,
                marginLeft: 60,
                marginTop: 20,
                width: 300
            }}
            titleStyle={{
                fontSize: 20,
                fontWeight: 'bold'
            }}
        />
    );

    _renderHideFields = (concentration, size) => (
        <View style={{flexDirection: 'column', marginLeft: 30, ...center}}>
            <Text h4>{size.replace('#', '.')} cm.</Text>
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: 15,
                    justifyContent: 'space-between'
                }}
            >
                <View style={{flexDirection: 'column'}}>
                    {/* Location */}
                    <Text>Location:</Text>
                    {renderDropdown(
                        `hides.${concentration}.${size}.Location`,
                        HidesInfo.Locations,
                        styles.dropdown
                    )}
                </View>
                <View style={{flexDirection: 'column'}}>
                    {/* Concealed */}
                    <Text>Concealed:</Text>
                    <View>
                        <Field
                            name={`hides.${concentration}.${size}.Concealed`}
                            component={inputProps => {
                                const {
                                    input: {value, onChange}
                                } = inputProps;
                                return (
                                    <ButtonGroup
                                        onPress={onChange}
                                        selectedIndex={value}
                                        buttons={['No', 'Yes']}
                                        containerStyle={{height: 40, width: 100}}
                                    />
                                );
                            }}
                        />
                    </View>
                </View>
                {/* Placement Area */}
                <View style={{flexDirection: 'column'}}>
                    <Text>Placement Area:</Text>
                    {renderDropdown(
                        `hides.${concentration}.${size}.PlacementArea`,
                        HidesInfo.PlacementAreas,
                        styles.dropdown
                    )}
                </View>
                {/* Placement Height */}
                <View style={{flexDirection: 'column'}}>
                    <Text>Placement Height:</Text>
                    {renderDropdown(
                        `hides.${concentration}.${size}.PlacementHeight`,
                        HidesInfo.PlacementHeights,
                        styles.dropdown
                    )}
                </View>
            </View>
        </View>
    );

    _renderForm = () => (
        <View style={center}>
            <ScrollView
                style={styles.fieldsContainer}
                keyboardShouldPersistTaps={'handled'}
            >
                {HidesInfo.Hides.map(hideInfo =>
                    hideInfo.Concentrations.map(concentration => (
                        <View style={{flexDirection: 'column'}}>
                            <Text h3 style={{marginLeft: 20}}>
                                {concentration} mil.
                            </Text>
                            {hideInfo.Sizes.map(size =>
                                this._renderHideFields(concentration, size)
                            )}
                        </View>
                    ))
                )}
            </ScrollView>
            {this._renderSubmitBtn()}
        </View>
    );

    render = () => (
        <View style={container}>
            <View style={formContainer}>
                <Text h2>Hides</Text>
                {this._renderForm()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    field: {
        marginTop: 30,
        height: 100,
        flexDirection: 'column',
        paddingLeft: 65,
        paddingRight: 65
    },
    fieldsContainer: {
        marginLeft: 60,
        marginTop: 50,
        borderColor: Colors.darkGrey,
        borderRadius: 10,
        borderWidth: 8,
        height: '80%',
        width: '85%'
    },
    dropdown: {
        width: 150,
        height: 100,
        marginTop: -20
    }
});

export default connectReduxForm(
    'udc',
    UDCHidesScreen,
    state => ({
        initialValues: state.udc.hides
    }),
    dispatch => ({
        getInitialState: () =>
            dispatch({type: actions.GET_UDC_HIDES_INITIAL_STATE}),
        saveNewSession: sessionInfo =>
            dispatch({type: actions.SAVE_NEW_UDC_SESSION, sessionInfo: sessionInfo})
    })
);
