import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface TitleProps {
  children: string;
}

export const Title: React.FC<TitleProps> = ({ children }) => (
  <Text style={styles.title}>{children}</Text>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
}); 