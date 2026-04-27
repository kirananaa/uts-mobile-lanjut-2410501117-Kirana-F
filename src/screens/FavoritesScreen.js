import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppContext } from "../context/AppContext";

function FavItem({ item, onPress, onHapus }) {
  const poster = item?.image?.medium;
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      {poster ? (
        <Image source={{ uri: poster }} style={styles.poster} />
      ) : (
        <View style={[styles.poster, styles.noPoster]}>
          <Text>🎬</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        {item.genres?.length > 0 && (
          <Text style={styles.genre}>{item.genres[0]}</Text>
        )}
        {item.rating?.average && (
          <Text style={styles.rating}>⭐ {item.rating.average}</Text>
        )}
        {item.status && (
          <Text
            style={
              item.status === "Running" ? styles.statusOn : styles.statusOff
            }
          >
            {item.status}
          </Text>
        )}
      </View>

      {/* Tombol Hapus dari Favorit */}
      <TouchableOpacity style={styles.hapusBtn} onPress={() => onHapus(item)}>
        <Text style={styles.hapusText}>Hapus</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function FavoritesScreen({ navigation }) {
  const { favorites, removeFavorite } = useAppContext();

  function handlePress(show) {
    // Navigasi ke Detail dari tab Favorit — harus lewat HomeStack
    navigation.navigate("HomeStack", { screen: "Detail", params: { show } });
  }

  function handleHapus(item) {
    Alert.alert("Hapus Favorit", `Hapus "${item.name}" dari daftar favorit?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => removeFavorite(item.id),
      },
    ]);
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>⭐</Text>
        <Text style={styles.emptyTitle}>Belum ada favorit</Text>
        <Text style={styles.emptyDesc}>
          Buka detail show lalu tekan "Tambah ke Favorit".
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <FavItem item={item} onPress={handlePress} onHapus={handleHapus} />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListHeaderComponent={
          <Text style={styles.header}>
            ⭐ Favorit Saya ({favorites.length})
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  list: { padding: 12, paddingBottom: 24 },
  header: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  poster: {
    width: 70,
    height: 100,
    resizeMode: "cover",
    backgroundColor: "#E5E7EB",
  },
  noPoster: { alignItems: "center", justifyContent: "center" },

  info: { flex: 1, padding: 10, gap: 3 },
  name: { fontSize: 14, fontWeight: "600", color: "#111827" },
  genre: { fontSize: 12, color: "#6B7280" },
  rating: { fontSize: 12, color: "#F59E0B", fontWeight: "600" },
  statusOn: { fontSize: 11, fontWeight: "500", color: "#16A34A" },
  statusOff: { fontSize: 11, fontWeight: "500", color: "#6B7280" },

  hapusBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#DC2626",
  },
  hapusText: { color: "#DC2626", fontSize: 12, fontWeight: "600" },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: "#F5F5F5",
  },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
});
