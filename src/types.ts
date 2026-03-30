export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  interestedIn: 'male' | 'female' | 'both';
  bio?: string;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
  };
  photos?: string[];
  interests?: string[];
  occupation?: string;
  education?: string;
  role: 'user' | 'admin';
  isVerified?: boolean;
  isOnline?: boolean;
  lastSeen?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Like {
  fromUid: string;
  toUid: string;
  createdAt: Date;
}

export interface Match {
  id: string;
  users: string[];
  createdAt: Date;
  lastMessage?: string;
  lastMessageAt?: Date;
}

export interface Message {
  id: string;
  senderUid: string;
  text: string;
  createdAt: Date;
  read?: boolean;
}

export interface Report {
  id: string;
  reporterUid: string;
  reportedUid: string;
  reason: string;
  details?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: Date;
}
