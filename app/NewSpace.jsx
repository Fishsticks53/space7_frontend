import { useState } from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import Screen from "../components/Screen";
import { useRouter } from "expo-router";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import {useAuth} from "../context/authContext";


import { useFonts,
  Outfit_400Regular,
  Outfit_600SemiBold,
  Outfit_700Bold
} from "@expo-google-fonts/outfit";


export default function NewSpace() {
  const maxChars = 400;
  const maxTags = 10;
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const {createSpaces} = useAuth();
  const [currentTag, setCurrentTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleTagChange = () => {
    const normalized = currentTag.replace(/^#/, "").trim();
    if (!normalized || tags.length >= maxTags || tags.includes(normalized)) {
      return;
    }
    setTags((prev) => [...prev, normalized]);
    setCurrentTag("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleCreate = async () => {
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (cleanTitle.length < 3 || cleanTitle.length > 200) {
      Alert.alert("Invalid title", "Title must be between 3 and 200 characters.");
      return;
    }
    if (cleanDescription.length < 10) {
      Alert.alert("Invalid description", "Description must be at least 10 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createSpaces(cleanTitle, cleanDescription, "public", tags);
      router.push("/(tabs)");
    } catch (error) {
      Alert.alert("Create space failed", error?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const router = useRouter();
  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.top}>
          <Text style={styles.title}>Space7</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.closeButton}
            onPress={() => {
              router.push("/(tabs)");
            }}
          >
            <Ionicons name="close" size={40} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.topic}>
          <Text style={styles.topicText}>New Topic</Text>
        </View>
        <View style={styles.titleCard}><Text style={styles.sectionLabelText}>Title</Text></View>
        <TextInput placeholder="  Enter topic title..." style={styles.titleInput} onChangeText={setTitle} value={title} />
        <View style={styles.descriptionCard}><Text style={styles.sectionLabelText}>Description</Text></View>
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
        <View style={styles.hashtagWrap}>
          <View style={styles.hastagTab}><Text style={styles.hashtagTabText}>#Hastags</Text></View>
          <View style={styles.hastag}>
            <View style={styles.tagInputRow}>
              <TextInput
                placeholder="#Add Hastags"
                style={styles.search}
                onChangeText={setCurrentTag}
                value={currentTag}
              />
              <TouchableOpacity activeOpacity={0.7} onPress={handleTagChange} style={styles.plusIcon}>
                <FontAwesome5 name="plus" size={20} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.tagsContainer}>
              {tags.map((tag) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagText}>#{tag}</Text>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => handleRemoveTag(tag)}>
                    <Ionicons name="close" size={16} color="black" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.7} style={styles.createButton} onPress={handleCreate} disabled={isSubmitting}>
          <Text style={styles.createButtonText}>{isSubmitting ? "Creating..." : "Create"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent:{
    paddingBottom:30,
  },
  top:{
    backgroundColor:"#27a6fd",
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    paddingHorizontal:15,
    paddingVertical:30,
  },
  closeButton:{
    backgroundColor:"#fc2e99",
    borderWidth:3,
    borderColor:'black',
    borderRadius:8,
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
  sectionLabelText:{
    fontFamily:'Outfit_700Bold',
    fontSize:26,
    paddingHorizontal:10,
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
  hashtagWrap:{
    position:'relative',
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
    alignItems:'flex-start',
    position:'relative',
    justifyContent:'flex-start',
    padding:12,
  },
  hastagTab:{
      backgroundColor:"#feda00",
      borderWidth:2,
      paddingHorizontal:10,
      borderColor:'black',
      marginTop:20,
      minHeight:30,
      position:'absolute',
      marginLeft:20,
      borderRadius:10,
      zIndex:1,
      borderBottomWidth:0,
      borderBottomStartRadius:0,
      borderBottomEndRadius:0,
    },
    hashtagTabText:{
      alignSelf:'center',
      marginTop:2,
      fontFamily:'Outfit_700Bold',
      fontSize:20,
    },
    search:{
      backgroundColor:'white',
      flex:1,
      paddingHorizontal:5,
      borderRadius:10,
      borderWidth:3,
      borderColor:'black',
      fontFamily:'Outfit_400Regular',
    },
    tagInputRow:{
      alignSelf:'stretch',
      flexDirection:'row',
      alignItems:'center',
      gap:10,
      justifyContent:'flex-start',
    },
    plusIcon:{
      backgroundColor:'#27a6fd',
      padding:8.5,
      borderWidth:2,
      borderRadius:10,
    },
    tagsContainer:{
      alignSelf:'stretch',
      flexDirection:'row',
      flexWrap:'wrap',
      gap:8,
      marginTop:8,
      marginLeft:0,
    },
    tagChip:{
      backgroundColor:'white',
      borderWidth:2,
      borderColor:'black',
      borderRadius:20,
      paddingVertical:4,
      paddingHorizontal:10,
      flexDirection:'row',
      alignItems:'center',
      gap:6,
    },
    tagText:{
      fontFamily:'Outfit_600SemiBold',
      fontSize:14,
    },
    createButton:{
      backgroundColor:'#feda00',
      borderWidth:3,
      borderColor:'black',
      borderRadius:12,
      alignSelf:'center',
      marginTop:20,
      padding:10,
      paddingHorizontal:20,
    },
    createButtonText:{
      fontFamily:'Outfit_700Bold',
      fontSize:26,
    },
})
