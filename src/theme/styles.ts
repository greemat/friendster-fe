// Reusable style sheet
import { StyleSheet } from 'react-native';

// 🎨 Color palette
export const COLORS = {
  primary: '#4f46e5', // Indigo-600
  primaryDark: '#4338ca', // Darker indigo for buttons/active states
  background: '#f9f9f9',
  surface: '#ffffff',
  textPrimary: '#222222',
  textSecondary: '#666666',
  snackbar: '#333333',
  border: '#e5e5e5',
  modalBackdrop: 'rgba(0, 0, 0, 0.5)',
};

// 🧱 Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// 🪞 Shadows
export const SHADOW = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 12,
  elevation: 4,
};

// 💡 Typography
export const TYPOGRAPHY = {
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: COLORS.textPrimary,
  },
  body: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#ffffff',
  },
};

// 🧩 Global styles
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    ...SHADOW,
  },
  title: {
    ...TYPOGRAPHY.title,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  input: {
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    color: COLORS.textPrimary,
  },
  button: {
    marginTop: SPACING.lg,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    ...TYPOGRAPHY.button,
  },
  snackbar: {
    backgroundColor: COLORS.snackbar,
    borderRadius: 8,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: SPACING.md,
  },
  link: {
    marginTop: SPACING.sm,
    textAlign: 'center',
    color: COLORS.primary,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.modalBackdrop,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOW,
    width: '80%',
    transform: [{ scale: 0.95 }], // subtle scale for entry animation
  },
  modalTitle: {
    ...TYPOGRAPHY.subtitle,
    marginBottom: SPACING.sm,
    color: COLORS.primary,
  },
  modalMessage: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.md,
    color: COLORS.textPrimary,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  // Add to your createStyles function
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    alignSelf: 'center',
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#cccccc50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  imagePlaceholderText: {
    color: '#888888',
  },
});

