import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import LocalFiles from './screens/LocalFiles';
import CloudFiles from './screens/CloudFiles';
import File from './screens/File';
import ViewOnly from './screens/ViewOnly';
import Signup from './screens/Signup';
import useAuth from './utils/useAuth';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Tab.Navigator initialRouteName="Local Files">
    <Tab.Screen name="Local Files" component={LocalFiles} options={{headerTitle:"Swift-Invoice"}}/>
    <Tab.Screen name="Cloud Files" component={CloudFiles} />
  </Tab.Navigator>
)

export default function App() {
  const {user} = useAuth();
  if (user) return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name = "Home" component={HomeStack} options={{ headerShown: false }} />
        <Stack.Screen name = "File" component={File} options={{ title: 'Invoice Editor' }}/>
        <Stack.Screen name = "ViewOnly" component={ViewOnly} options={{ title: 'Invoice Viewer' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
  else return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signup">
        <Stack.Screen name = "Signup" component={Signup} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
