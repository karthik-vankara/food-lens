import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { ScreenNames, FoodItem } from '../../types';
import { COLORS, SPACING } from '../../theme';
import { Typography, Button } from '../../components';
import { Ionicons } from '@expo/vector-icons';

type ScanNavProp = NativeStackNavigationProp<ScreenNames, 'Scan'>;

const createMockFoodItem = (imageUri: string): FoodItem => ({
  id: Date.now().toString(),
  name: 'Grilled Chicken Salad',
  confidence: 0.85,
  portionSize: '1 serving',
  portionGrams: 250,
  nutrition: {
    calories: 320,
    protein: 28,
    carbs: 12,
    fat: 18,
    fiber: 4,
    vitamins: [
      { name: 'Vitamin A', amount: '15%', dailyValue: 15 },
      { name: 'Vitamin C', amount: '20%', dailyValue: 20 },
      { name: 'Vitamin D', amount: '10%', dailyValue: 10 },
      { name: 'Calcium', amount: '12%', dailyValue: 12 },
      { name: 'Iron', amount: '8%', dailyValue: 8 },
    ],
  },
  imageUrl: imageUri,
  scannedAt: new Date().toISOString(),
});

export const ScanScreen: React.FC = () => {
  const navigation = useNavigation<ScanNavProp>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const analyzeFood = () => {
    if (!selectedImage) return;
    const mockFoodItem = createMockFoodItem(selectedImage);
    navigation.navigate('Results', { foodItem: mockFoodItem });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2">Scan Food</Typography>
        <Typography variant="bodySmall" color={COLORS.textSecondary}>
          Take a photo or choose from your gallery
        </Typography>
      </View>

      <View style={styles.previewContainer}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.preview} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={64} color={COLORS.textTertiary} />
            <Typography variant="bodySmall" color={COLORS.textTertiary} align="center">
              No image selected
            </Typography>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <View style={styles.cameraButtons}>
          <Button
            title="Take Photo"
            onPress={takePhoto}
            variant="secondary"
            icon={<Ionicons name="camera" size={18} color={COLORS.primary} />}
          />
          <Button
            title="Gallery"
            onPress={pickFromGallery}
            variant="secondary"
            icon={<Ionicons name="images" size={18} color={COLORS.primary} />}
          />
        </View>

        {selectedImage && (
          <Button
            title="Analyze Food"
            onPress={analyzeFood}
            icon={<Ionicons name="sparkles" size={18} color={COLORS.white} />}
          />
        )}
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
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  preview: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'cover',
  },
  placeholder: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  actions: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  cameraButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
});
