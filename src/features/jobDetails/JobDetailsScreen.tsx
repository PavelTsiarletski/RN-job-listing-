import React, { FC } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useGetJobDetailsQuery } from '../../shared/api/coopleApi';
import { addFavouriteAsync, removeFavouriteAsync } from '../favourites/favouritesSlice';
import { RootState, AppDispatch } from '../../shared/store';

// Types
type RootStackParamList = {
  JobDetails: { id: string };
  JobsList: undefined;
};

type JobDetailsRouteProp = RouteProp<RootStackParamList, 'JobDetails'>;

// Helper function to format salary/wage objects
const formatSalary = (salaryObj: any): string => {
  if (!salaryObj) return 'Not specified';
  
  if (typeof salaryObj === 'number') {
    return `CHF ${salaryObj}`;
  }
  
  if (typeof salaryObj === 'object' && salaryObj.amount) {
    const currencyMap: { [key: string]: string } = {
      '1': 'CHF',
      'CHF': 'CHF',
      'EUR': 'EUR',
      'USD': 'USD'
    };
    
    const currency = currencyMap[salaryObj.currencyId] || 'CHF';
    return `${currency} ${salaryObj.amount}`;
  }
  
  return String(salaryObj);
};

// Helper function to format field names to be more readable
const formatFieldName = (key: string): string => {
  const fieldNameMap: { [key: string]: string } = {
    workAssignmentName: 'Job Title',
    city: 'Location',
    jobLocation: 'Full Address',
    hourlyWage: 'Hourly Rate',
    salary: 'Annual Salary',
    description: 'Job Description',
    requirements: 'Requirements',
    responsibilities: 'Responsibilities',
    benefits: 'Benefits',
    company: 'Company',
    jobSkill: 'Required Skills',
    educationalLevel: 'Education Level',
    contractType: 'Contract Type',
    workload: 'Workload',
    periodFrom: 'Available From',
    periodTo: 'Available Until',
    datePublished: 'Date Published',
    firstShiftTo: 'First Shift Ends',
    firstShiftFrom: 'First Shift Starts',
    lastShiftTo: 'Last Shift Ends', 
    lastShiftFrom: 'Last Shift Starts',
    startDate: 'Start Date',
    endDate: 'End Date',
    applicationDeadline: 'Application Deadline',
    createdAt: 'Created',
    updatedAt: 'Last Updated',
  };
  
  return fieldNameMap[key] || key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

// Helper function to format timestamps to readable dates
const formatTimestamp = (timestamp: number): string => {
  try {
    const date = new Date(timestamp);
    // Check if it's a valid date
    if (isNaN(date.getTime())) {
      return String(timestamp);
    }
    
    // Format as DD.MM.YYYY HH:MM (European format)
    return date.toLocaleString('de-CH', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Zurich'
    });
  } catch (error) {
    return String(timestamp);
  }
};

// Helper function to format field values
const formatFieldValue = (key: string, value: any): string => {
  if (value === null || value === undefined) {
    return 'Not specified';
  }

  // Handle timestamp fields (dates)
  const dateFields = [
    'periodFrom',
    'periodTo', 
    'datePublished',
    'firstShiftTo',
    'firstShiftFrom',
    'lastShiftTo',
    'lastShiftFrom',
    'applicationDeadline',
    'startDate',
    'endDate',
    'createdAt',
    'updatedAt'
  ];
  
  if (dateFields.includes(key) && typeof value === 'number' && value > 1000000000000) {
    return formatTimestamp(value);
  }

  // Handle salary/wage objects
  if (key === 'hourlyWage' || key === 'salary') {
    return formatSalary(value);
  }

  // Handle job location
  if (key === 'jobLocation' && typeof value === 'object') {
    const parts = [];
    
    if (value.addressStreet && value.addressStreet.trim()) {
      parts.push(value.addressStreet);
    }
    
    if (value.extraAddress && value.extraAddress.trim()) {
      parts.push(value.extraAddress);
    }
    
    if (value.zip || value.city) {
      const cityPart = [value.zip, value.city].filter(Boolean).join(' ');
      if (cityPart.trim()) {
        parts.push(cityPart);
      }
    }
    
    // Map country ID to country name
    const countryMap: { [key: string]: string } = {
      '1': 'Switzerland',
      '2': 'Germany',
      '3': 'Austria',
      '4': 'France'
    };
    
    if (value.countryId && countryMap[value.countryId]) {
      parts.push(countryMap[value.countryId]);
    }
    
    return parts.length > 0 ? parts.join(', ') : 'Location not specified';
  }

  // Handle job skills
  if (key === 'jobSkill' && typeof value === 'object') {
    if (value.jobProfileId) {
      return `Profile ID: ${value.jobProfileId}` + 
             (value.educationalLevelId ? `, Education Level: ${value.educationalLevelId}` : '');
    }
  }

  // Handle boolean values
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  // Handle arrays
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : 'None specified';
  }
  
  // Handle complex objects
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }
  
  return String(value);
};

