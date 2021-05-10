/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useCallback, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {fetch as fetchSSL} from 'react-native-ssl-pinning';

async function sendAxiosData(image, setResponse) {
  setResponse('loading');
  try {
    const data = new FormData();
    data.append('file', {
      ...image,
    });
    const response = await axios({
      method: 'PUT',
      // Mockbin echoes the request data back
      url: 'http://mockbin.org/request',
      data,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });
    console.warn('SENT DATA', response.data);
    setResponse(response.data.postData && !!response.data.postData.params.file);
  } catch (e) {
    console.error(e);
    setResponse('error');
  }
}

async function sendSSLPinningData(image, setResponse) {
  setResponse('loading');
  try {
    const data = new FormData();
    console.log('image', image);
    data.append('file', {
      ...image,
      type: 'image/jpeg',
    });
    console.log('data', data);
    // Mockbin echoes the request data back
    const response = await fetchSSL('http://mockbin.org/request', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
      },
      disableAllSecurity: true, // for easier testing
      pkPinning: false, // for easier testing
      sslPinning: {
        certs: [], // for easier testing
      },
      body: {
        formData: data,
      },
    });
    const responseData =
      response.bodyString && response.bodyString.length > 0
        ? await response.json()
        : {};
    console.warn('SENT DATA', responseData);
    setResponse(responseData.postData && !!responseData.postData.params.file);
  } catch (e) {
    console.error(e);
    setResponse('error');
  }
}

const App: () => React$Node = () => {
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState(null);
  const selectImage = useCallback(() => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      setResponse(null);
      setImage({
        uri: image.path,
        type: image.mime,
        name: image.filename || 'IMAGEO1.JPG',
        fileName: image.filename || 'IMAGEO1.JPG',
      });
    });
  }, []);
  const sendAxios = useCallback(() => {
    sendAxiosData(image, setResponse);
  }, [image, setResponse]);
  const sendSSLPinning = useCallback(() => {
    sendSSLPinningData(image, setResponse);
  }, [image, setResponse]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View>
            <Text style={styles.text}>
              1. Select an image from the device/camera
            </Text>
            <TouchableOpacity onPress={selectImage} style={styles.button}>
              <Text style={styles.buttonText}>Select Image</Text>
            </TouchableOpacity>
          </View>
          {image && (
            <>
              <View>
                <Text style={styles.text}>Selected Image</Text>
                <Image source={image} style={styles.image} />
              </View>
              <Text style={styles.text}>
                2. Send Image and inspect request/response
              </Text>
              <View style={styles.inline}>
                <TouchableOpacity onPress={sendAxios} style={styles.button}>
                  <Text style={styles.buttonText}>Send via Axios</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={sendSSLPinning}
                  style={styles.button}>
                  <Text style={styles.buttonText}>Send via RNSSLPinning</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {response != null && (
            <>
              <Text style={styles.text}>Response</Text>
              <Text
                style={[
                  styles.response,
                  response !== 'loading' &&
                    (response && response !== 'error'
                      ? styles.responseGood
                      : styles.responseBad),
                ]}>
                {response === 'loading'
                  ? 'Sending'
                  : response === 'error'
                  ? 'Request errored!'
                  : response
                  ? 'File was sent!'
                  : 'File was not sent!'}
              </Text>
              {response !== 'loading' && (
                <Text style={styles.text}>
                  You can investigate the sent data in the console
                </Text>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.white,
    paddingTop: 50,
    height: '100%',
  },
  text: {
    textAlign: 'center',
    marginVertical: 10,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  response: {
    backgroundColor: 'rgb(233, 233, 235)',
    borderRadius: 5,
    padding: 5,
    color: '#909399',
    alignSelf: 'center',
    borderColor: '#909399',
    borderWidth: 1,
  },
  responseGood: {
    color: '#67C23A',
    backgroundColor: 'rgb(225, 243, 216)',
    borderColor: '#67C23A',
  },
  responseBad: {
    color: '#F56C6C',
    backgroundColor: 'rgb(253, 226, 226)',
    borderColor: '#F56C6C',
  },
  inline: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flex: 0,
    width: Dimensions.get('screen').width - 150,
    marginHorizontal: 10,
  },
  image: {
    width: 150,
    height: 200,
    alignSelf: 'center',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  button: {
    backgroundColor: Colors.dark,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 50,
    borderRadius: 5,
    color: '#FFFFFF',
  },
  buttonText: {
    color: Colors.white,
    textAlign: 'center',
  },
});

export default App;
