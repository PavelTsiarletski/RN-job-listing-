import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  onPress: () => void;
  onFavouritePress: () => void;
  isFavourite: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onPress, 
  onFavouritePress, 
  isFavourite 
}) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <View style={styles.header}>
      <Text style={styles.title}>{job.title}</Text>
      <TouchableOpacity onPress={onFavouritePress}>
        <Text style={styles.favourite}>{isFavourite ? '❤️' : '🤍'}</Text>
      </TouchableOpacity>
    </View>
    <Text style={styles.company}>{job.company}</Text>
    <Text style={styles.location}>{job.location}</Text>
    <Text style={styles.description} numberOfLines={2}>
      {job.description}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  favourite: {
    fontSize: 20,
  },
  company: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#333',
  },
}); 