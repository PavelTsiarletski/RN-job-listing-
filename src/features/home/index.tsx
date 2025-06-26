import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Title } from './components';
import { useHomeData } from './hooks';

export const HomeScreen = () => {
  const { data, loading } = useHomeData();
  return (
    <View style={styles.container}>
      <Title>Welcome to Feature-Based Expo App!</Title>
      {loading ? null : (
        <>
          <Title>{data?.title}</Title>
          <Text>{data?.description}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
}); 