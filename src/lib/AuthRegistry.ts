export const AUTHORIZED_EMAILS = [
  "anaraquelrsf13@gmail.com",
  "felipperabelodurans2@gmail.com",
];

export const isAuthorized = (email: string | null | undefined) => {
  if (!email) return false;
  return AUTHORIZED_EMAILS.includes(email.toLowerCase());
};
