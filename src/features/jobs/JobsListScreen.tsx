import React, { FC, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { useGetJobsListQuery } from '../../shared/api/coopleApi';
import { addFavouriteAsync, removeFavouriteAsync } from '../favourites/favouritesSlice';
import { RootState, AppDispatch } from '../../shared/store';

// Types
interface JobListItem {
  workAssignmentId: string;
  workAssignmentName: string;
  city: string;
  hourlyWage: number | { amount: number; currencyId: string };
  company?: string;
}

type RootStackParamList = {
  JobDetails: { id: string };
  JobsList: undefined;
};

type JobsListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'JobsList'>;

interface JobItemProps {
  item: JobListItem;
  isFavourite: boolean;
  onPress: () => void;
  onFavouritePress: () => void;
}

// Helper function to get company initials
const getCompanyInitials = (company: string): string => {
  if (!company) return '??';
  return company
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

// Helper function to get company initial colors
const getInitialColor = (company: string): string => {
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  const index = company ? company.charCodeAt(0) % colors.length : 0;
  return colors[index];
};

// Helper function to format hourly wage
const formatHourlyWage = (wage: number | { amount: number; currencyId: string }): string => {
  if (typeof wage === 'number') {
    return `CHF ${wage}/hour`;
  }
  if (wage && typeof wage === 'object' && wage.amount) {
    const currency = wage.currencyId || 'CHF';
    return `${currency} ${wage.amount}/hour`;
  }
  return 'Salary not specified';
};

// Job Item Component
const JobItem: FC<JobItemProps> = ({ item, isFavourite, onPress, onFavouritePress }) => {
  const company = item.company || 'Company';
  const initials = getCompanyInitials(company);
  const backgroundColor = getInitialColor(company);

  return (
    <TouchableOpacity style={styles.jobCard} onPress={onPress}>
      <View style={styles.jobCardContent}>
        <View style={styles.jobCardLeft}>
          <View style={[styles.companyInitials, { backgroundColor }]}>
            <Text style={styles.initialsText}>{initials}</Text>
          </View>
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle}>{item.workAssignmentName}</Text>
            <Text style={styles.companyName}>{company}</Text>
            <Text style={styles.jobLocation}>
              {item.city} • {formatHourlyWage(item.hourlyWage)}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.favouriteButton} onPress={onFavouritePress}>
          <Text style={[styles.favouriteIcon, { color: isFavourite ? '#ef4444' : '#d1d5db' }]}>
            ★
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// Filter Tags Component
const FilterTags: FC = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const filters = ['Remote', 'Full-time', 'Engineering', 'Part-time', 'Contract'];

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.filtersContainer}
      contentContainerStyle={styles.filtersContent}
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.filterTag,
            selectedFilters.includes(filter) && styles.filterTagActive
          ]}
          onPress={() => toggleFilter(filter)}
        >
          <Text style={[
            styles.filterTagText,
            selectedFilters.includes(filter) && styles.filterTagTextActive
          ]}>
            {filter}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// Main Component
export const JobsListScreen: FC = () => {
  const navigation = useNavigation<JobsListScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const favouriteIds = useSelector((state: RootState) => state.favourites.ids);

  // State for pagination and search
  const [page, setPage] = useState(0);
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // API query
  const { data, error, isLoading, refetch } = useGetJobsListQuery(page);

  // Update jobs list when data changes
  useEffect(() => {
    if (data && Array.isArray(data)) {
      const processedJobs = data.map(job => ({
        ...job,
        company: `Company ${job.workAssignmentId.slice(-2)}`
      }));

      if (page === 0) {
        setJobs(processedJobs);
      } else {
        setJobs(prevJobs => [...prevJobs, ...processedJobs]);
      }
      
      setHasMore(data.length === 30);
    } else if (data && !Array.isArray(data)) {
      console.warn('API returned non-array data:', data);
      // If data is not an array, treat as empty
      setJobs([]);
      setHasMore(false);
    }
  }, [data, page]);

  // Handle favourite toggle
  const handleFavouritePress = (jobId: string) => {
    const isFavourite = favouriteIds.includes(jobId);
    
    if (isFavourite) {
      dispatch(removeFavouriteAsync(jobId));
    } else {
      dispatch(addFavouriteAsync(jobId));
    }
  };

  // Handle navigation to job details
  const handleJobPress = (jobId: string) => {
    navigation.navigate('JobDetails', { id: jobId });
  };

  // Handle load more
  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setPage(0);
    setJobs([]);
    setHasMore(true);
    refetch();
  };

  // Render job item
  const renderJobItem = ({ item }: { item: JobListItem }) => {
    const isFavourite = favouriteIds.includes(item.workAssignmentId);
    
    return (
      <JobItem
        item={item}
        isFavourite={isFavourite}
        onPress={() => handleJobPress(item.workAssignmentId)}
        onFavouritePress={() => handleFavouritePress(item.workAssignmentId)}
      />
    );
  };

  // Loading state
  if (isLoading && page === 0) {
    return (
      <View style={styles.containerWithHeader}>
        <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Job Listings</Text>
        </View>
        <View style={styles.contentArea}>
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>Loading jobs...</Text>
          </View>
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.containerWithHeader}>
        <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Job Listings</Text>
        </View>
        <View style={styles.contentArea}>
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>Error loading jobs</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Main render
  return (
    <View style={styles.containerWithHeader}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Job Listings</Text>
      </View>

      {/* Content Area */}
      <View style={styles.contentArea}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search jobs..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Filter Tags */}
        <FilterTags />

        {/* Jobs List */}
        <FlatList
          data={jobs}
          renderItem={renderJobItem}
          keyExtractor={(item, index) => `${item.workAssignmentId}-${index}`}
          contentContainerStyle={styles.listContainer}
          onRefresh={handleRefresh}
          refreshing={isLoading && page === 0}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => (
            <View style={styles.footer}>
              {isLoading && page > 0 && (
                <ActivityIndicator size="small" color="#6366f1" style={styles.loadingMore} />
              )}
              {!hasMore && jobs.length > 0 && (
                <Text style={styles.noMoreText}>No more jobs available</Text>
              )}
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  containerWithHeader: {
    flex: 1,
    backgroundColor: '#6366f1',
    paddingTop: 44, // Add padding for status bar on iOS
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  filtersContainer: {
    backgroundColor: '#ffffff',
    paddingBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 20,
  },
  filterTag: {
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    minWidth: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterTagActive: {
    backgroundColor: '#6366f1',
  },
  filterTagText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  filterTagTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  jobCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  jobCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  jobCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  companyInitials: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  initialsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  jobLocation: {
    fontSize: 14,
    color: '#6b7280',
  },
  favouriteButton: {
    padding: 8,
  },
  favouriteIcon: {
    fontSize: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingMore: {
    marginVertical: 16,
  },
  noMoreText: {
    fontSize: 14,
    color: '#9ca3af',
    marginVertical: 16,
  },
}); 