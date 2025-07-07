import { AUTH_ACCESS_TOKEN } from "@/constants";
import { ApolloLink } from "@apollo/client/core";
import { locale } from "@/utils/i18n";

export function generateTokenHeader() {
  const token = localStorage.getItem(AUTH_ACCESS_TOKEN);

  return token ? `Bearer ${token}` : null;
}

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext((context: { headers: any }) => ({
    headers: {
      ...context.headers,
      authorization: generateTokenHeader(),
      "Accept-Language": locale,
    },
  }));

  if (forward) return forward(operation);

  return null;
});

export { authMiddleware };
