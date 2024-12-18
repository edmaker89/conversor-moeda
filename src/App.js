import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import PickerItem from './components/PickerItem';
import { useEffect, useState } from 'react';
import { api } from './services/api';

export default function App() {

  const [moedas, setMoedas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moedaSelecionada, setMoedaSelecionada] = useState(null);
  const [moedaBValor, setMoedaBValor] = useState('');

  const [valorConvertido, setValorConvertido] = useState(0);
  const [valorMoeda, setValorMoeda] = useState(0);


  async function converter() {
    if(moedaBValor === '' && moedaBValor === null && moedaBValor === undefined && moedaBValor === 0 && moedaSelecionada === null) {
      return;
    }

    const response = await api.get(`all/${moedaSelecionada}-BRL`);
    console.log(response.data[moedaSelecionada].ask);
    let resultado = (response.data[moedaSelecionada].ask * parseFloat(moedaBValor));
    setValorConvertido(`${resultado.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`);
    setValorMoeda(moedaBValor);
    Keyboard.dismiss();
  }
  
  useEffect(() => {
    async function loadMoedas() {
      const response = await api.get("all");
      let arrayMoedas = [];
      Object.keys(response.data).map((key) => {
        arrayMoedas.push({
          key: key,
          label: key,
          value: key
        })
      })

      setMoedas(arrayMoedas);
      setMoedaSelecionada(arrayMoedas[0].key);
      setLoading(false);
    }
    
    loadMoedas();
  }, [])

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#101215'}}>
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={{color: '#FFF', marginTop: 20}}>Carregando moedas...</Text>
      </View>
    )
  }else{
    return (
      <View style={styles.container}>
        <View style={styles.areaMoeda}>
          <Text style={styles.titulo}>Selecione sua moeda</Text>
          <PickerItem moedas={moedas} moedaSelecionada={moedaSelecionada} onChange={(moeda) => {
            setMoedaSelecionada(moeda)
            }}/>
        </View>
        <View style={styles.areaValor}>
            <Text style={styles.titulo}>Digite um valor para converter em (R$): </Text>
            <TextInput style={styles.input} placeholder="R$ 0,00" keyboardType='numeric'
              value={moedaBValor} onChangeText={(moeda) => setMoedaBValor(moeda)}
            />
        </View>
        <TouchableOpacity style={styles.botaoArea} onPress={converter}>
            <Text style={styles.botaoTexto}>Converter</Text>
        </TouchableOpacity>

        {
          valorConvertido !== 0 && (
            <View style={styles.areaResultado}>
            <Text style={styles.valorConvertido}>
              {valorMoeda} {moedaSelecionada}
            </Text>
            <Text style={{fontSize: 18, margin: 8, fontWeight: "500", color: "#000"}}>
              corresponde a
            </Text>
            <Text style={styles.valorConvertido}>
              {valorConvertido}
            </Text>
        </View>
          )}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101215',
    paddingTop: 40,
    alignItems: 'center',
  },
  areaMoeda: {
    backgroundColor: '#f9f9f9',
    width: "90%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 8,
    marginBottom: 1
  },
  titulo: {
      fontSize: 16,
      color: "#000000",
      fontWeight: "500",
      paddingLeft: 5,
      paddingTop: 5
    },
    areaValor: {
      backgroundColor: '#f9f9f9',
      width: "90%",
      padding: 8,
    },
    input: {
      width: "100%",
      fontSize: 18,
      color: "#000000",
      fontWeight: "500",
      padding: 8
    },
    botaoArea: {
      width: "90%",
      backgroundColor: "#Fb4b57",
      height: 45,
      alignItems: "center",
      justifyContent: "center",
      borderBottomRightRadius: 8,
      borderBottomLeftRadius: 8,
    },
    botaoTexto: {
      fontSize: 16,
      color: "#000",
      fontWeight: "bold"
    },
    areaResultado: {
      backgroundColor: "#fff",
      width: "90%",
      marginTop: 34,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      padding: 8
    },
    valorConvertido: {
      fontSize: 28,
      color: "#000",
      fontWeight: "bold"
    }
});
