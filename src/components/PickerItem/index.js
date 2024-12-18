import { View, Text } from 'react-native'
import React from 'react'
import { Picker } from '@react-native-picker/picker';

export default function PickerItem({moedas, moedaSelecionada, onChange}) {

  let moedasItem = moedas.map((item, index) => {
    return <Picker.Item key={index} label={item.label} value={item.key} />
  } )


  return (
      <Picker selectedValue={moedaSelecionada} onValueChange={(valor) => onChange(valor)}>
        {moedasItem}
      </Picker>
  )
}