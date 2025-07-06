import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Timer, Star, ArrowUpRight } from 'lucide-react-native';
import { Task } from '@/data/taskData';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'hard':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.taskInfo}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskDescription} numberOfLines={2}>
            {task.description}
          </Text>
          
          <View style={styles.taskMeta}>
            <View style={styles.metaItem}>
              <Timer size={14} color="#757575" />
              <Text style={styles.metaText}>{task.duration}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <View 
                style={[
                  styles.difficultyDot, 
                  { backgroundColor: getDifficultyColor(task.difficulty) }
                ]}
              />
              <Text style={styles.metaText}>
                {task.difficulty.charAt(0).toUpperCase() + task.difficulty.slice(1)}
              </Text>
            </View>
            
            <View style={styles.metaItem}>
              <Star size={14} color="#757575" />
              <Text style={styles.metaText}>{task.completionRate}% completion</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.taskReward}>
          <Text style={styles.rewardAmount}>${task.reward.toFixed(2)}</Text>
          <View style={styles.taskCategory}>
            <Text style={styles.categoryText}>{task.category}</Text>
          </View>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Start</Text>
            <ArrowUpRight size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  taskInfo: {
    flex: 1,
    marginRight: 12,
  },
  taskTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#212121',
    marginBottom: 8,
  },
  taskDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
  },
  taskMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  metaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  taskReward: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  rewardAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#212121',
  },
  taskCategory: {
    backgroundColor: '#F1F3F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#616161',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  startButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginRight: 4,
  },
});