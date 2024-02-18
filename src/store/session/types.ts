export type TSessionState = {
  user: TProfile;
  token: string | null;
  errors: Record<string, string[]>;
  waiting: boolean;
  exists: boolean;
};

export type TSessionConfig = {
  tokenHeader: string;
};
