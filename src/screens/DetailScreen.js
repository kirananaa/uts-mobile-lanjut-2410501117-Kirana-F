import React, { useEffect, useState } from "react";
import {
    ActivityIndicator, Alert, Image, ScrollView, StyleSheet,
    Text, TouchableOpacity, View, StatusBar, Dimensions
} from "react-native";
import { fetchShowDetail, stripHtml } from "../services/api";

const { width } = Dimensions.get('window');

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
    const showParam = route?.params?.show;
    const [show, setShow] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Sementara favorit dimatikan dulu jika AppContext belum ada, 
    // atau kamu bisa sambungkan ke AppContext kamu
    const sudahFavorit = false; 

    useEffect(() => {
        if (showParam?.id) loadDetail();
    }, [showParam?.id]);

    async function loadDetail() {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchShowDetail(showParam.id);
            setShow(data);
        } catch (e) {
            setError("Gagal memuat detail mendalam.");
        } finally {
            setLoading(false);
        }
    }

    const displayShow = show ?? showParam;
    const poster = displayShow?.image?.original ?? displayShow?.image?.medium;
    const cast = show?._embedded?.cast?.slice(0, 5) ?? [];

    if (!showParam) return <View style={styles.centered}><Text style={{color: '#FFF'}}>Data tidak tersedia</Text></View>;

    return (
        <ScrollView style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" />
            {poster ? (
                <Image source={{ uri: poster }} style={styles.poster} />
            ) : (
                <View style={[styles.poster, styles.noPoster]}>
                    <Text style={{ color: "#888" }}>Tidak ada gambar</Text>
                </View>
            )}

            <View style={styles.body}>
                <Text style={styles.title}>{displayShow.name}</Text>
                {displayShow.rating?.average && (
                    <Text style={styles.rating}>⭐ {displayShow.rating.average} / 10</Text>
                )}

                {displayShow.genres?.length > 0 && (
                    <View style={styles.genreRow}>
                        {displayShow.genres.map((g) => (
                            <View key={g} style={styles.chip}>
                                <Text style={styles.chipText}>{g}</Text>
                            </View>
                        ))}
                    </View>
                )}

                <Text style={styles.sectionTitle}>Informasi</Text>
                <View style={styles.infoCard}>
                    <InfoRow label="Status" value={displayShow.status} />
                    <InfoRow label="Bahasa" value={displayShow.language} />
                    <InfoRow label="Tayang" value={displayShow.premiered} />
                    <InfoRow label="Network" value={displayShow.network?.name} />
                    <InfoRow label="Runtime" value={displayShow.runtime ? `${displayShow.runtime} menit` : null} />
                </View>

                {displayShow.summary && (
                    <>
                        <Text style={styles.sectionTitle}>Sinopsis</Text>
                        <Text style={styles.summary}>{stripHtml(displayShow.summary)}</Text>
                    </>
                )}

                {cast.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Pemeran Utama</Text>
                        {cast.map(({ person, character }) => (
                            <View key={person.id} style={styles.castRow}>
                                <Image
                                    source={{ uri: person.image?.medium ?? "https://via.placeholder.com/50" }}
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
                <View style={{ height: 50 }} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0D0D1A" },
    centered: { flex: 1, backgroundColor: "#0D0D1A", justifyContent: "center", alignItems: "center" },
    poster: { width: width, height: 450, resizeMode: "cover" },
    noPoster: { backgroundColor: "#1E1E32", justifyContent: "center", alignItems: "center" },
    body: { padding: 16, marginTop: -30, backgroundColor: "#0D0D1A", borderTopLeftRadius: 30, borderTopRightRadius: 30 },
    title: { fontSize: 26, fontWeight: "800", color: "#FFFFFF", marginBottom: 8 },
    rating: { fontSize: 16, color: "#FCD34D", fontWeight: "700", marginBottom: 15 },
    genreRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 20 },
    chip: { backgroundColor: "#1E1E32", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: "#E040FB" },
    chipText: { color: "#E040FB", fontSize: 12, fontWeight: "600" },
    sectionTitle: { fontSize: 18, fontWeight: "700", color: "#FFFFFF", marginBottom: 10, marginTop: 15 },
    infoCard: { backgroundColor: "#16162A", borderRadius: 12, borderWidth: 1, borderColor: "#2A2A42", overflow: "hidden", marginBottom: 16 },
    infoRow: { flexDirection: "row", justifyContent: "space-between", padding: 12, borderBottomWidth: 1, borderBottomColor: "#2A2A42" },
    infoLabel: { color: "#888", fontSize: 13 },
    infoValue: { color: "#FFF", fontSize: 13, fontWeight: "600" },
    summary: { color: "#CCC", fontSize: 14, lineHeight: 22 },
    castRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#16162A", borderRadius: 12, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: "#2A2A42" },
    castPhoto: { width: 50, height: 50, borderRadius: 25, marginRight: 15, backgroundColor: "#1E1E32" },
    castName: { fontSize: 15, fontWeight: "600", color: "#FFF" },
    castChar: { fontSize: 12, color: "#888", marginTop: 2 },
});