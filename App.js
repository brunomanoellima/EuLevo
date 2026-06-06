import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { EuLevoProvider } from './src/core/store/eulevo-store';
import { AppNavigator } from './src/core/navigation/app-navigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <EuLevoProvider>
          <AppNavigator />
        </EuLevoProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}