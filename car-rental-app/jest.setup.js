// asyncstorage is a native module, so use the mock it ships
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// SafeAreaProvider renders nothing until it has measured real insets, which
// never happens under jest; the shipped mock supplies static ones. It is a
// default export, so unwrap it or every named import comes back undefined.
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);
