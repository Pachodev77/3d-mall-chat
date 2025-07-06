export interface EarningsHistoryItem {
  id: string;
  title: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'rejected';
  type: 'task' | 'referral' | 'bonus';
}

export const earningsHistoryData: EarningsHistoryItem[] = [
  {
    id: 'earn1',
    title: 'Completed 5-minute survey',
    amount: 1.25,
    date: '2023-05-12T14:32:00Z',
    status: 'completed',
    type: 'task',
  },
  {
    id: 'earn2',
    title: 'Tested fitness tracking app',
    amount: 4.50,
    date: '2023-05-10T09:15:00Z',
    status: 'completed',
    type: 'task',
  },
  {
    id: 'earn3',
    title: 'Daily login bonus',
    amount: 0.25,
    date: '2023-05-09T08:00:00Z',
    status: 'completed',
    type: 'bonus',
  },
  {
    id: 'earn4',
    title: 'Referral: John Smith',
    amount: 5.00,
    date: '2023-05-08T17:45:00Z',
    status: 'completed',
    type: 'referral',
  },
  {
    id: 'earn5',
    title: 'Watched promotional video',
    amount: 0.75,
    date: '2023-05-07T13:20:00Z',
    status: 'completed',
    type: 'task',
  },
  {
    id: 'earn6',
    title: 'Personality assessment',
    amount: 2.15,
    date: '2023-05-06T11:05:00Z',
    status: 'completed',
    type: 'task',
  },
  {
    id: 'earn7',
    title: 'User research interview',
    amount: 15.00,
    date: '2023-05-06T10:30:00Z',
    status: 'pending',
    type: 'task',
  },
];