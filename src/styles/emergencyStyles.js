// src/styles/emergencyStyles.js
import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from './colors';

export const emergencyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  actionButtonDisabled: {
  backgroundColor: colors.textTertiary,
  opacity: 0.6,
},
  // Pantalla inicial
  emergencyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.large,
  },
  emergencyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.secondary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  locateButton: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    gap: spacing.sm,
    ...shadows.large,
  },
  locateButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.surface,
  },
  
  // Lista de veterinarias
  listContainer: {
    flex: 1,
  },
  listHeader: {
    backgroundColor: colors.surface,
    paddingTop: spacing.xl + 20,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.small,
  },
  listHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  listTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultCount: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  
  // Lista
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  
  // Card de veterinaria
  vetCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  vetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  vetTitleContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  vetName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  vetCategory: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeOpen: {
    backgroundColor: colors.success + '15',
  },
  badgeEmergency: {
    backgroundColor: colors.secondary + '15',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  badgeTextOpen: {
    color: colors.success,
  },
  badgeTextEmergency: {
    color: colors.secondary,
  },
  
  // Información de la veterinaria
  vetInfo: {
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  
  // Métricas
  metricsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: spacing.md,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  
  // Botones de acción
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  actionButtonPrimary: {
    backgroundColor: colors.primary,
  },
  actionButtonSecondary: {
    backgroundColor: colors.secondary,
  },
  actionButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.surface,
  },
  actionButtonTextOutline: {
    color: colors.primary,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.textSecondary,
  },
  
  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  retryButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
});