const BASE_URL = "https://api.tvmaze.com";

// Ambil daftar show (halaman pertama)
export async function fetchShows() {
  const res = await fetch(`${BASE_URL}/shows?page=0`);
  if (!res.ok) throw new Error(`Gagal mengambil data (${res.status})`);
  return res.json();
}

// Cari show berdasarkan kata kunci
export async function searchShows(query) {
  const res = await fetch(
    `${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`,
  );
  if (!res.ok) throw new Error(`Pencarian gagal (${res.status})`);
  const data = await res.json();
  // TVMaze mengembalikan [{score, show}] — kita ambil show-nya saja
  return data.map((item) => item.show);
}

// Ambil detail show + cast
export async function fetchShowDetail(id) {
  const res = await fetch(`${BASE_URL}/shows/${id}?embed[]=cast`);
  if (!res.ok) throw new Error(`Gagal memuat detail (${res.status})`);
  return res.json();
}

// Hapus tag HTML dari summary
export function stripHtml(html) {
  if (!html) return "Tidak ada deskripsi.";
  return html.replace(/<[^>]+>/g, "");
}
