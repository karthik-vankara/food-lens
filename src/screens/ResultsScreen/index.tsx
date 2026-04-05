import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenNames, FoodItem } from '../../types';
import { COLORS, SPACING } from '../../theme';
import { Typography, Card, Button } from '../../components';
import { Ionicons } from '@expo/vector-icons';

type ResultsRouteProp = RouteProp<ScreenNames, 'Results'>;
type ResultsNavProp = NativeStackNavigationProp<ScreenNames, 'Results'>;

export const ResultsScreen: React.FC = () => {
  const route = useRoute<ResultsRouteProp>();
  const navigation = useNavigation<ResultsNavProp>();
  const { foodItem } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Typography variant="h2">{foodItem.name}</Typography>
          <Typography variant="caption" color={COLORS.textSecondary}>
            {foodItem.portionSize} ({foodItem.portionGrams}g)
          </Typography>
        </View>

        <Card variant="elevated" style={styles.card}>
          <View style={styles.calorieContainer}>
            <Typography variant="h1" color={COLORS.primary}>
              {foodItem.nutrition.calories}
            </Typography>
            <Typography variant="bodySmall" color={COLORS.textSecondary}>
              calories
            </Typography>
          </View>
        </Card>

        <Card variant="outlined" style={styles.card}>
          <Typography variant="h3" style={styles.sectionTitle}>Macros</Typography>
          <View style={styles.macroGrid}>
            <MacroItem icon="barbell" label="Protein" value={`${foodItem.nutrition.protein}g`} />
            <MacroItem icon="restaurant" label="Carbs" value={`${foodItem.nutrition.carbs}g`} />
            <MacroItem icon="water" label="Fat" value={`${foodItem.nutrition.fat}g`} />
            <MacroItem icon="leaf" label="Fiber" value={`${foodItem.nutrition.fiber}g`} />
          </View>
        </Card>

        <Card variant="outlined" style={styles.card}>
          <Typography variant="h3" style={styles.sectionTitle}>Vitamins & Minerals</Typography>
          {foodItem.nutrition.vitamins.map((vitamin, index) => (
            <View key={index} style={styles.vitaminRow}>
              <Typography variant="bodySmall">{vitamin.name}</Typography>
              <View style={styles.vitaminInfo}>
                <Typography variant="bodySmall" color={COLORS.textSecondary}>
                  {vitamin.amount}
                </Typography>
                <Typography variant="caption" color={COLORS.success}>
                  {vitamin.dailyValue}% DV
                </Typography>
              </View>
            </View>
          ))}
        </Card>

        <View style={styles.actions}>
          <Button
            title="Save to History"
            onPress={() => {
              // TODO: Save to history
              navigation.navigate('Home');
            }}
            icon={<Ionicons name="save-outline" size={18} color={COLORS.white} />}
          />
          <View style={styles.spacer} />
          <Button
            title="Scan Another"
            onPress={() => navigation.navigate('Scan')}
            variant="outline"
            icon={<Ionicons name="refresh" size={18} color={COLORS.primary} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const MacroItem: React.FC<{ icon: keyof typeof Ionicons.glyphMap; label: string; value: string }> = ({ icon, label, value }) => (
  <View style={styles.macroItem}>
    <Ionicons name={icon} size={24} color={COLORS.primary} />
    <Typography variant="h3">{value}</Typography>
    <Typography variant="caption" color={COLORS.textSecondary}>{label}</Typography>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  card: {
    marginBottom: SPACING.md,
  },
  calorieContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  macroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  macroItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    gap: SPACING.xs,
  },
  vitaminRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  vitaminInfo: {
    alignItems: 'flex-end',
    gap: 2,
  },
  actions: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  spacer: {
    height: SPACING.sm,
  },
});
