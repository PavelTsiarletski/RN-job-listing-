import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../shared/navigation';
import { useGetJobsQuery } from './api';
import { JobCard } from './components';
import { useFavouriteToggle } from './hooks';
import { Job } from './types';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/store';

type JobsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Jobs'>;

export const JobsScreen = () => {
  const navigation = useNavigation<JobsScreenNavigationProp>();
  const { data: jobs = [], isLoading, error } = useGetJobsQuery();
  const toggleFavourite = useFavouriteToggle();
  const favouriteIds = useSelector((state: RootState) => state.favourites.ids);

  const renderJob = ({ item }: { item: Job }) => {
    const isFavourite = favouriteIds.includes(item.id);
    
    return (
      <JobCard
        job={item}
        isFavourite={isFavourite}
        onPress={() => navigation.navigate('JobDetails', { id: item.id })}
        onFavouritePress={() => toggleFavourite(item.id, isFavourite)}
      />
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading jobs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading jobs</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingVertical: 8,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
  },
}); 