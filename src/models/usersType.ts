export type inputUserType = {
  login: string;
  password: string;
  email: string;
};

export type UserOutType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type UserDBType = {
  _id: string;
  login: string;
  hash: string;
  email: string;
  createdAt: string;
};

export type UserQueryInputType = {
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
  searchLoginTerm?: string | null;
  searchEmailTerm?: string | null;
};

export type UserSortData = {
  searchLoginTerm?: string | null;
  searchEmailTerm?: string | null;
  sortBy: string;
  sortDirection: "asc" | "desc";
  pageNumber: number;
  pageSize: number;
};

export type UserAccountDBType = {
  _id: string;
  accountData: {
    userName: string;
    email: string;
    passwordHash: string;
    created: string;
  };
  emailConfirmation: {
    confirmationCode: string;
    expirationDAte: Date;
    isConfirmed: boolean;
  };
};

export type UserAccountOutType = {
  id: string;
  accountData: {
    userName: string;
    email: string;
    created: string;
  };
  emailConfirmation: {
    confirmationCode: string;
    expirationDAte: Date;
    isConfirmed: boolean;
  };
};
