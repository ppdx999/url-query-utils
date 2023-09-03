import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";
import {
  $env,
  $optional,
  $string,
  loader,
} from "https://raw.githubusercontent.com/ppdx999/deno-env-loader/main/mod.ts";

const [pkg, err] = loader(
  Deno.readTextFileSync("./NPM_PACKAGE").trim(),
  $env({
    version: $string,
    owner: $string,
    name: $string,
    repName: $optional($string),
  }),
);

if (err) {
  console.error(err);
  Deno.exit(1);
}

pkg.repName = pkg.repName ?? pkg.name;

const apiUrl = `https://api.github.com/repos/${pkg.owner}/${pkg.repName}`;

const result = await fetch(apiUrl);
if (result.status !== 200) {
  console.error(`Unable to fetch latest release from ${apiUrl}`);
  Deno.exit(1);
}

const repo = await result.json();
const description = repo.description;
const license = repo.license.spdx_id;

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: pkg.name,
    version: pkg.version,
    description,
    license,
    repository: {
      type: "git",
      url: `git+https://github.com/${pkg.owner}/${pkg.repName}.git`,
    },
    bugs: {
      url: `https://github.com/${pkg.owner}/${pkg.repName}/issues`,
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
