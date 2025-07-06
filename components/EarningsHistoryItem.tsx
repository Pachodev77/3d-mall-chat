import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, Check, X, Gift, UserPlus, FileText } from 'lucide-react-native';
import { EarningsHistoryItem as EarningsItem } from '@/data/earningsData';

interface EarningsHistoryItemProps {
  item: EarningsItem;
}

export const EarningsHistoryItem: React.FC<EarningsHistoryItemProps> = ({ item }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'rejected':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <FileText size={20} color="#2196F3" />;
      case 'referral':
        return <UserPlus size={20} color="#9C27B0" />;
      case 'bonus':
        return <Gift size={20} color="#FF9800" />;
      default:
        return <FileText size={20} color="#2196F3" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check size={16} color="#FFFFFF" />;
      case 'pending':
        return <Clock size={16} color="#FFFFFF" />;
      case 'rejected':
        return <X size={16} color="#FFFFFF" />;
      default:
        return <Check size={16} color="#FFFFFF" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.iconContainer,
          { backgroundColor: 
            item.type === 'task' 
              ? 'rgba(33, 150, 243, 0.1)' 
              : item.type === 'referral' 
                ? 'rgba(156, 39, 176, 0.1)' 
                : 'rgba(255, 152, 0, 0.1)' 
          }
        ]}
      >
        {getTypeIcon(item.type)}
      </View>
      
      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
      </View>
      
      <View style={styles.amountContainer}>
        <Text style={styles.amount}>+${item.amount.toFixed(2)}</Text>
        <View 
          style={[
            styles.statusContainer, 
            { backgroundColor: getStatusColor(item.status) }
          ]}
        >
          {getStatusIcon(item.status)}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F6',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#424242',
    marginBottom: 4,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#9E9E9E',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 4,
  },
  statusContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});