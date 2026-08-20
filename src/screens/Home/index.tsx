import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { styles } from './styles';
import { api } from '../../services/api';
import { ViaCEPResponse } from '../../types/cep';
import { AddressInfo } from '../../components/AddressInfo';

export function Home() {
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState<ViaCEPResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function handleChangeCep(text: string) {
    // Remove tudo que não for dígito e trava em 8 caracteres.
    const onlyDigits = text.replace(/[^0-9]/g, '').slice(0, 8);
    setCep(onlyDigits);
  }

  async function handleSearch() {
    // CA01: não dispara busca com campo incompleto/vazio.
    if (cep.length !== 8) {
      return;
    }

    // CA03: evita clique duplo disparar duas buscas ao mesmo tempo.
    if (loading) {
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setAddress(null);

    try {
      const response = await api.get<ViaCEPResponse>(`${cep}/json/`);

      // Pegadinha da API: CEP inexistente retorna HTTP 200 com { erro: true }.
      if (response.data.erro) {
        setErrorMessage('CEP não encontrado.');
      } else {
        setAddress(response.data);
      }
    } catch (error) {
      // Aqui caem erros de rede de verdade (sem internet, timeout, servidor fora do ar).
      setErrorMessage('Não foi possível buscar o CEP. Tente novamente.');
    } finally {
      // finally garante que o loading sempre encerra, em sucesso OU erro (CA02).
      setLoading(false);
    }
  }

  const isButtonDisabled = loading || cep.length !== 8;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consulta de CEP</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o CEP (somente números)"
        keyboardType="numeric"
        value={cep}
        onChangeText={handleChangeCep}
        maxLength={8}
      />

      <TouchableOpacity
        style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
        onPress={handleSearch}
        disabled={isButtonDisabled}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Buscar</Text>
        )}
      </TouchableOpacity>

      {errorMessage !== '' && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      <AddressInfo address={address} />
    </View>
  );
}