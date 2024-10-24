import React, { useState, useEffect } from 'react';
import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const Tab = createBottomTabNavigator();

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost/backend/login.php', {
        email,
        password,
      });
      if (response.data.success) {
        alert('Login successful!');
      } else {
        alert('Login failed!');
      }
    } catch (error) {
      console.error('Login error', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#666"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#666"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const DocumentScanner = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannedDocument, setScannedDocument] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleScanDocument = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setScannedDocument(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan a Document</Text>
      {hasPermission === null ? (
        <Text style={styles.permissionText}>Requesting for camera permission</Text>
      ) : hasPermission === false ? (
        <Text style={styles.permissionText}>No access to camera</Text>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleScanDocument}>
          <Text style={styles.buttonText}>Scan Document</Text>
        </TouchableOpacity>
      )}
      {scannedDocument && (
        <Image source={{ uri: scannedDocument }} style={styles.image} />
      )}
    </View>
  );
};

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('address', address);

      if (image) {
        formData.append('profile_image', {
          uri: image,
          name: 'profile.jpg',
          type: 'image/jpeg',
        } as any);
      }

      await axios.post('http://localhost/backend/update-profile.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#666"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#666"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        placeholderTextColor="#666"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        placeholderTextColor="#666"
      />
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
    paddingLeft: 15,
    width: '100%',
    backgroundColor: '#fff',
    fontSize: 16,
  },
  image: {
    width: 180,
    height: 180,
    marginVertical: 18,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  permissionText: {
    fontSize: 16,
    color: '#d9534f',
    marginBottom: 18,
  },
});

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Login" component={LoginScreen} />
        <Tab.Screen name="Document Scanner" component={DocumentScanner} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

registerRootComponent(App);
