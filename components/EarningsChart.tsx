import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

// Mock data for chart
const chartData = [
  { day: 'Mon', amount: 1.75 },
  { day: 'Tue', amount: 4.25 },
  { day: 'Wed', amount: 2.50 },
  { day: 'Thu', amount: 6.75 },
  { day: 'Fri', amount: 3.80 },
  { day: 'Sat', amount: 8.50 },
  { day: 'Sun', amount: 4.75 },
];

const maxAmount = Math.max(...chartData.map(item => item.amount));

export const EarningsChart: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {chartData.map((item, index) => {
          const barHeight = (item.amount / maxAmount) * 150;
          return (
            <View key={index} style={styles.barContainer}>
              <View 
                style={[
                  styles.bar, 
                  { 
                    height: barHeight,
                    backgroundColor: item.amount === maxAmount ? '#4CAF50' : '#81C784' 
                  }
                ]} 
              />
              <Text style={styles.barLabel}>{item.day}</Text>
            </View>
          );
        })}
      </View>
      
      <View style={styles.horizontalLines}>
        <View style={styles.horizontalLine}>
          <Text style={styles.lineLabel}>${maxAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.horizontalLine}>
          <Text style={styles.lineLabel}>${(maxAmount / 2).toFixed(2)}</Text>
        </View>
        <View style={styles.horizontalLine}>
          <Text style={styles.lineLabel}>$0.00</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 220,
    marginTop: 12,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingHorizontal: 8,
  },
  barContainer: {
    alignItems: 'center',
    width: (Dimensions.get('window').width - 92) / 7,
  },
  bar: {
    width: 12,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 8,
  },
  horizontalLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    justifyContent: 'space-between',
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    paddingRight: 8,
    height: 1,
  },
  lineLabel: {
    position: 'absolute',
    left: 0,
    top: -10,
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: '#9E9E9E',
    width: 40,
    textAlign: 'left',
  },
});