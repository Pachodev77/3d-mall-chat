import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowUp, ArrowDown, Calendar, DollarSign } from 'lucide-react-native';
import { EarningsChart } from '@/components/EarningsChart';
import { EarningsHistoryItem } from '@/components/EarningsHistoryItem';
import { useEarnings } from '@/hooks/useEarnings';

export default function EarningsScreen() {
  const { totalEarnings, weeklyEarnings, monthlyEarnings, earningsHistory } = useEarnings();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Earnings</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Calendar size={20} color="#424242" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.earningsOverview}>
          <Text style={styles.earningsLabel}>Total Earnings</Text>
          <Text style={styles.earningsAmount}>${totalEarnings.toFixed(2)}</Text>
          
          <View style={styles.earningsStats}>
            <View style={styles.statItem}>
              <View style={styles.statHeader}>
                <Text style={styles.statLabel}>This Week</Text>
                <View style={[styles.statIndicator, styles.statUp]}>
                  <ArrowUp size={12} color="#4CAF50" />
                  <Text style={styles.statIndicatorText}>12%</Text>
                </View>
              </View>
              <Text style={styles.statAmount}>${weeklyEarnings.toFixed(2)}</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <View style={styles.statHeader}>
                <Text style={styles.statLabel}>This Month</Text>
                <View style={[styles.statIndicator, styles.statUp]}>
                  <ArrowUp size={12} color="#4CAF50" />
                  <Text style={styles.statIndicatorText}>8%</Text>
                </View>
              </View>
              <Text style={styles.statAmount}>${monthlyEarnings.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Earnings Trend</Text>
            <View style={styles.timeFrameSelector}>
              <TouchableOpacity style={[styles.timeFrameButton, styles.activeTimeFrame]}>
                <Text style={styles.activeTimeFrameText}>Week</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.timeFrameButton}>
                <Text style={styles.timeFrameText}>Month</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.timeFrameButton}>
                <Text style={styles.timeFrameText}>Year</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <EarningsChart />
        </View>

        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {earningsHistory.map((item) => (
            <EarningsHistoryItem key={item.id} item={item} />
          ))}
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#212121',
  },
  calendarButton: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  earningsOverview: {
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
  earningsLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#757575',
    marginBottom: 8,
  },
  earningsAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#212121',
    marginBottom: 20,
  },
  earningsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#757575',
  },
  statIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statUp: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  statDown: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  statIndicatorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 2,
  },
  statAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#212121',
  },
  chartSection: {
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#212121',
  },
  timeFrameSelector: {
    flexDirection: 'row',
    backgroundColor: '#F1F3F6',
    borderRadius: 8,
    padding: 2,
  },
  timeFrameButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeTimeFrame: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  timeFrameText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#757575',
  },
  activeTimeFrameText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#212121',
  },
  historySection: {
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
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#2196F3',
  },
});