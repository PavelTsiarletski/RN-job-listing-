import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { JobsScreen } from '../features/jobs';
import { JobDetailsScreen } from '../features/jobDetails';

export type RootStackParamList = {
  Jobs: undefined;
  JobDetails: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0066cc',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Jobs" 
          component={JobsScreen} 
          options={{ title: 'Job Listings' }}
        />
        <Stack.Screen 
          name="JobDetails" 
          component={JobDetailsScreen} 
          options={{ title: 'Job Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 