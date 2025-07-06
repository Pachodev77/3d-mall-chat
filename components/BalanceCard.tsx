import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useEarnings } from '@/hooks/useEarnings';
import { Wallet, TrendingUp } from 'lucide-react-native';

export const BalanceCard: React.FC = () => {
  const { availableBalance, totalEarnings } = useEarnings();

  return (
    <View style={styles.card}>
      <View style={styles.balanceContainer}>
        <View style={styles.balanceSection}>
          <View style={styles.balanceIconContainer}>
            <Wallet size={22} color="#4CAF50" />
          </View>
          <View>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>${availableBalance.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.balanceSection}>
          <View style={styles.earningsIconContainer}>
            <TrendingUp size={22} color="#2196F3" />
          </View>
          <View>
            <Text style={styles.balanceLabel}>Total Earnings</Text>
            <Text style={styles.balanceAmount}>${totalEarnings.toFixed(2)}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.withdrawButton}>
          <Text style={styles.withdrawButtonText}>Withdraw</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.historyButton}>
          <Text style={styles.historyButtonText}>History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  balanceSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  earningsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  balanceLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  balanceAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#212121',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  withdrawButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  withdrawButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  historyButton: {
    flex: 1,
    backgroundColor: '#F1F3F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  historyButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#616161',
  },
});