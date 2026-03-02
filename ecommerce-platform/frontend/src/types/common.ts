// ============================================
// COMMON UTILITY TYPES
// ============================================

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingState {
  status: AsyncStatus;
  error?: string | null;
}

export interface FormState<T = any> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface FileWithPreview extends File {
  preview: string;
}

export type DateRange = {
  start: Date;
  end: Date;
};

export interface FilterOption {
  key: string;
  label: string;
  type: 'checkbox' | 'range' | 'select' | 'date';
  options?: SelectOption[];
}
