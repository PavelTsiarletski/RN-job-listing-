import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

interface TabItemProps {
  name: string;
  icon: string;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const TabItem: React.FC<TabItemProps> = ({ icon, label, isActive, onPress }) => (
  <TouchableOpacity style={styles.tabItem} onPress={onPress}>
    <Text style={[styles.tabIcon, { color: isActive ? '#6366f1' : '#9ca3af' }]}>
      {icon}
    </Text>
    <Text style={[styles.tabLabel, { color: isActive ? '#6366f1' : '#9ca3af' }]}>
      {label}
    </Text>
    {isActive && <View style={styles.activeIndicator} />}
  </TouchableOpacity>
);

export const BottomTabNavigator: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const tabs = [
    {
      name: 'JobsList',
      icon: '💼',
      label: 'Jobs',
    },
    {
      name: 'Favourites',
      icon: '⭐',
      label: 'Favourites',
    },
    {
      name: 'Profile',
      icon: '👤',
      label: 'Profile',
    },
  ];

  const handleTabPress = (tabName: string) => {
    if (tabName === 'JobsList') {
      navigation.navigate('JobsList' as never);
    } else if (tabName === 'Favourites') {
      console.log('Navigate to Favourites');
    } else if (tabName === 'Profile') {
      console.log('Navigate to Profile');
    }
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TabItem
          key={tab.name}
          name={tab.name}
          icon={tab.icon}
          label={tab.label}
          isActive={route.name === tab.name}
          onPress={() => handleTabPress(tab.name)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 3,
    backgroundColor: '#6366f1',
    borderRadius: 2,
  },
}); 