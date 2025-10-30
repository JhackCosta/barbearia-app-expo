import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types';
import DashboardScreen from '../screens/DashboardScreen';
import NovoClienteScreen from '../screens/NovoClienteScreen';
import ListaClientesScreen from '../screens/ListaClientesScreen';
import NovoAgendamentoScreen from '../screens/NovoAgendamentoScreen';
import HistoricoScreen from '../screens/HistoricoScreen';
import RelatoriosScreen from '../screens/RelatoriosScreen';
import ConfiguracoesScreen from '../screens/ConfiguracoesScreen';
import EditarClienteScreen from '../screens/EditarClienteScreen';
import ConfiguracoesPrecosScreen from '../screens/ConfiguracoesPrecosScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const { width } = Dimensions.get('window');

const HeaderWithLogo = () => {
  let logoSource;
  try {
    logoSource = require('../assets/images/logo-horizontal.png');
  } catch {
    logoSource = require('../assets/images/logo.jpeg');
  }

  return (
    <View style={styles.headerContainer}>
      <Image
        source={logoSource}
        style={styles.headerLogo}
        resizeMode="cover"
      />
    </View>
  );
};

const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTintColor: '#fff',
          headerTransparent: false,
          headerBackground: () => <HeaderWithLogo />,
        }}
      >
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name="NovoCliente"
          component={NovoClienteScreen}
          options={{ title: '👤 Novo Cliente' }}
        />
        <Stack.Screen
          name="ListaClientes"
          component={ListaClientesScreen}
          options={{ title: '📋 Clientes' }}
        />
        <Stack.Screen
          name="NovoAgendamento"
          component={NovoAgendamentoScreen}
          options={{title: '📅 Novo Agendamento'}}
        />
        <Stack.Screen
          name="Historico"
          component={HistoricoScreen}
          options={{title: '📜 Histórico'}}
        />
        <Stack.Screen
          name="Relatorios"
          component={RelatoriosScreen}
          options={{title: '📊 Relatórios'}}
        />
        <Stack.Screen
          name="Configuracoes"
          component={ConfiguracoesScreen}
          options={{title: '⚙️ Configurações'}}
        />
        <Stack.Screen
          name="EditarCliente"
          component={EditarClienteScreen}
          options={{title: '✏️ Editar Cliente'}}
        />
        <Stack.Screen
          name="ConfiguracoesPrecos"
          component={ConfiguracoesPrecosScreen}
          options={{title: '💰 Preços'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  headerLogo: {
    width: '100%',
    height: '100%',
  },
});

export default Navigation;
