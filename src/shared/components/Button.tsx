import { Pressable, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

export const Button = ({ title, onPress, backgroundColor }: {
  title: string,
  onPress: () => void,
  backgroundColor?: string
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        backgroundColor ? { backgroundColor } : undefined,
        pressed && { opacity: 0.8 }
      ]}
    >
      <Text style={styles.fabText}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});