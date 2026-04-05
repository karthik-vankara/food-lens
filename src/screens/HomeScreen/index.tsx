import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenNames } from '../../types';
import { COLORS, SPACING } from '../../theme';
import { Typography, Button } from '../../components';
import { Ionicons } from '@expo/vector-icons';

type HomeNavProp = NativeStackNavigationProp<ScreenNames, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="scan-outline" size={48} color={COLORS.primary} />
        </View>
        <Typography variant="h1" color={COLORS.text}>FoodLens</Typography>
        <Typography variant="body" color={COLORS.textSecondary} align="center">
          Scan your food to discover calories, macros, and vitamins instantly
        </Typography>
      </View>

      <View style={styles.actions}>
        <Button
          title="Scan Food"
          onPress={() => navigation.navigate('Scan')}
          icon={<Ionicons name="camera" size={20} color={COLORS.white} />}
        />
        <View style={styles.spacer} />
        <Button
          title="View History"
          onPress={() => navigation.navigate('History')}
          variant="outline"
          icon={<Ionicons name="time-outline" size={20} color={COLORS.primary} />}
        />
      </View>

      <View style={styles.features}>
        <Typography variant="label" color={COLORS.textSecondary} align="center">
          Powered by AI vision analysis
        </Typography>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    gap: SPACING.md,
  },
  spacer: {
    height: SPACING.sm,
  },
  features: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: SPACING.xl,
  },
});
