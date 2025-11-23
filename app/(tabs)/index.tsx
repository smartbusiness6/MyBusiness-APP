import { navigate } from "expo-router/build/global-state/routing";
import {
    ScrollView, StyleSheet, Text,
    TouchableOpacity,
    View
} from "react-native";

export default function Index() {
  return (
    <ScrollView
      style={{
        paddingBottom: 20
      }}
    >
      <View style={styles.greetingBox}>
        <Text style={styles.greetingText}>Bonjour</Text>
        <Text>Voici un aperçu d'aujourd'hui</Text>
      </View>
      <TouchableOpacity
        onPress={()=>navigate("/finance")}
      >
        <View style={styles.StatResumeBox}>
          <View
            style={{
              flex: 1,
              gap : 12,
              flexDirection:"row",
              alignItems: "center",
              justifyContent:"space-around"
            }}
          >
            <Text
              style={styles.titleText}
            >Revenus de cette semaine</Text>
            <View 
              style={{
                width: 30,
                height: 10,
                borderRadius: 50,
                backgroundColor: "white"
              }}
            ></View>
          </View>
          <Text
            style={styles.bigTitleText}
          >250 000 Ar</Text>
          <Text
            style={styles.coverText}
          >+18.2% vs la semaine passée</Text>
        </View>
      </TouchableOpacity>
      <View 
        style={styles.statsContainer}>
        <TouchableOpacity
          onPress={()=>navigate("/ventes")}
        >
          <View
            style={styles.statBox}
          >
            <Text
              style={styles.titleStat}
            >Ventes aujourd'hui</Text>
            <Text style={styles.statValue}>0 Ar</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=>navigate("/ventes")}
        >
          <View
            style={styles.statBox}
          >
            <Text
              style={styles.titleStat}
            >Commandes</Text>
            <Text style={styles.statValue}>0</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=>navigate("/stock")}
        >
          <View 
            style={styles.statBox}
          >
            <Text
              style={styles.titleStat}
            >Produits</Text>
            <Text style={styles.statValue}>20</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=>navigate("/stock")}
        >
          <View 
            style={styles.statBox}
          >
            <Text
              style={[styles.titleStat,{color:"red"}]}
            >Alertes stock</Text>
            <Text style={[styles.statValue,{color:"red"}]}>5</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <h1 style={styles.ListTitle}>Activité récente</h1>
        <ScrollView 
          style={{
            maxHeight: 120
          }}
        >
          <View style={styles.itemList}>
            <View style={styles.itemSquare}></View>
            <View style={styles.itemLine}>
              <Text style={styles.itemTitle}>
                Facturation vente
              </Text>
              <Text style={styles.itemTitle}>
                Rasolo
              </Text>
              <Text style={styles.itemDate}>
                11/11/25 12:00
              </Text>
            </View>
          </View>
          <View style={styles.itemList}>
            <View style={styles.itemSquare}></View>
            <View style={styles.itemLine}>
              <Text style={styles.itemTitle}>
                Approvisionnement 
              </Text>
              <Text style={styles.itemTitle}>
                Rakoto
              </Text>
              <Text style={styles.itemDate}>
                11/11/25 12:00
              </Text>
            </View>
          </View>
          <View style={styles.itemList}>
            <View style={styles.itemSquare}></View>
            <View style={styles.itemLine}>
              <Text style={styles.itemTitle}>
                Modif commande
              </Text>
              <Text style={styles.itemTitle}>
                Ravao
              </Text>
              <Text style={styles.itemDate}>
                11/11/25 12:00
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  greetingBox:{
    padding: 8,
    width: "100%"
  },
  greetingText:{
    fontSize: 22,
    fontWeight: "bold"
  },
  StatResumeBox:{
    padding: 10,
    borderRadius: 12,
    width: "90%",
    alignSelf: "center",
    marginStart: 5,
    backgroundColor:"#4ccfb9ff",
    marginTop: 22
  },
  titleText:{
    color: "#FFFFFF",
    fontWeight: "200",
    fontSize: 17,
  },
  bigTitleText:{
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 12,
    marginStart: 15     
  },
  coverText:{
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "400",
    marginTop: 12,
    marginStart: 10,
    padding: 4,
    borderRadius: 8,
    backgroundColor: "#ffffff8e",
  },
  statsContainer:{
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    gap: 12,
    width: "100%",
    padding: 20,
    justifyContent: "center"
  },
  statBox:{
    width: 140,
    height: 120,
    borderRadius:12,
    borderColor: "black",
    borderWidth: .2,
    padding: 12
  },
  titleStat:{
    textAlign:"center",
    fontWeight:"200",
    fontFamily:"sans"
  },
  statValue:{
    fontSize: 25,
    marginTop: 22,
    textAlign:"center",
    fontWeight: "bold"
  },
  ListTitle:{
    textAlign:"center",
    fontWeight: "600",
    fontSize: 20
  },
  itemList:{
    padding: 4,
    width: "95%",
    marginStart: "2.5%",
    marginTop: 8,
    flex:1,
    flexDirection: "row",
    gap: 16,
    alignItems: "center"
  },
  itemSquare:{
    width: 30,
    height: 10,
    borderRadius: 22,
    backgroundColor:"#6b5555ff"
  },
  itemTitle:{
    fontWeight: "300",
    fontSize: 12
  },
  itemLine:{
    flexDirection:"row",
    justifyContent: "space-around",
    width: 290,
    alignItems:"center"
  },
  itemDate:{
    fontSize: 11,
    fontWeight: "200"
  }
})
