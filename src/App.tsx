import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  useColorScheme,
  StyleSheet,
} from 'react-native';
import database, { FirebaseDatabaseTypes } from '@react-native-firebase/database';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface BackgroundStyle {
  backgroundColor: string;
}

const App: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [freezes, setFreezes] = useState<number | null>(null);
  const [isConectedInternet, setConectedInternet] = useState<boolean>(false);
  const reference = database().ref('/freeze');
  const internetReference = database().ref('/internetStatus');

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    const handleSnapshot = (snapshot: FirebaseDatabaseTypes.DataSnapshot) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        const value: number = snapshot.val();
        setFreezes(value);
      }, 500);
    };

    const handelSnapshotInternet = (
      snapshot: FirebaseDatabaseTypes.DataSnapshot,
    ) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        const value: boolean = snapshot.val();
        setConectedInternet(value);
      }, 500);
    };

    reference.on('value', handleSnapshot);
    internetReference.on('value', handelSnapshotInternet);

    return () => {
      reference.off('value', handleSnapshot);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [internetReference, reference]);

  const backgroundStyle: BackgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Text style={styles.title}>
        {freezes !== null ? `${freezes}°C` : 'Cargando...'}
      </Text>
      <Text>{isConectedInternet ? 'Conectado' : 'desconectado'}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
});

export default App;
