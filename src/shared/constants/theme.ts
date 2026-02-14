export const COLORS = {
    primary: '#007AFF',
    background: '#F2F2F7',
    cardBackground: '#FFFFFF',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#C6C6C8',
    success: '#34C759',
    pending: '#FFC107',
    error: '#FF3B30',
} as const;

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
} as const;

export const TYPOGRAPHY = {
    title: {
        fontSize: 24,
        fontWeight: '700' as const,
    },
    body: {
        fontSize: 16,
        fontWeight: '400' as const,
    },
    caption: {
        fontSize: 14,
        fontWeight: '400' as const,
    },
} as const;