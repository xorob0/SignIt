import firebase from 'firebase';
require('firebase/firestore');

const config = {
  apiKey: 'AIzaSyA2zBzfHI7ekXXjjayg7f9x-JnVA5vsgqA',
  authDomain: 'signin-test-7500f.firebaseapp.com',
  databaseURL: 'https://signin-test-7500f.firebaseio.com',
  projectId: 'signin-test-7500f',
  storageBucket: 'signin-test-7500f.appspot.com',
  messagingSenderId: '215992674591',
  appId: '1:215992674591:web:a405357d05238a549a682a',
};

export const firestore = !firebase.apps.length
  ? firebase.initializeApp(config).firestore()
  : firebase.app().firestore();

export const storage = firebase.storage();
