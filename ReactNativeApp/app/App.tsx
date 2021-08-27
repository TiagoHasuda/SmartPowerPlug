/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import styled from "styled-components/native"
import { RemoteTurnOff, RemoteTurnOn } from './application/services';

import {
  Button,
} from "./presentation/components"

const Container = styled.View`
  height: 100%;
  justify-content: center;
  background-color: #329da8;
`

const SwitchContainer = styled.View`
  flex-direction: row;
  margin-left: auto;
  margin-right: auto;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  align-items: center;
`

const storageKey = "switch"

const App = () => {
  const [loading, setLoading] = useState(false)
  const [mySwitch, setSwitch] = useState(false)
  const isDarkMode = useColorScheme() === 'dark'
  const turnOn = new RemoteTurnOn()
  const turnOff = new RemoteTurnOff()

  const handleOn = async () => {
    setLoading(true)
    const resOrError = await turnOn.load()
    setLoading(false)
  }

  const handleOff = async () => {
    setLoading(true)
    const resOrError = await turnOff.load()
    setLoading(false)
  }

  const handleNetwork = async (value: boolean) => {
    setSwitch(value)
    await AsyncStorage.setItem(storageKey, value.toString())
  }

  return <Container>
    <SwitchContainer>
      <Text>Local</Text>
      <Switch
        onValueChange={handleNetwork}
        value={mySwitch}
      />
      <Text>Remote</Text>
    </SwitchContainer>
    <Button title="On" onPress={handleOn} loading={loading} />
    <Button title="Off" onPress={handleOff} loading={loading} />
  </Container>
};

export default App
