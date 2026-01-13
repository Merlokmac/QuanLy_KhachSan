// utils/index.ts
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

// Format date
export const formatDate = (date: string | Date, formatStr: string = 'dd/MM/yyyy'): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: vi });
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

// Format number
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('vi-VN').format(num);
};

// Validate CCCD
export const validateCCCD = (cccd: string): boolean => {
  return /^[0-9]{12}$/.test(cccd);
};

// Validate phone
export const validatePhone = (phone: string): boolean => {
  return /^[0-9]{10}$/.test(phone);
};

// Get status color
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'Trống': 'bg-green-100 text-green-800',
    'Đang ở': 'bg-red-100 text-red-800',
    'Bảo trì': 'bg-yellow-100 text-yellow-800',
    'Đã đặt': 'bg-blue-100 text-blue-800',
    'Hoàn thành': 'bg-gray-100 text-gray-800',
    'Đã hủy': 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Calculate days between dates
export const calculateDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Show toast notification (simple implementation)
export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  // You can integrate with a toast library like react-toastify
  console.log(`[${type.toUpperCase()}] ${message}`);
  alert(message); // Simple fallback
};