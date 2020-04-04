import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    StatusBar,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Game from './src/screens/Game';

const Stack = createStackNavigator();

function Main() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <StatusBar barStyle="dark-content"/>
            <SafeAreaView>
                <Text>Main Screen</Text>
            </SafeAreaView>
        </View>
    );
}

const App: () => React$Node = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Game"
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="Main" component={Main}/>
                <Stack.Screen name="Game" component={Game}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({});

export default App;
