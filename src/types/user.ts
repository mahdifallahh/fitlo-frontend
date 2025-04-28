export enum UserRole {
  STUDENT = 'student',
  COACH = 'coach',
  ADMIN = 'admin',
}

export enum PremiumStatusEnum {
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  PENDING = 'pending',
}

export interface User {
  _id: string;
  name: string;
  phone: string;
  role: UserRole;
  isPremium: boolean;
  premiumStatus?: PremiumStatusEnum;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
} 