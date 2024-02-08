
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'expo-dev-client';

//pages
import SplashScreen from './Pages/SplashScreen';
import Dashboard from './Pages/DashboardScreen';
import AddStudent from './Pages/AddStudentPage';
import SearchPage from './Pages/SearchPage';
import SettingsPage from './Pages/SettingsPage';
import UserPage from './Pages/UserPage';
import StatisticsPage from './Pages/StatisticsPage';
import Authentication from './Pages/AuthenticationPage';
// import AboutPage from './Pages/AboutPage';

const Stack = createStackNavigator();

export default function App() {

  return (
    <>
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName={'Authentication'} >
          <Stack.Screen options={{ headerShown: false }} name="Authentication" component={Authentication} />
          <Stack.Screen options={{ headerShown: false }} name="SplashScreen" component={SplashScreen} />
          <Stack.Screen options={{ headerShown: false }} name="Dashboard" component={Dashboard} />
          <Stack.Screen name="AddStudent" options={{ headerTitle: 'Add Student' }} component={AddStudent} />
          <Stack.Screen name="Search" options={{ headerTitle: 'Search' }} component={SearchPage} />
          <Stack.Screen name="Settings" options={{ headerTitle: 'Settings' }} component={SettingsPage} />
          <Stack.Screen name="User" options={{ headerTitle: 'Update Student' }} component={UserPage} />
          <Stack.Screen name="Statistics" options={{ headerTitle: 'Statistics' }} component={StatisticsPage} />
          {/* <Stack.Screen name="About" options={{ headerShown: false }} component={AboutPage} /> */}
        </Stack.Navigator>
      </NavigationContainer >
    </>
  );
}

