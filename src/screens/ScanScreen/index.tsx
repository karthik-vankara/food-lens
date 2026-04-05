import React, { useState } from 'react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { ScreenNames, FoodItem, AnalysisError } from '../../types';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import { Typography, Button } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { analyzeFood } from '../../services/aiService';

type ScanNavProp = NativeStackNavigationProp<ScreenNames, 'Scan'>;

export const ScanScreen: React.FC = () => {
  const navigation = useNavigation<ScanNavProp>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setError(null);
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
      setError(null);
    }
  };

  const handleAnalyzeFood = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setError(null);

    try {
      const foodItem = await analyzeFood(selectedImage);
      navigation.navigate('Results', { foodItem });
    } catch (err) {
      const analysisError = err as AnalysisError;
      setError(analysisError.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearSelection = () => {
    setSelectedImage(null);
    setError(null);
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
          <View style={styles.imageWrapper}>
            <Image source={{ uri: selectedImage }} style={styles.preview} />
            <Button
              title="Clear"
              onPress={clearSelection}
              variant="secondary"
              icon={<Ionicons name="close-circle" size={18} color={COLORS.error} />}
              style={styles.clearButton}
            />
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={64} color={COLORS.textTertiary} />
            <Typography variant="bodySmall" color={COLORS.textTertiary} align="center">
              No image selected
            </Typography>
          </View>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Typography variant="bodySmall" color={COLORS.error} align="center">
            {error}
          </Typography>
        </View>
      )}

      <View style={styles.actions}>
        <View style={styles.cameraButtons}>
          <Button
            title="Take Photo"
            onPress={takePhoto}
            variant="secondary"
            icon={<Ionicons name="camera" size={18} color={COLORS.primary} />}
            disabled={isAnalyzing}
          />
          <Button
            title="Gallery"
            onPress={pickFromGallery}
            variant="secondary"
            icon={<Ionicons name="images" size={18} color={COLORS.primary} />}
            disabled={isAnalyzing}
          />
        </View>

        {selectedImage && !isAnalyzing && (
          <Button
            title="Analyze Food"
            onPress={handleAnalyzeFood}
            icon={<Ionicons name="sparkles" size={18} color={COLORS.white} />}
          />
        )}

        {isAnalyzing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Typography variant="bodySmall" color={COLORS.textSecondary} align="center">
              Analyzing food...
            </Typography>
          </View>
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
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  preview: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'cover',
  },
  clearButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
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
  errorContainer: {
    backgroundColor: COLORS.error + '15',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  actions: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  cameraButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
});
