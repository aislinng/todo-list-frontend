import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {HomeScreen} from '../screens/home/HomeScreen';
import {ListDetailScreen}  from '../screens/lists/ListDetailScreen';
import  {ListFormScreen}  from '../screens/lists/ListFormScreen';
import  {TaskFormScreen}  from '../screens/tasks/TaskFormScreen';
import  {HomeStackParamList}  from '../types';
import  {colors}  from '../constants/theme';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: colors.bg },
    }}
  >
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="ListDetail" component={ListDetailScreen} />
    <Stack.Screen name="ListForm" component={ListFormScreen} />
    <Stack.Screen name="TaskForm" component={TaskFormScreen} />
  </Stack.Navigator>
);