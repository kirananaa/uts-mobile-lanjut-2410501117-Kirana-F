import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAppContext } from "../context/AppContext";
import { fetchShowDetail, stripHtml } from "../services/api";

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function DetailScreen({ route }) {
  // Terima data show dari navigation params
  const showParam = route?.params?.show;

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { addFavorite, removeFavorite, isFavorite } = useAppContext();

  const displayShow = show ?? showParam; // pakai params dulu sambil fetch
  const sudahFavorit = isFavorite(displayShow.id);

  useEffect(() => {
    loadDetail();
  }, []);

  async function loadDetail() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchShowDetail(showParam.id);
      setShow(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleToggleFavorit() {
    if (sudahFavorit) {
      removeFavorite(displayShow.id);
      Alert.alert("Dihapus", `"${displayShow.name}" dihapus dari favorit.`);
    } else {
      addFavorite({
        id: displayShow.id,
        name: displayShow.name,
        image: displayShow.image,
        genres: displayShow.genres,
        rating: displayShow.rating,
        status: displayShow.status,
        premiered: displayShow.premiered,
        language: displayShow.language,
        network: displayShow.network,
        summary: displayShow.summary,
      });
      Alert.alert(
        "Ditambahkan! ⭐",
        `"${displayShow.name}" ditambahkan ke favorit.`,
      );
    }
  }

  const poster = displayShow?.image?.original ?? displayShow?.image?.medium;
  const cast = show?._embedded?.cast?.slice(0, 5) ?? [];

  if (!showParam) {
    return (
      <View style={{ marginTop: 50 }}>
        <Text>Data tidak tersedia</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Poster */}
      {poster ? (
        <Image source={{ uri: poster }} style={styles.poster} />
      ) : (
        <View style={[styles.poster, styles.noPoster]}>
          <Text style={{ color: "#9CA3AF" }}>Tidak ada gambar</Text>
        </View>
      )}

      <View style={styles.body}>
        <Text style={styles.title}>{displayShow.name}</Text>

        {displayShow.rating?.average && (
          <Text style={styles.rating}>
            ⭐ {displayShow.rating.average} / 10
          </Text>
        )}

        {/* Genre */}
        {displayShow.genres?.length > 0 && (
          <View style={styles.genreRow}>
            {displayShow.genres.map((g) => (
              <View key={g} style={styles.chip}>
                <Text style={styles.chipText}>{g}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Tombol Tambah ke Favorit */}
        <TouchableOpacity
          style={[styles.favBtn, sudahFavorit && styles.favBtnActive]}
          onPress={handleToggleFavorit}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.favBtnText, sudahFavorit && { color: "#DC2626" }]}
          >
            {sudahFavorit ? "💔 Hapus dari Favorit" : "⭐ Tambah ke Favorit"}
          </Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator color="#2563EB" style={{ marginBottom: 8 }} />
        )}
        {error && <Text style={styles.errText}>{error}</Text>}

        {/* Informasi — minimal 5 field */}
        <Text style={styles.sectionTitle}>Informasi</Text>
        <View style={styles.infoCard}>
          <InfoRow label="Status" value={displayShow.status} />
          <InfoRow label="Bahasa" value={displayShow.language} />
          <InfoRow label="Tayang" value={displayShow.premiered} />
          <InfoRow label="Network" value={displayShow.network?.name} />
          <InfoRow
            label="Runtime"
            value={displayShow.runtime ? `${displayShow.runtime} menit` : null}
          />
          <InfoRow label="Tipe" value={displayShow.type} />
          <InfoRow
            label="Jadwal"
            value={displayShow.schedule?.days?.join(", ")}
          />
        </View>

        {/* Sinopsis */}
        {displayShow.summary && (
          <>
            <Text style={styles.sectionTitle}>Sinopsis</Text>
            <Text style={styles.summary}>{stripHtml(displayShow.summary)}</Text>
          </>
        )}

        {/* Pemeran */}
        {cast.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Pemeran Utama</Text>
            {cast.map(({ person, character }) => (
              <View key={person.id} style={styles.castRow}>
                <Image
                  source={{
                    uri:
                      person.image?.medium ?? "https://via.placeholder.com/50",
                  }}
                  style={styles.castPhoto}
                />
                <View>
                  <Text style={styles.castName}>{person.name}</Text>
                  <Text style={styles.castChar}>sebagai {character.name}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 32 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  poster: {
    width: "100%",
    height: 280,
    resizeMode: "cover",
    backgroundColor: "#E5E7EB",
  },
  noPoster: { alignItems: "center", justifyContent: "center" },
  body: { padding: 16 },

  title: { fontSize: 22, fontWeight: "700", color: "#111827", marginBottom: 4 },
  rating: {
    fontSize: 15,
    color: "#F59E0B",
    fontWeight: "600",
    marginBottom: 8,
  },

  genreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: "#EFF6FF",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#2563EB",
  },
  chipText: { color: "#2563EB", fontSize: 12, fontWeight: "500" },

  favBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  favBtnActive: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#DC2626",
  },
  favBtnText: { color: "#ffffff", fontWeight: "700", fontSize: 15 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    marginTop: 4,
  },

  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  infoLabel: { color: "#6B7280", fontSize: 13, flex: 1 },
  infoValue: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "500",
    flex: 2,
    textAlign: "right",
  },

  summary: { color: "#6B7280", fontSize: 14, lineHeight: 22, marginBottom: 16 },
  errText: { color: "#DC2626", fontSize: 13, marginBottom: 8 },

  castRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  castPhoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: "#E5E7EB",
  },
  castName: { fontSize: 14, fontWeight: "600", color: "#111827" },
  castChar: { fontSize: 12, color: "#6B7280", marginTop: 2 },
});
