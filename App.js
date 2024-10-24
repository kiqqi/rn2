import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, View, Text } from 'react-native';
import ProfileScreen from './src/components/ProfileScreen';  // Importar pantalla de perfil
import DocumentScanner from './src/components/DocumentScanner';  // Importar componente para escanear
import * as AuthSession from 'expo-auth-session';

const Stack = createStackNavigator();

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';  // Asegúrate de usar tu ID de cliente

function HomeScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    },
    { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth' }
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      fetchUserInfo(authentication.accessToken);
    }
  }, [response]);

  const fetchUserInfo = async (token) => {
    const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userInfo = await res.json();
    setUserInfo(userInfo);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {userInfo ? (
        <>
          <Text>Welcome, {userInfo.name}</Text>
          <Text>Email: {userInfo.email}</Text>
          <Button title="Go to Profile" onPress={() => navigation.navigate('Profile')} />
        </>
      ) : (
        <Button disabled={!request} title="Login with Google" onPress={() => promptAsync()} />
      )}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="DocumentScanner" component={DocumentScanner} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
