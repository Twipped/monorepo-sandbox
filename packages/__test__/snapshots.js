import path from "node:path";
import { expect } from "expect";
import {
  SnapshotState,
  toMatchSnapshot as toMatchSnapshotOriginal,
} from "jest-snapshot";

function toMatchSnapshot(actual) {
  const { testPath, testTitle } = this;
  const snapshotFile = path.resolve(
    path.dirname(testPath),
    "__snapshots__",
    path.basename(testPath, path.extname(testPath)) + ".snap.cjs", // snapshotter produces commonjs files
  );

  const snapshotState = new SnapshotState(snapshotFile, {
    updateSnapshot: process.env.SNAPSHOT ? "all" : "new",
  });

  const result = toMatchSnapshotOriginal.call(
    {
      snapshotState,
      currentTestName: testTitle,
    },
    actual,
  );

  // Write the new snapshot to disk, if its needed
  snapshotState.save();

  return result;
}

expect.extend({ toMatchSnapshot });
