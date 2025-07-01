import { config, shallowMount } from "@vue/test-utils";
import EditIdentity from "@/views/Account/children/EditIdentity.vue";
import { describe, it, expect, beforeEach, vi } from "vitest";
import Oruga from "@oruga-ui/oruga-next";
import {
  VueRouterMock,
  createRouterMock,
  injectRouterMock,
} from "vue-router-mock";
import { ref } from "vue";

// Mock dependencies used in EditIdentity to avoid network and apollo setup
vi.mock("@/composition/apollo/actor", () => ({
  useCurrentActorClient: () => ({
    currentActor: { value: { id: "1", preferredUsername: "john" } },
  }),
  useCurrentUserIdentities: () => ({ identities: { value: [] } }),
}));

vi.mock("@/composition/config", () => ({
  useAvatarMaxSize: () => 2000000,
}));

vi.mock("@/utils/image", () => ({
  buildFileFromIMedia: vi.fn().mockResolvedValue(null),
  buildFileVariable: vi.fn(() => ({})),
}));

vi.mock("@/utils/identity", () => ({
  changeIdentity: vi.fn(),
}));

vi.mock("@/plugins/dialog", () => ({
  Dialog: {},
}));

vi.mock("@/plugins/notifier", () => ({
  Notifier: {},
}));

vi.mock("@/utils/head", () => ({
  useHead: vi.fn(),
}));

vi.mock("@vue/apollo-composable", () => {
  return {
    useQuery: () => ({
      result: ref(null),
      onError: vi.fn(),
      onResult: vi.fn(),
    }),
    useMutation: () => ({ mutate: vi.fn(), onDone: vi.fn(), onError: vi.fn() }),
    useApolloClient: () => ({ resolveClient: vi.fn(() => ({ cache: {} })) }),
    DefaultApolloClient: Symbol("DefaultApolloClient"),
  };
});

config.global.plugins.push(Oruga);
config.plugins.VueWrapper.install(VueRouterMock);

const router = createRouterMock({
  spy: {
    create: (fn: any) => vi.fn(fn),
    reset: (spy: any) => spy.mockReset(),
  },
});

beforeEach(() => {
  injectRouterMock(router);
});

describe("EditIdentity action label", () => {
  it("shows update text when editing", () => {
    const wrapper = shallowMount(EditIdentity, {
      props: { isUpdate: true, identityName: "john" },
      global: { plugins: [router] },
    });

    expect(wrapper.find('button[type="button"]').text()).toBe(
      "Update my profile"
    );
  });

  it("shows create text when creating", () => {
    const wrapper = shallowMount(EditIdentity, {
      props: { isUpdate: false },
      global: { plugins: [router] },
    });

    expect(wrapper.find('button[type="button"]').text()).toBe(
      "Create my profile"
    );
  });
});
