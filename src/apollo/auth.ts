import { AUTH_ACCESS_TOKEN } from "@/constants";
import { ApolloLink } from "@apollo/client/core";
import { i18n } from "@/utils/i18n";
import { getLocaleData } from "@/utils/auth";

export function generateTokenHeader() {
  const token = localStorage.getItem(AUTH_ACCESS_TOKEN);

  return token ? `Bearer ${token}` : null;
}

export function getCurrentLocale() {
  // First try to get from localStorage (user's explicit choice from footer)
  const savedLocale = getLocaleData();
  if (savedLocale) {
    return savedLocale;
  }

  // Fallback to current i18n locale
  return i18n.global.locale;
}

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext((context: { headers: any }) => ({
    headers: {
      ...context.headers,
      authorization: generateTokenHeader(),
      "Accept-Language": getCurrentLocale(),
    },
  }));

  if (forward) return forward(operation);

  return null;
});

export { authMiddleware };
