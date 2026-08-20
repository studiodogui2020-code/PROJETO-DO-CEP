import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';
import { ViaCEPResponse } from '../../types/cep';

interface AddressInfoProps {
  address: ViaCEPResponse | null;
}

export function AddressInfo({ address }: AddressInfoProps) {
  // Se ainda não houve consulta, ou o CEP consultado não existe, não renderiza nada.
  if (!address || address.erro) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Rua:</Text>
        <Text style={styles.value}>{address.logradouro}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Bairro:</Text>
        <Text style={styles.value}>{address.bairro}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Cidade:</Text>
        <Text style={styles.value}>{address.localidade}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>UF:</Text>
        <Text style={styles.value}>{address.uf}</Text>
      </View>
    </View>
  );
}