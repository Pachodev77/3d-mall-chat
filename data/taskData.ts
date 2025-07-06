export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  category: string;
  duration: string;
  featured: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  completionRate: number;
  imageUrl: string;
}

export const taskData: Task[] = [
  {
    id: 'task1',
    title: 'Complete 5-minute survey about shopping habits',
    description: 'Share your opinions about online shopping experiences and preferences in this short survey.',
    reward: 1.25,
    category: 'Surveys',
    duration: '5 min',
    featured: true,
    difficulty: 'easy',
    completionRate: 92,
    imageUrl: 'https://images.pexels.com/photos/6289065/pexels-photo-6289065.jpeg',
  },
  {
    id: 'task2',
    title: 'Test new fitness tracking app',
    description: 'Download and use this new fitness app for 3 days, then provide detailed feedback about your experience.',
    reward: 4.50,
    category: 'Apps',
    duration: '3 days',
    featured: true,
    difficulty: 'medium',
    completionRate: 78,
    imageUrl: 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg',
  },
  {
    id: 'task3',
    title: 'Watch promotional video',
    description: 'Watch a 2-minute video about a new product launch and answer 3 questions.',
    reward: 0.75,
    category: 'Videos',
    duration: '2 min',
    featured: false,
    difficulty: 'easy',
    completionRate: 95,
    imageUrl: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
  },
  {
    id: 'task4',
    title: 'Complete personality assessment',
    description: 'Answer a series of questions to determine your personality type for market research.',
    reward: 2.15,
    category: 'Surveys',
    duration: '15 min',
    featured: true,
    difficulty: 'medium',
    completionRate: 84,
    imageUrl: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg',
  },
  {
    id: 'task5',
    title: 'Sign up for free trial subscription',
    description: 'Create an account on a streaming service with a 7-day free trial (can cancel anytime).',
    reward: 3.00,
    category: 'Offers',
    duration: '10 min',
    featured: false,
    difficulty: 'easy',
    completionRate: 88,
    imageUrl: 'https://images.pexels.com/photos/3944311/pexels-photo-3944311.jpeg',
  },
  {
    id: 'task6',
    title: 'Play new mobile game for 30 minutes',
    description: 'Download and play a new strategy game, then provide feedback on gameplay experience.',
    reward: 2.50,
    category: 'Games',
    duration: '30 min',
    featured: true,
    difficulty: 'easy',
    completionRate: 91,
    imageUrl: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg',
  },
  {
    id: 'task7',
    title: 'Participate in user research interview',
    description: 'Join a 30-minute video call to discuss your experiences with food delivery services.',
    reward: 15.00,
    category: 'Surveys',
    duration: '30 min',
    featured: false,
    difficulty: 'hard',
    completionRate: 72,
    imageUrl: 'https://images.pexels.com/photos/3194519/pexels-photo-3194519.jpeg',
  },
  {
    id: 'task8',
    title: 'Review product website and provide feedback',
    description: 'Visit a website for a new tech product and answer questions about the user experience.',
    reward: 1.85,
    category: 'Offers',
    duration: '8 min',
    featured: false,
    difficulty: 'easy',
    completionRate: 89,
    imageUrl: 'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg',
  },
];