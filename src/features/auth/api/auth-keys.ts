export const authKeys = {
  base: ["auth"] as const,
  signUp: () => [...authKeys.base, "sign-up"] as const,
} as const;
