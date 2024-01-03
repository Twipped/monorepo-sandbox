
type Expand<T> = T extends (...args: infer A) => infer R
  ? (...args: Expand<A>) => Expand<R>
  : T extends infer O
  ? { [K in keyof O]: O[K] }
  : never;

export type PackageA = typeof import('@example/monorepo-test-a');
export type PackageAExpanded = Expand<typeof import('@example/monorepo-test-a')>;