// Fields to hide from display (technical fields)
const hiddenFields = [
  'workAssignmentId',
  'waReadableId',
  'id'
];

// Important fields to highlight
const highlightFields = [
  'workAssignmentName',
  'city',
  'jobLocation',
  'hourlyWage',
  'salary',
  'description',
  'company',
  'periodFrom',
  'periodTo',
  'applicationDeadline'
];

export const JobDetailsScreen: FC = () => {
  const route = useRoute<JobDetailsRouteProp>();
  const dispatch = useDispatch<AppDispatch>();
  const favouriteIds = useSelector((state: RootState) => state.favourites.ids);
  
  const { id } = route.params;
  const { data, error, isLoading, refetch } = useGetJobDetailsQuery(id);
  
  const isFavourite = favouriteIds.includes(id);

  // Handle favourite toggle
  const handleFavouritePress = () => {
    if (isFavourite) {
      dispatch(removeFavouriteAsync(id));
    } else {
      dispatch(addFavouriteAsync(id));
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Job Details</Text>
          </View>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading job details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Job Details</Text>
          </View>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error loading job details</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // No data state
  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Job Details</Text>
          </View>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Job not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Filter and sort fields for better display
  const displayFields = Object.entries(data)
    .filter(([key]) => !hiddenFields.includes(key))
    .sort(([keyA], [keyB]) => {
      const aIsHighlight = highlightFields.includes(keyA);
      const bIsHighlight = highlightFields.includes(keyB);
      
      if (aIsHighlight && !bIsHighlight) return -1;
      if (!aIsHighlight && bIsHighlight) return 1;
      
      return highlightFields.indexOf(keyA) - highlightFields.indexOf(keyB);
    });

  // Main render
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
      {/* Header with favourite button */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Job Details</Text>
          <TouchableOpacity style={styles.favouriteButton} onPress={handleFavouritePress}>
            <Text style={[styles.favouriteIcon, { color: isFavourite ? '#ef4444' : '#d1d5db' }]}>
              ★
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

        {/* Job Title Card */}
        {data.workAssignmentName && (
          <View style={styles.titleCard}>
            <Text style={styles.jobTitle}>{data.workAssignmentName}</Text>
            {data.city && (
              <Text style={styles.jobLocation}>{data.city}</Text>
            )}
            {(data.hourlyWage || data.salary) && (
              <View style={styles.salaryContainer}>
                {data.hourlyWage && (
                  <Text style={styles.salaryText}>
                    💰 {formatSalary(data.hourlyWage)}/hour
                  </Text>
                )}
                {data.salary && (
                  <Text style={styles.salaryText}>
                    💼 {formatSalary(data.salary)}/year
                  </Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* Job details */}
        <View style={styles.detailsContainer}>
          {displayFields.map(([key, value]) => {
            const isHighlight = highlightFields.includes(key);
            
            // Skip if already shown in title card
            if (['workAssignmentName', 'city', 'hourlyWage', 'salary'].includes(key)) {
              return null;
            }
            
            return (
              <View key={key} style={[styles.fieldContainer, isHighlight && styles.highlightField]}>
                <Text style={[styles.fieldName, isHighlight && styles.highlightFieldName]}>
                  {formatFieldName(key)}
                </Text>
                <Text style={[styles.fieldValue, isHighlight && styles.highlightFieldValue]}>
                  {formatFieldValue(key, value)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Additional actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleFavouritePress}>
            <Text style={styles.actionButtonText}>
              {isFavourite ? '❤️ Remove from Favourites' : '🤍 Add to Favourites'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  favouriteButton: {
    padding: 8,
  },
  favouriteIcon: {
    fontSize: 24,
  },
  titleCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  jobLocation: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
  },
  salaryContainer: {
    marginTop: 8,
  },
  salaryText: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '600',
    marginBottom: 4,
  },
  detailsContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fieldContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  highlightField: {
    backgroundColor: '#f8faff',
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  fieldName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 6,
  },
  highlightFieldName: {
    fontSize: 16,
    color: '#6366f1',
  },
  fieldValue: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 22,
  },
  highlightFieldValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  actionsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  actionButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 