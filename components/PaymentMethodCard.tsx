import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Check } from 'lucide-react-native';
import { PaymentMethod } from '@/data/paymentMethods';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  selected: boolean;
  onSelect: () => void;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ 
  method, 
  selected, 
  onSelect 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, selected && styles.selectedContainer]} 
      onPress={onSelect}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconPlaceholder}>{method.name.charAt(0)}</Text>
        </View>
        
        <View style={styles.details}>
          <Text style={styles.name}>{method.name}</Text>
          {method.accountInfo ? (
            <Text style={styles.accountInfo}>{method.accountInfo}</Text>
          ) : (
            <Text style={styles.accountInfo}>Not connected</Text>
          )}
        </View>
        
        <View style={[styles.checkbox, selected && styles.selectedCheckbox]}>
          {selected && <Check size={16} color="#FFFFFF" />}
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.infoText}>
          Min: ${method.minAmount.toFixed(2)} • Processing: {method.processingTime}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 12,
    overflow: 'hidden',
  },
  selectedContainer: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F1F3F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconPlaceholder: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#616161',
  },
  details: {
    flex: 1,
  },
  name: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#212121',
    marginBottom: 4,
  },
  accountInfo: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#757575',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckbox: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F1F3F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#9E9E9E',
  },
});