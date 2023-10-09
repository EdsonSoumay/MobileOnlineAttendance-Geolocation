/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import ProfileScreen from './src/pages/ProfileScreen';
import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => ProfileScreen);
AppRegistry.registerComponent(appName, () => App);
