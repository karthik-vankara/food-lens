import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenNames, FoodItem } from '../../types';
import { COLORS, SPACING } from '../../theme';
import { Typography, Card, Button } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/appStore';

type HistoryNavProp = NativeStackNavigationProp<ScreenNames, 'History'>;

export const HistoryScreen: React.FC = () => {
  const navigation = useNavigation<HistoryNavProp>();
  const { foodHistory, loadFoodHistory, clearFoodHistory } = useAppStore();

  useEffect(() => {
    loadFoodHistory();
  }, [loadFoodHistory]);

  const renderItem = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => navigation.navigate('Results', { foodItem: item })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
      <View style={styles.historyInfo}>
        <Typography variant="body">{item.name}</Typography>
        <Typography variant="caption" color={COLORS.textSecondary}>
          {item.portionSize} • {item.nutrition.calories} cal
        </Typography>
        <Typography variant="caption" color={COLORS.textTertiary}>
          {new Date(item.scannedAt).toLocaleDateString()}
        </Typography>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2">History</Typography>
        {foodHistory.length > 0 && (
          <Button
            title="Clear All"
            onPress={clearFoodHistory}
            variant="outline"
            icon={<Ionicons name="trash-outline" size={16} color={COLORS.error} />}
          />
        )}
      </View>

      {foodHistory.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={64} color={COLORS.textTertiary} />
          <Typography variant="h3" color={COLORS.textSecondary} style={styles.emptyTitle}>
            No scans yet
          </Typography>
          <Typography variant="bodySmall" color={COLORS.textTertiary} align="center">
            Your food scan history will appear here
          </Typography>
        </View>
      ) : (
        <FlatList
          data={foodHistory}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  list: {
    gap: SPACING.sm,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: SPACING.md,
  },
  historyInfo: {
    flex: 1,
    gap: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
  },
  emptyTitle: {
    marginTop: SPACING.md,
  },
});
