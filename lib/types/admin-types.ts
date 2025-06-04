import { User } from "@supabase/supabase-js";

export type UserRole = 'admin' | 'instructor' | 'student';

export interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  created_at?: string;
  last_login?: string;
  progress?: number;
  completed_modules?: number;
  total_modules?: number;
}

export interface CourseData {
  id: string;
  title: string;
  description?: string;
  phase: string;
  duration: string;
  status: 'published' | 'draft';
  order_index: number;
  created_at: string;
  updated_at: string;
  modules_count?: number;
  students_count?: number;
  completion_rate?: number;
}

export interface ModuleData {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  duration?: string;
  order_index: number;
  content?: string;
  created_at: string;
  updated_at: string;
}

export interface CouponData {
  id: string;
  code: string;
  discount_percent: number;
  max_uses: number | null;
  current_uses: number;
  valid_from: string;
  valid_until: string | null;
  created_at: string;
  created_by: string;
}

export interface ProgressData {
  user_id: string;
  course_id: string;
  module_id?: string;
  progress: number;
  completed: boolean;
  last_accessed: string;
}

export interface UserProgressSummary {
  user_id: string;
  full_name?: string;
  email: string;
  avatar_url?: string;
  total_progress: number;
  completed_modules: number;
  total_modules: number;
  last_activity: string;
}

export interface UserStatsData {
  total_users: number;
  active_users: number;
  completed_courses: number;
  average_completion_rate: number;
}

export interface CourseStatsData {
  total_courses: number;
  published_courses: number;
  total_modules: number;
  most_popular_course: {
    id: string;
    title: string;
    students_count: number;
  };
}

export type AdminTab = 'dashboard' | 'users' | 'courses' | 'coupons' | 'rgpd';

export interface DashboardData {
  userStats: UserStatsData;
  courseStats: CourseStatsData;
  recentActivities: {
    id: string;
    user_id: string;
    user_name: string;
    action_type: string;
    action_details: string;
    created_at: string;
  }[];
  activeExperiments: {
    id: string;
    name: string;
    status: string;
    variants: {
      name: string;
      conversion_rate: number;
    }[];
  }[];
}

import { AppError } from '@/error';

export interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  offlineMode: boolean;
  error: AppError | null;
  users: AdminUser[];
  courses: CourseData[];
  modules: ModuleData[];
  coupons: CouponData[];
  dashboardData?: DashboardData;
  loadUsers: () => Promise<void>;
  loadCourses: () => Promise<void>;
  loadModules: (courseId: string) => Promise<ModuleData[]>;
  loadDashboardData: () => Promise<void>;
  createCourse: (course: Partial<CourseData>) => Promise<CourseData | null>;
  updateCourse: (id: string, course: Partial<CourseData>) => Promise<CourseData | null>;
  deleteCourse: (id: string) => Promise<void>;
  createModule: (module: Partial<ModuleData>) => Promise<ModuleData | null>;
  updateModule: (id: string, module: Partial<ModuleData>) => Promise<ModuleData | null>;
  deleteModule: (id: string) => Promise<void>;
  loadCoupons: () => Promise<void>;
  createCoupon: (coupon: Partial<CouponData>) => Promise<CouponData | null>;
  updateCoupon: (id: string, coupon: Partial<CouponData>) => Promise<CouponData | null>;
  deleteCoupon: (id: string) => Promise<void>;
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
}