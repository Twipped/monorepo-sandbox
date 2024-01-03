import ts from "typescript";
import path from "node:path";

const __filename = path.resolve(new URL(import.meta.url).pathname);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..", "..") + "/";
const nodeModules = path.resolve(root, "node_modules") + "/";

const entryPath = path.resolve(__dirname, "context.jsx");
const program = ts.createProgram([entryPath], {
  lib: ["ESNext", "DOM"],
  jsx: "react-jsxdev",
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Node10,
  noImplicitAny: true,
  allowJs: true,
});
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const sourceFile = program.getSourceFile(entryPath);
const checker = program.getTypeChecker();
const sourceFileSymbol = checker.getSymbolAtLocation(sourceFile);
const exportTypes = checker.getExportsOfModule(sourceFileSymbol);

function showFlags(value, flags) {
  const matches = [];
  for (var prop in flags) {
    if (flags[prop] & value) {
      matches.push(prop);
    }
  }
  return matches;
}

function woParent({ parent, ...rest } = {}) {
  return rest;
}

const exports = {};
for (const e of exportTypes) {
  const exportName = e.escapedName;
  const declaration = e.declarations[0];
  const exportType = checker.getTypeOfSymbolAtLocation(e, declaration);

  const statement = sourceFile.statements.find(
    (s) => s.name?.text === exportName,
  );

  console.log(
    exportName,
    checker.typeToString(exportType),
    showFlags(e.flags, ts.SymbolFlags),
    showFlags(exportType.flags, ts.TypeFlags),
    showFlags(exportType.objectFlags, ts.ObjectFlags),
    showFlags(declaration.flags, ts.NodeFlags),
    woParent(declaration),
    woParent(declaration.typeExpression),
    ts.isJSDocTypedefTag(declaration),
    // exportType,
  );

  if (ts.isJSDocTypedefTag(declaration)) {
  }

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

console.log(exports);
