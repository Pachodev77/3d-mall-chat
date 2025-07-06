import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DollarSign, ChevronRight, CircleCheck as CheckCircle2 } from 'lucide-react-native';
import { PaymentMethodCard } from '@/components/PaymentMethodCard';
import { useEarnings } from '@/hooks/useEarnings';
import { paymentMethods } from '@/data/paymentMethods';

export default function WithdrawScreen() {
  const { availableBalance } = useEarnings();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('paypal');

  const handleWithdraw = () => {
    // In a real app, this would send a request to process the withdrawal
    alert(`Withdrawal of $${amount} via ${selectedMethod} requested!`);
  };

  const isWithdrawEnabled = parseFloat(amount) > 0 && parseFloat(amount) <= availableBalance;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Withdraw</Text>
      </View>
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>${availableBalance.toFixed(2)}</Text>
          <Text style={styles.balanceInfo}>Minimum withdrawal: $5.00</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amount to Withdraw</Text>
          <View style={styles.amountInputContainer}>
            <DollarSign size={20} color="#757575" />
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <TouchableOpacity 
            style={styles.maxButton} 
            onPress={() => setAmount(availableBalance.toString())}
          >
            <Text style={styles.maxButtonText}>MAX</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          
          {paymentMethods.map(method => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              selected={selectedMethod === method.id}
              onSelect={() => setSelectedMethod(method.id)}
            />
          ))}

          <TouchableOpacity style={styles.addMethodButton}>
            <Text style={styles.addMethodText}>+ Add Payment Method</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Withdrawal Information</Text>
          <View style={styles.infoItem}>
            <CheckCircle2 size={16} color="#4CAF50" />
            <Text style={styles.infoText}>Withdrawals are processed within 24-48 hours</Text>
          </View>
          <View style={styles.infoItem}>
            <CheckCircle2 size={16} color="#4CAF50" />
            <Text style={styles.infoText}>Minimum withdrawal amount is $5.00</Text>
          </View>
          <View style={styles.infoItem}>
            <CheckCircle2 size={16} color="#4CAF50" />
            <Text style={styles.infoText}>No fees for withdrawals over $10.00</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.withdrawButton, !isWithdrawEnabled && styles.withdrawButtonDisabled]}
          onPress={handleWithdraw}
          disabled={!isWithdrawEnabled}
        >
          <Text style={styles.withdrawButtonText}>
            Withdraw ${amount ? parseFloat(amount).toFixed(2) : '0.00'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#212121',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  balanceLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#757575',
    marginBottom: 8,
  },
  balanceAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#212121',
    marginBottom: 8,
  },
  balanceInfo: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9E9E9E',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#212121',
    marginBottom: 16,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  amountInput: {
    flex: 1,
    height: 56,
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
    fontSize: 24,
    color: '#212121',
  },
  maxButton: {
    position: 'absolute',
    right: 32,
    top: 55,
    backgroundColor: '#F1F3F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  maxButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: '#2196F3',
  },
  addMethodButton: {
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E0E0E0',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  addMethodText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#2196F3',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#212121',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#424242',
    marginLeft: 12,
  },
  withdrawButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  withdrawButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  withdrawButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});