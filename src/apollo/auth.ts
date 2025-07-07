import { AUTH_ACCESS_TOKEN } from "@/constants";
import { ApolloLink } from "@apollo/client/core";
import { i18n } from "@/utils/i18n";

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
      "Accept-Language": i18n.global.locale,
    },
  }));

  if (forward) return forward(operation);

  return null;
});

export { authMiddleware };
