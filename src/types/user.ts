export enum UserRole {
  ADMIN = 'admin',
  COACH = 'coach',
  STUDENT = 'student',
}

export enum PremiumStatusEnum {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export interface User {
  _id: string;
  name: string;
  phone: string;
  role: UserRole;
  isPremium: boolean;
  premiumStatus?: PremiumStatusEnum;
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  coachId?: string;
  coach?: {
    _id: string;
    name: string;
    phone: string;
  };
  premiumAt?: Date;
  premiumExpiresAt?: Date;
  studentCount?: number;
} 