
import React from 'react';
import { User, FileText } from 'lucide-react';
import { GuestEntry } from '../types';

interface GuestListProps {
  guests: GuestEntry[];
}

const GuestList: React.FC<GuestListProps> = ({ guests }) => {

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div>
           <h2 className="text-xl font-bold text-gray-800 flex items-center">
             Daftar Tamu Hari Ini
           </h2>
           <p className="text-sm text-gray-500 mt-1">Total Tamu: {guests.length}</p>
        </div>
        {/* Tombol Export dihapus demi keamanan */}
      </div>

      <div className="overflow-x-auto">
        {guests.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <User size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Belum ada data tamu hari ini.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold border-b">Waktu</th>
                <th className="p-4 font-semibold border-b">Foto</th>
                <th className="p-4 font-semibold border-b">Identitas</th>
                <th className="p-4 font-semibold border-b">Tujuan</th>
                <th className="p-4 font-semibold border-b">Komentar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(guest.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-4">
                    {guest.photoUrl ? (
                      <img src={guest.photoUrl} alt={guest.name} className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <User size={20} />
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-gray-800">{guest.name}</p>
                    <p className="text-xs text-gray-500">{guest.institution}</p>
                    <p className="text-xs text-gray-400">{guest.phone}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-700 line-clamp-2">{guest.purpose}</p>
                  </td>
                  <td className="p-4">
                     <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full 
                        ${guest.aiCategory === 'Dinas' ? 'bg-purple-100 text-purple-800' : 
                          guest.aiCategory === 'Wali Murid' ? 'bg-blue-100 text-blue-800' : 
                          guest.aiCategory === 'Paket/Kurir' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {guest.aiCategory || 'Umum'}
                     </span>
                     {guest.aiSummary && (
                       <p className="text-xs text-gray-500 mt-1 italic flex items-start">
                         <FileText size={10} className="mr-1 mt-0.5 flex-shrink-0" />
                         "{guest.aiSummary}"
                       </p>
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default GuestList;
