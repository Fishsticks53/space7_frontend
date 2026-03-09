import { useState } from "react";
import { Button, Text, View, StyleSheet, TextInput } from "react-native";
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


export default function NewSpace() {
  const maxChars = 400;
  const [description, setDescription] = useState("");

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
        <Text style={styles.topicText}>New Topic</Text>
      </View>
      <View style={styles.titleCard}><Text style={{fontFamily:'Outfit_700Bold',fontSize:26,paddingHorizontal:10}}>Title</Text></View>
      <TextInput placeholder="  Enter topic title..." style={styles.titleInput}></TextInput>
      <View style={styles.descriptionCard}><Text style={{fontFamily:'Outfit_700Bold',fontSize:26,paddingHorizontal:10}}>Description</Text></View>
      <View style={styles.descriptionInput}>
        <TextInput
          style={styles.descriptionText}
          placeholder="Enter description..."
          placeholderTextColor="#6b6673"
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={maxChars}
          textAlignVertical="top"
        />
        <Text style={styles.counter}>
          {description.length} / {maxChars}
        </Text>
      </View>
      <View style={{position:'realtive'}}>
        <View style={styles.hastagTab}><Text style={{alignSelf:'center', marginTop:2, fontFamily:'Outfit_700Bold',fontSize:20}}>#Hastags</Text></View>
        <View style={styles.hastag}><TextInput placeholder="#Add Hastags" style={styles.search}></TextInput><FontAwesome5 name="plus" size={24} color="black" style={styles.search.plusIcon}/></View>
      </View>
      <View style={styles.statusIconSection}>
        <View style={[styles.statusIcon,{backgroundColor:"#5dd76d"}]}><Octicons name="globe" size={24} color="black" /><Text style={{fontFamily:'Outfit_700Bold', fontSize:22}}>Public</Text></View>
        <View style={[styles.statusIcon,{backgroundColor:"#fc2e99"}]}><MaterialIcons name="lock-outline" size={24} color="black" /><Text style={{fontFamily:'Outfit_700Bold', fontSize:22}}>Private</Text></View>
      </View>
      <View style={styles.createButton}><Text style={{fontFamily:'Outfit_700Bold',fontSize:26}}>Create</Text></View>
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
  titleCard:{
    backgroundColor:"#27a6fd",
    alignSelf:'flex-start',
    marginLeft:20,
    borderColor:'black',
    borderWidth:3,
    borderRadius:8,
    marginTop:20,
  },
  titleInput:{
    borderWidth:3,
    borderColor:'black',
    marginHorizontal:20,
    marginTop:20,
    borderRadius:10,
    backgroundColor:'#d3edfd',
    fontSize:20,
  },
  descriptionCard:{
    backgroundColor:"#fc2e99",
    alignSelf:'flex-start',
    marginLeft:20,
    borderColor:'black',
    borderWidth:3,
    borderRadius:8,
    marginTop:20,
  },
  descriptionInput:{
    borderWidth:3,
    borderColor:'black',
    marginHorizontal:20,
    marginTop:20,
    borderRadius:24,
    backgroundColor:'white',
    minHeight:170,
    paddingTop:18,
    paddingHorizontal:20,
    paddingBottom:40,
    position:'relative',
  },
  descriptionText:{
    fontSize:18,
    color:'#4f4957',
    minHeight:110,
    padding:0,
    margin:0,
    fontFamily:'Outfit_400Regular',
  },
  counter:{
    position:'absolute',
    right:18,
    bottom:14,
    fontSize:16,
    color:'#6f739d',
    fontFamily:'Outfit_400Regular',
  },
  hastag:{
    backgroundColor:"#feda00",
    borderWidth:2,
    borderColor:'black',
    marginTop:48,
    minHeight:100,
    marginHorizontal:20,
    borderRadius:20,
    borderTopStartRadius:0,
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    position:'relative',
    justifyContent:'center'

    
  },
  hastagTab:{
      backgroundColor:"#feda00",
      borderWidth:2,
      paddingHorizontal:10,
      borderColor:'black',
      marginTop:20,
      width:'auto',
      height:30,
      position:'absolute',
      marginLeft:20,
      borderRadius:10,
      zIndex:1,
      borderBottomWidth:0,
      borderBottomStartRadius:0,
      borderBottomEndRadius:0,
    },
    search:{
      backgroundColor:'white',
      width:'80%',
      paddingHorizontal:5,
      borderRadius:10,
      borderWidth:3,
      borderColor:'black',
      plusIcon:{
        backgroundColor:'#27a6fd',
        padding:8.5,
        borderRadius:5,
        borderWidth:2,
        borderRadius:10,
        marginLeft:10,
      }
    },
    statusIcon:{
      display:'flex',
      flexDirection:'row',
      gap:5,
      borderRadius:10,
      borderWidth:2,
      padding:10,
      alignItems:'center',
      paddingHorizontal:25,
      justifyContent:'center',
    },
    statusIconSection:{
      display:'flex',
      flexDirection:'row',
      justifyContent:'center',
      gap:70,
      marginTop:20,
    },
    createButton:{
      display:'flex',
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'#feda00',
      borderWidth:3,
      borderColor:'black',
      borderRadius:12,
      alignSelf:'center',
      marginTop:20,
      padding:10,
      paddingHorizontal:20,
    }
})
