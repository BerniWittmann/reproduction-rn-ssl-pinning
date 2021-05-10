# Reproduction for RNSSLPinning Issue [#120]

This repository is a reproduction project for the following issue of the React-native ssl pinning library: https://github.com/MaxToyberman/react-native-ssl-pinning/issues/120

## Setup

Checkout the project

```
git clone https://github.com/BerniWittmann/reproduction-rn-ssl-pinning
```

Install dependencies

```
npm install
cd ios && pod install && cd ..
```

Start app

```
npm run ios
```

## Reproduction of Issue

The problem outlined in the issue in more detail, is that image files are not being sent when using the library.

In the example app click on `Select Image` and follow the steps to select an example image, then first try to send the image with a normal http request (in this example axios).
You can see in the app and in the console, that the image is being sent (the requested resource returns the whole request in the response). This request includes the file

Now when sending the same file with the RN SSL Pinning library, the request is being made, without any error message, but as can be observed the sent postData does not include the file.

You can see the flow in the video below

<video src="https://i.imgur.com/BKAKxCw.mp4" autoplay width=500 />