import { ref } from "vue";
import { describe, it, expect } from "vitest";
import { asMediaInput } from "@/utils/image";
import type { IModifiableMedia } from "@/types/media.model";

const createMedia = (): IModifiableMedia => ({
  file: ref<File | null>(null),
  firstHash: null,
  hash: null,
});

describe("asMediaInput", () => {
  it("returns empty object when no file and no previous image", () => {
    const media = createMedia();
    const result = asMediaInput(media, "logo");
    expect(result).toEqual({});
  });

  it("returns null when clearing previous image", () => {
    const media = createMedia();
    media.firstHash = "hash";
    const result = asMediaInput(media, "logo", 1);
    expect(result).toEqual({ logo: null });
  });

  it("returns new media when file changed", () => {
    const media = createMedia();
    const file = new File([""], "test.png");
    media.file.value = file;
    media.firstHash = "hash1";
    media.hash = "hash2";
    const result = asMediaInput(media, "logo");
    expect(result).toEqual({
      logo: { media: { name: file.name, alt: "", file } },
    });
  });

  it("returns mediaId when file unchanged", () => {
    const media = createMedia();
    const file = new File([""], "test.png");
    media.file.value = file;
    media.firstHash = "hash";
    media.hash = "hash";
    const result = asMediaInput(media, "logo", 5);
    expect(result).toEqual({ logo: { mediaId: 5 } });
  });
});
