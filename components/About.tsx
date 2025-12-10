
import React from 'react';
import { Heart, Leaf } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Bagian Profil Sekolah */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-red-700 to-red-600 p-6 text-white">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold">Tentang SD Negeri 3 Bangkuang</h2>
          </div>
        </div>
        <div className="p-8 text-gray-700 space-y-4 leading-relaxed">
          <p className="text-lg font-medium text-gray-800">
            "Mewujudkan Generasi Cerdas, Berkarakter, dan Berakhlak Mulia."
          </p>
          <p>
            SD Negeri 3 Bangkuang hadir sebagai lembaga pendidikan dasar yang berkomitmen untuk tidak hanya mencetak siswa yang unggul secara akademis, tetapi juga memiliki integritas moral yang tinggi. Kami percaya bahwa pendidikan adalah pondasi utama dalam membangun masa depan bangsa.
          </p>
          <p>
            Dengan lingkungan belajar yang kondusif, tenaga pengajar yang berdedikasi, dan semangat "Merdeka Belajar", kami berupaya menggali potensi terbaik setiap anak didik agar siap menghadapi tantangan zaman dengan tetap memegang teguh nilai-nilai luhur budaya dan agama.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center p-4 bg-red-50 rounded-lg border border-red-100">
              <Heart className="text-red-500 mr-3" />
              <span className="font-semibold text-red-800">Peduli & Berbudaya</span>
            </div>
            <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-100">
              <Leaf className="text-blue-500 mr-3" />
              <span className="font-semibold text-blue-800">Lingkungan Asri</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Pantun Khas */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 text-center shadow-sm relative overflow-hidden">
        <h3 className="text-xl font-bold text-gray-800 mb-4 font-serif">Sapaan Khas Kalimantan Tengah</h3>
        <div className="italic text-gray-700 text-lg space-y-1 font-serif">
          <p>"Burung Enggang terbangnya tinggi,"</p>
          <p>"Hinggap sebentar di pohon ulin."</p>
          <p>"Kami menyambut sepenuh hati,"</p>
          <p>"Tali silaturahmi mari kita jalin."</p>
        </div>
      </div>

      {/* Bagian Buku Tamu Digital */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gray-800 p-6 text-white">
           <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold">Inovasi Buku Tamu Digital</h2>
          </div>
        </div>
        <div className="p-8">
          <p className="text-gray-700 mb-6">
            Sebagai wujud nyata transformasi digital di lingkungan sekolah, SD Negeri 3 Bangkuang menghadirkan sistem <strong>Buku Tamu Digital Terpadu</strong>. Aplikasi ini dirancang untuk memodernisasi proses administrasi penerimaan tamu dengan sentuhan teknologi terkini.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-gray-200 rounded-xl hover:shadow-lg transition">
              <h3 className="font-bold text-lg text-gray-800 mb-2">🚀 Efisiensi & Paperless</h3>
              <p className="text-sm text-gray-600">
                Mengurangi penggunaan kertas dan memudahkan pencarian data riwayat kunjungan secara real-time tanpa perlu membuka tumpukan buku fisik.
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-xl hover:shadow-lg transition">
              <h3 className="font-bold text-lg text-gray-800 mb-2">📸 Bukti Digital Valid</h3>
              <p className="text-sm text-gray-600">
                Mencatat kehadiran tamu lengkap dengan foto wajah dan tanda tangan digital untuk keamanan dan validitas data administrasi sekolah.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;