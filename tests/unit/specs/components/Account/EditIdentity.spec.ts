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
import { ActorType } from "@/types/enums";
import { FETCH_PERSON_OWNED } from "@/graphql/actor";

const queryResult = ref<any>(null);

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

const useQueryMock = vi.fn(() => ({
  result: queryResult,
  onError: vi.fn(),
  onResult: vi.fn(),
}));

vi.mock("@vue/apollo-composable", () => {
  return {
    useQuery: useQueryMock,
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
  queryResult.value = null;
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

describe("EditIdentity identity initialization", () => {
  it("loads existing person data on mount", async () => {
    // Pretend the Apollo cache already contains a person so the component
    // initializes with data immediately available.
    const personData = {
      id: "2",
      avatar: null,
      name: "John Smith",
      preferredUsername: "johnsmith",
      summary: "A summary",
      feedTokens: [],
      url: "",
      domain: null,
      type: ActorType.PERSON,
      suspended: false,
    };

    queryResult.value = { fetchPerson: personData };

    const wrapper = shallowMount(EditIdentity, {
      props: { isUpdate: true, identityName: "johnsmith" },
      global: { plugins: [router] },
    });

    await wrapper.vm.$nextTick();

    expect((wrapper.vm as any).identity.preferredUsername).toBe(
      personData.preferredUsername
    );
    expect((wrapper.vm as any).identity.name).toBe(personData.name);
  });

  it("fetches person data when not cached", async () => {
    const wrapper = shallowMount(EditIdentity, {
      props: { isUpdate: true, identityName: "johnsmith" },
      global: { plugins: [router] },
    });

    expect(useQueryMock).toHaveBeenCalledWith(
      FETCH_PERSON_OWNED,
      expect.any(Function),
      expect.any(Function)
    );

    // Initially the form is empty
    expect((wrapper.vm as any).identity.preferredUsername).toBe("");

    const personData = {
      id: "2",
      avatar: null,
      name: "John Smith",
      preferredUsername: "johnsmith",
      summary: "A summary",
      feedTokens: [],
      url: "",
      domain: null,
      type: ActorType.PERSON,
      suspended: false,
    };

    // Simulate network result arriving later
    queryResult.value = { fetchPerson: personData };
    await wrapper.vm.$nextTick();

    expect((wrapper.vm as any).identity.preferredUsername).toBe(
      personData.preferredUsername
    );
    expect((wrapper.vm as any).identity.name).toBe(personData.name);
  });
});
