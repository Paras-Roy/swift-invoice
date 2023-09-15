import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Alert, Touchable } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        if (email && password) {
            try {
                await createUserWithEmailAndPassword(auth, email, password);
                if (auth.currentUser) {
                    console.log(auth.currentUser);
                }
            } catch (error) {
                console.log(error);
                Alert.alert('Signup Error', error.message);
            }
        }
    };

    const handleLogin = async () => {
        if (email && password) {
            try {
                await signInWithEmailAndPassword(auth, email, password);
                if (auth.currentUser) {
                    console.log(auth.currentUser);
                }
            } catch (error) {
                console.log(error);
                Alert.alert('Login Error', error.message);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../assets/bg.jpg')} style={styles.backgroundImage} />

            <View style={styles.card}>
                <Text style={styles.title}>Signup / Login</Text>
                <TextInput
                    placeholder="Email"
                    value={email}
                    autoCapitalize="none"
                    onChangeText={(value) => setEmail(value)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={(value) => setPassword(value)}
                    secureTextEntry
                    style={styles.input}
                />
                <View style={{ height: 20, flexDirection: 'row' }} />
                <TouchableOpacity style={styles.button} onPress={handleSignup}>
                    <Text>Signup</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 20,
        borderRadius: 10,
        width: '60%',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    button: {
        width: '100%',
        height: 40,
        backgroundColor: 'lightblue',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },

});

export default Signup;
