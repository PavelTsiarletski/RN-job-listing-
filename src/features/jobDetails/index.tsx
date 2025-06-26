import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../shared/navigation';
import { useGetJobDetailsQuery } from './api';
import { useIsFavourite, useFavouriteToggle } from '../jobs/hooks';

type JobDetailsRouteProp = RouteProp<RootStackParamList, 'JobDetails'>;

export const JobDetailsScreen = () => {
  const route = useRoute<JobDetailsRouteProp>();
  const { id } = route.params;
  const { data: jobDetails, isLoading, error } = useGetJobDetailsQuery(id);
  const isFavourite = useIsFavourite(id);
  const toggleFavourite = useFavouriteToggle();

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading job details...</Text>
      </View>
    );
  }

  if (error || !jobDetails) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading job details</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{jobDetails.title}</Text>
          <TouchableOpacity onPress={() => toggleFavourite(id, isFavourite)}>
            <Text style={styles.favourite}>{isFavourite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.company}>{jobDetails.company}</Text>
        <Text style={styles.location}>{jobDetails.location}</Text>
        {jobDetails.salary && (
          <Text style={styles.salary}>{jobDetails.salary}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{jobDetails.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Requirements</Text>
        {jobDetails.requirements.map((req, index) => (
          <Text key={index} style={styles.listItem}>• {req}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Responsibilities</Text>
        {jobDetails.responsibilities.map((resp, index) => (
          <Text key={index} style={styles.listItem}>• {resp}</Text>
        ))}
      </View>

      {jobDetails.benefits && jobDetails.benefits.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefits</Text>
          {jobDetails.benefits.map((benefit, index) => (
            <Text key={index} style={styles.listItem}>• {benefit}</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  favourite: {
    fontSize: 24,
  },
  company: {
    fontSize: 18,
    color: '#666',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
  },
  salary: {
    fontSize: 16,
    color: '#0066cc',
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 4,
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