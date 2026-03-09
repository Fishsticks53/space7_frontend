import { useState } from "react";
import { Button, Text, View, StyleSheet, TextInput, Image } from "react-native";
import Screen from "../components/Screen";
import { useRouter } from "expo-router";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts,
  Outfit_400Regular,
  Outfit_600SemiBold,
  Outfit_700Bold
} from "@expo-google-fonts/outfit";


export default function MyDiscussion() {
  const [found,setFound]= useState(true);
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }

  const router = useRouter();
  return (
    <Screen>
      <View style={styles.top}>
        <Text style={styles.title}>Space7</Text>
        <Ionicons name="close" size={40} color="black" style={styles.top.close} onPress={()=>{router.push("/(tabs)")}} />
      </View>
      <View style={styles.topic}>
        <Text style={styles.topicText}>My Discussion</Text>
      </View>
      {found && <Image source={require('../assets/Discussion.png')} style={styles.image} resizeMode="contain"></Image>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top:{
    backgroundColor:"#27a6fd",
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    paddingHorizontal:15,
    paddingVertical:30,
    close:{
      backgroundColor:"#fc2e99",
      borderWidth:3,
      borderColor:'black',
      borderRadius:8,
    },
  },
  topic:{
      backgroundColor:"#feda00",
      borderWidth:1,
      borderColor:'black',
      paddingVertical:15,
    },
  title: {
    fontSize: 40,
    fontFamily: "Outfit_700Bold",
  },
  topicText: {
    fontSize: 32,
    fontFamily: "Outfit_700Bold",
    marginLeft:14,
  },
  image:{
    width:'100%',
    height:'70%'
  }
})
