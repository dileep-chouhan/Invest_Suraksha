import React from 'react';
import { View, StyleSheet } from 'react-native';
import CourseList from '../components/education/CourseList';
import Header from '../components/common/Header';
import { COLORS } from '../utils/constants';

const EducationScreen: React.FC<{ navigation: any }> = ({ navigation }) => (
  <View style={styles.container}>
    <Header title="Learn" />
    <CourseList navigation={navigation} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background }
});

export default EducationScreen;
