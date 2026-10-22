import { describe, it } from "node:test";
import { strictEqual } from "node:assert";
const expect = (actual: unknown) => ({ toBe: (expected: unknown) => strictEqual(actual, expected) });
import { accessSchema, resourceSchema, isPublished, canDownload, csvCell, accessLimitIdentity } from "./knowledge";

const access = { resource_id: "11111111-1111-4111-8111-111111111111", full_name: "Juan Hernández", email: "juan@example.com" };
const resource = { title: "Guía empresarial", slug: "guia-empresarial", description: "Una guía práctica para empresas", category: "Ventas", resource_type: "pdf", status: "published", published_at: "2026-10-22T01:00:00Z", file_storage_key: "files/guia.pdf" };
describe("resource access rules", () => {
  it("requires a name", () => expect(accessSchema.safeParse({ ...access, full_name: " " }).success).toBe(false));
  it("requires an email", () => expect(accessSchema.safeParse({ ...access, email: "" }).success).toBe(false));
  it("rejects invalid email", () => expect(accessSchema.safeParse({ ...access, email: "juan@" }).success).toBe(false));
  it("allows omitted phone", () => expect(accessSchema.parse(access).phone).toBe(""));
  it("validates supplied phone with country code", () => expect(accessSchema.parse({ ...access, phone: "+52 669 932 6296" }).phone).toBe("+526699326296"));
  it("rejects malformed supplied phone", () => expect(accessSchema.safeParse({ ...access, phone: "123abc" }).success).toBe(false));
  it("trims and normalizes email", () => expect(accessSchema.parse({ ...access, email: " JUAN@example.com " }).email).toBe("juan@example.com"));
  it("defaults advertising consent off", () => expect(accessSchema.parse(access).marketing_consent).toBe(false));
  it("blocks honeypot spam", () => expect(accessSchema.safeParse({ ...access, website: "bot" }).success).toBe(false));
  it("never publishes a fileless PDF", () => expect(resourceSchema.safeParse({ ...resource, file_storage_key: "" }).success).toBe(false));
  it("external video is watch-only without a file", () => expect(resourceSchema.safeParse({ ...resource, resource_type: "video", video_url: "https://www.youtube.com/watch?v=video", file_storage_key: "", download_enabled: true }).success).toBe(false));
  it("allows external watch-only video", () => expect(resourceSchema.safeParse({ ...resource, resource_type: "video", video_url: "https://www.youtube.com/watch?v=video", file_storage_key: "", download_enabled: false }).success).toBe(true));
  it("does not grant download when owner disabled it", () => expect(canDownload({ resource_type: "video", file_storage_key: "video.mp4", download_enabled: false })).toBe(false));
  it("does not grant a download without a file", () => expect(canDownload({ resource_type: "video", file_storage_key: null, download_enabled: true })).toBe(false));
  it("excludes drafts", () => expect(isPublished({ status: "draft", published_at: "2026-10-20T00:00:00Z" }, Date.parse("2026-10-22T00:00:00Z"))).toBe(false));
  it("excludes future publications", () => expect(isPublished({ status: "published", published_at: "2026-10-23T00:00:00Z" }, Date.parse("2026-10-22T00:00:00Z"))).toBe(false));
  it("escapes spreadsheet formulas in prospect exports", () => expect(csvCell("=IMPORTDATA(\"url\")")).toBe('"\'=IMPORTDATA(""url"")"'));
  it("does not share the request allowance between unrelated visitors without an IP", () => expect(accessLimitIdentity(null, "one@example.com") === accessLimitIdentity(null, "two@example.com")).toBe(false));
});