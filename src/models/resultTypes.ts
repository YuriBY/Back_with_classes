export type Result<T = null> = {
  code: number;
  errorMessage?: string;
  data?: T;
};
