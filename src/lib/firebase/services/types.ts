/** Successful service response */
export interface ServiceSuccess<T> {
  success: true;
  data: T;
}

/** Failed service response */
export interface ServiceError {
  success: false;
  error: string;
}

/** Union type returned by all service functions */
export type ServiceResponse<T> = ServiceSuccess<T> | ServiceError;
