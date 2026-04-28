import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatCurrency } from '../../utils/formatters';

interface ResultRow {
  label: string;
  amount: number;
  highlight?: boolean;
  deduction?: boolean;
}

interface Props {
  title: string;
  rows: ResultRow[];
  totalLabel?: string;
  totalAmount?: number;
}

export function ResultCard({ title, rows, totalLabel, totalAmount }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {rows.map((row, i) => (
        <View key={i} style={styles.row}>
          <Text style={styles.label}>{row.label}</Text>
          <Text style={[
            styles.amount,
            row.highlight && styles.highlight,
            row.deduction && styles.deduction,
          ]}>
            {row.deduction ? '- ' : ''}{formatCurrency(row.amount)}원
          </Text>
        </View>
      ))}
      {totalLabel !== undefined && totalAmount !== undefined && (
        <>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.totalLabel}>{totalLabel}</Text>
            <Text style={styles.totalAmount}>{formatCurrency(totalAmount)}원</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  title: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 14, color: '#666' },
  amount: { fontSize: 14, color: '#333' },
  highlight: { color: '#1a73e8', fontWeight: '600' },
  deduction: { color: '#e53935' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 8 },
  totalLabel: { fontSize: 15, fontWeight: '700', color: '#222' },
  totalAmount: { fontSize: 15, fontWeight: '700', color: '#1a73e8' },
});
