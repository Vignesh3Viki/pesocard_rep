require("ts-node").register({
  transpileOnly: true,
  compilerOptions: {
    module: "ES2020",
    moduleResolution: "node"
  }
});

require("./src/server.ts");
