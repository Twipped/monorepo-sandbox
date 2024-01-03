import ts from "typescript";
import path from "node:path";
import { expect } from "expect";
import test from "node:test";
import "./snapshots.mjs";

const __filename = path.resolve(new URL(import.meta.url).pathname);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..", "..") + "/";
const nodeModules = path.resolve(root, "node_modules") + "/";

test("found expected types", (t) => {
  const entryPath = path.resolve(__dirname, "types.tsx");
  const program = ts.createProgram([entryPath], {
    lib: ["ESNext", "DOM"],
    jsx: "react-jsxdev",
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Node10,
    noImplicitAny: true,
    allowJs: true,
  });

  const sourceFile = program.getSourceFile(entryPath);
  const checker = program.getTypeChecker();
  const sourceFileSymbol = checker.getSymbolAtLocation(sourceFile);
  const exportTypes = checker.getExportsOfModule(sourceFileSymbol);

  const exports = {};
  for (const e of exportTypes) {
    const exportName = e.escapedName;

    const statement = sourceFile.statements.find(
      (s) => ts.isTypeAliasDeclaration(s) && s.name.text === exportName,
    );

    const type = checker.getTypeAtLocation(statement);

    const fields = {};
    // Iterate over the `ts.Symbol`s representing Property Nodes of `ts.Type`
    for (const prop of type.getProperties()) {
      const name = prop.getName();
      const propType = checker.getTypeOfSymbolAtLocation(prop, e);
      const propTypeName = checker.typeToString(
        propType,
        undefined,
        ts.TypeFormatFlags.NoTruncation,
        // | ts.TypeFormatFlags.UseFullyQualifiedType
        // | ts.TypeFormatFlags.MultilineObjectLiterals
      );
      fields[name] = propTypeName
        .replaceAll(nodeModules, "")
        .replaceAll(root, "");
    }

    exports[exportName] = fields;
  }

  expect.setState({ testPath: __filename, testTitle: t.name });
  expect(exports).toMatchSnapshot();
});
