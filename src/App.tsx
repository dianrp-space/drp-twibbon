import React, { useState } from "react";
import { Sparkles, Image as ImageIcon, User, Download } from "lucide-react";
import ImageUploader from "./components/ImageUploader";
import CanvasEditor from "./components/CanvasEditor";

function App() {
  const [frameImage, setFrameImage] = useState<HTMLImageElement | null>(null);
  const [photoImage, setPhotoImage] = useState<HTMLImageElement | null>(null);

  const handleFrameUpload = (file: File) => {
    const img = new Image();
    img.onload = () => {
      setFrameImage(img);
    };
    img.src = URL.createObjectURL(file);
  };

  const handlePhotoUpload = (file: File) => {
    const img = new Image();
    img.onload = () => {
      setPhotoImage(img);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleDownload = (canvas: HTMLCanvasElement) => {
    const link = document.createElement("a");
    link.download = `twibbon-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl">
              <img src="/logo.png" alt="Logo" className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-blue-700">
                DRP-Twibbon Maker
              </h1>
              <p className="text-gray-600">Buat twibbon keren dengan mudah</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-blue-600" />
                Upload Gambar
              </h2>

              <div className="space-y-4">
                {/* Kolom upload frame template dihapus, upload frame hanya tersedia di CanvasEditor */}

                <ImageUploader
                  onImageUpload={handlePhotoUpload}
                  title="Foto Selfie"
                  description="Upload foto yang akan digabungkan dengan frame"
                  accept="image/*"
                  icon={<User className="w-8 h-8 text-green-600" />}
                />
              </div>
            </div>

            {/* Preview Section */}

            {/* Preview Section dihapus sesuai permintaan */}

            {/* Instructions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold mb-3 text-blue-900">
                Cara Penggunaan:
              </h3>
              <ol className="text-sm text-blue-800 space-y-2">
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                    1
                  </span>
                  Pilih Template Frame yang sudah disediakan atau Upload frame
                  template kamu sendiri dengan background transparan (format PNG
                  lebih baik)
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                    2
                  </span>
                  Upload foto kamu atau foto yang ingin digabungkan dengan Frame
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                    3
                  </span>
                  Atur posisi, ukuran, dan rotasi foto di canvas yang disediakan
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                    4
                  </span>
                  Download hasilnya dalam format PNG. Gampang bukan?
                </li>
              </ol>
            </div>
          </div>

          {/* Canvas Section */}
          <div className="lg:col-span-2">
            <CanvasEditor
              frameImage={frameImage}
              photoImage={photoImage}
              onDownload={handleDownload}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="flex items-center justify-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>
                DRP Twibbon - Buat twibbon profesional dengan mudah tanpa
                Watermark
              </span>
            </p>
            <p className="text-sm mt-2 text-gray-500">
              Drag foto untuk mengatur posisi, gunakan slider untuk scale dan
              rotasi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
