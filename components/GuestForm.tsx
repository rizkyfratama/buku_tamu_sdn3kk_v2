
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Save, X, RefreshCw, CloudUpload } from 'lucide-react';
import { analyzeVisit } from '../services/geminiService';
import { GuestEntry } from '../types';
import { APP_CONFIG } from '../config';

interface GuestFormProps {
  onSubmit: (entry: GuestEntry) => void;
  isSubmitting: boolean;
}

const GuestForm: React.FC<GuestFormProps> = ({ onSubmit, isSubmitting: parentIsSubmitting }) => {
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('');
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  
  // Camera State
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // For photo capture
  
  // Signature State
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);

  // --- Camera Logic ---
  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Tidak dapat mengakses kamera. Pastikan izin diberikan.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Compress quality to 0.7 to save bandwidth for Google Script
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setPhotoData(dataUrl);
        stopCamera();
      }
    }
  };

  // --- Signature Logic ---
  useEffect(() => {
     // Initialize signature canvas context
     const canvas = sigCanvasRef.current;
     if(canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = 200; // Fixed height
        const ctx = canvas.getContext('2d');
        if(ctx) {
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#000';
        }
     }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if(sigCanvasRef.current) {
        setSignatureData(sigCanvasRef.current.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = sigCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureData(null);
    }
  };

  // --- Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !purpose) {
      alert("Nama dan Tujuan harus diisi!");
      return;
    }

    setLocalIsSubmitting(true);
    setUploadStatus('Menganalisis data...');

    // 1. Analyze with AI
    const aiResult = await analyzeVisit(name, purpose);

    const timestamp = new Date().toISOString();
    
    const newEntry: GuestEntry = {
      id: Date.now().toString(),
      timestamp: timestamp,
      name,
      institution,
      phone,
      purpose,
      photoUrl: photoData,
      signatureUrl: signatureData,
      aiSummary: aiResult.message,
      aiCategory: aiResult.category
    };

    // 2. Send to Google Spreadsheet (if configured)
    if (APP_CONFIG.useCloudStorage) {
      setUploadStatus('Menyimpan & Mengirim Notifikasi ke Admin...');
      try {
        // Prepare data for Google Apps Script
        const formData = {
          timestamp: timestamp,
          name: name,
          institution: institution,
          phone: phone,
          purpose: purpose,
          aiCategory: aiResult.category,
          aiSummary: aiResult.message,
          photoUrl: photoData || "", // Send base64 string
          signatureUrl: signatureData || ""
        };

        // Use fetch with no-cors mode to bypass CORS issues with Google Apps Script
        await fetch(APP_CONFIG.scriptUrl, {
          method: 'POST',
          mode: 'no-cors', 
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "text/plain;charset=utf-8", 
          },
        });
        
        // Since mode is no-cors, we can't read the response, but we assume success if no network error
        
      } catch (error) {
        console.error("Gagal mengirim ke Google Sheet:", error);
        alert("Gagal koneksi ke server, namun data tersimpan lokal.");
      }
    }

    setUploadStatus('');
    setLocalIsSubmitting(false);
    
    // 3. Pass to parent to update local state/UI
    onSubmit(newEntry);
  };

  const isSubmitting = parentIsSubmitting || localIsSubmitting;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        Isi Buku Tamu
      </h2>

      {!APP_CONFIG.useCloudStorage && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-center text-yellow-800 text-sm">
           <CloudUpload className="mr-2" size={16} />
           <span>Mode Offline: Data disimpan di browser. Hubungkan Google Script di `config.ts` untuk fitur online.</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input 
              type="text" 
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              placeholder="Masukkan nama anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instansi / Asal</label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              placeholder="Contoh: Dinas Pendidikan / Wali Murid"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon / WA</label>
            <input 
              type="tel" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              placeholder="08xxxxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Tujuan Kunjungan</label>
             <textarea 
               required
               rows={3}
               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
               placeholder="Jelaskan keperluan anda..."
               value={purpose}
               onChange={(e) => setPurpose(e.target.value)}
             />
          </div>
        </div>

        {/* Camera Section */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-3">Foto Pengunjung</label>
          <div className="flex flex-col items-center justify-center space-y-4">
             {photoData ? (
               <div className="relative">
                 <img src={photoData} alt="Captured" className="w-64 h-48 object-cover rounded-lg shadow-sm" />
                 <button 
                   type="button" 
                   onClick={() => setPhotoData(null)}
                   className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700"
                 >
                   <X size={16} />
                 </button>
               </div>
             ) : (
               <div className="w-full flex flex-col items-center">
                 {isCameraOpen ? (
                   <div className="relative w-full max-w-md">
                     <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg shadow-sm" />
                     <button 
                        type="button"
                        onClick={capturePhoto}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-red-600 px-6 py-2 rounded-full font-bold shadow hover:bg-gray-100"
                     >
                       Ambil Foto
                     </button>
                   </div>
                 ) : (
                   <button 
                     type="button" 
                     onClick={startCamera}
                     className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                   >
                     <Camera size={20} />
                     <span>Buka Kamera</span>
                   </button>
                 )}
                 <canvas ref={canvasRef} className="hidden" />
               </div>
             )}
          </div>
        </div>

        {/* Signature Section */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
           <div className="flex justify-between items-center mb-2">
             <label className="block text-sm font-medium text-gray-700">Tanda Tangan</label>
             <button type="button" onClick={clearSignature} className="text-xs text-red-500 hover:text-red-700 flex items-center">
               <RefreshCw size={12} className="mr-1"/> Hapus
             </button>
           </div>
           <div className="border border-gray-300 bg-white rounded-lg overflow-hidden cursor-crosshair touch-none">
             <canvas 
               ref={sigCanvasRef} 
               className="w-full h-48 block"
               onMouseDown={startDrawing}
               onMouseMove={draw}
               onMouseUp={endDrawing}
               onMouseLeave={endDrawing}
               onTouchStart={startDrawing}
               onTouchMove={draw}
               onTouchEnd={endDrawing}
             />
           </div>
           <p className="text-xs text-gray-500 mt-2">*Tanda tangan digital diatas kotak putih.</p>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-4 rounded-lg text-white font-bold text-lg shadow-lg flex items-center justify-center space-x-2 transition transform hover:-translate-y-1 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {uploadStatus || 'Memproses...'}
              </span>
            ) : (
              <>
                <Save size={24} />
                <span>Simpan Buku Tamu</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuestForm;
