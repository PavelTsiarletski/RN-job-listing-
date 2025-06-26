import React, { useEffect } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { JobsListScreen } from '../../features/jobs/JobsListScreen';
import { JobDetailsScreen } from '../../features/jobDetails/JobDetailsScreen';
import { BottomTabNavigator } from './BottomTabNavigator';
import { loadFavouritesAsync } from '../../features/favourites/favouritesSlice';
import { initFavoritesTable } from '../../features/favourites/favouritesStorage';
import { AppDispatch } from '../store';

// Define the parameter list for type safety
export type RootStackParamList = {
  JobsList: undefined;
  JobDetails: { id: string };
};

// Create the stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

// Deep linking configuration
const linking = {
  prefixes: ['myjobsapp://'],
  config: {
    screens: {
      JobsList: 'jobs',
      JobDetails: 'job/:id',
    },
  },
};

// Main screen wrapper with bottom tabs
const MainScreenWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={{ flex: 1 }}>
    {children}
    <BottomTabNavigator />
  </View>
);

export const AppNavigator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Initialize favourites on app start
  useEffect(() => {
    const initializeFavourites = async () => {
      try {
        // Initialize the SQLite table first
        await initFavoritesTable();
        // Then load favourites from database
        dispatch(loadFavouritesAsync());
      } catch (error) {
        console.error('Error initializing favourites:', error);
      }
    };

    initializeFavourites();
  }, [dispatch]);

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        id={undefined}
        initialRouteName="JobsList"
        screenOptions={{
          headerShown: false, // Remove default headers since we have custom ones
        }}
      >
        <Stack.Screen name="JobsList">
          {() => (
            <MainScreenWrapper>
              <JobsListScreen />
            </MainScreenWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen
          name="JobDetails"
          component={JobDetailsScreen}
          options={{
            headerShown: true,
            title: 'Job Details',
            headerStyle: {
              backgroundColor: '#6366f1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerBackTitle: 'Back',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 