import { ApolloLink, execute, Observable } from "@apollo/client/core";
import gql from "graphql-tag";
import { describe, it, expect } from "vitest";
import { AUTH_ACCESS_TOKEN } from "@/constants";
import { authMiddleware, generateTokenHeader } from "@/apollo/auth";
import { locale } from "@/utils/i18n";

// Simple noop data for query execution
const TEST_QUERY = gql`
  query {
    __typename
  }
`;

describe("authMiddleware", () => {
  it("adds authorization and locale headers", async () => {
    localStorage.setItem(AUTH_ACCESS_TOKEN, "token");

    let capturedHeaders: Record<string, any> | undefined;
    const link = authMiddleware.concat(
      new ApolloLink((operation) => {
        capturedHeaders = operation.getContext().headers;
        return new Observable((observer) => {
          observer.next({ data: {} });
          observer.complete();
        });
      })
    );

    await new Promise<void>((resolve, reject) => {
      execute(link, { query: TEST_QUERY }).subscribe({
        next: () => {},
        error: reject,
        complete: () => resolve(),
      });
    });

    expect(capturedHeaders?.authorization).toBe(generateTokenHeader());
    expect(capturedHeaders?.["Accept-Language"]).toBe(locale);

    localStorage.clear();
  });

  it("preserves existing headers", async () => {
    localStorage.setItem(AUTH_ACCESS_TOKEN, "token");

    let capturedHeaders: Record<string, any> | undefined;
    const link = authMiddleware.concat(
      new ApolloLink((operation) => {
        capturedHeaders = operation.getContext().headers;
        return new Observable((observer) => {
          observer.next({ data: {} });
          observer.complete();
        });
      })
    );

    await new Promise<void>((resolve, reject) => {
      execute(link, {
        query: TEST_QUERY,
        context: { headers: { foo: "bar" } },
      }).subscribe({
        next: () => {},
        error: reject,
        complete: () => resolve(),
      });
    });

    expect(capturedHeaders?.authorization).toBe(generateTokenHeader());
    expect(capturedHeaders?.["Accept-Language"]).toBe(locale);
    expect(capturedHeaders?.foo).toBe("bar");

    localStorage.clear();
  });
});
