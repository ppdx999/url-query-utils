import { assertEquals } from "https://deno.land/std@0.200.0/assert/mod.ts";
import { get, parse, set } from "./utils.ts";

const test = Deno.test;

test("parse", () => {
  let url = "https://www.google.com/search?q=deno";

  assertEquals(parse(url), {
    path: "https://www.google.com/search",
    params: { q: "deno" },
  });
  assertEquals(get(url, "q"), "deno");
  assertEquals(
    set(url, { lang: "en" }),
    "https://www.google.com/search?q=deno&lang=en",
  );
  assertEquals(set(url, { q: "node" }), "https://www.google.com/search?q=node");

  url = "https://www.google.com/search";
  assertEquals(parse(url), {
    path: "https://www.google.com/search",
    params: {},
  });
  assertEquals(get(url, "q"), undefined);

  url = "https://www.google.com/search?q=deno&lang=en";
  assertEquals(parse(url), {
    path: "https://www.google.com/search",
    params: { q: "deno", lang: "en" },
  });
  assertEquals(get(url, "q"), "deno");
  assertEquals(
    set(url, { q: "node" }),
    "https://www.google.com/search?q=node&lang=en",
  );
  assertEquals(
    set(url, { lang: "zh" }),
    "https://www.google.com/search?q=deno&lang=zh",
  );
});
