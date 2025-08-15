// Touch event handlers for mobile
const handleTouchStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
  if (!photoImage) return;
  const canvas = canvasRef.current;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = CANVAS_WIDTH / rect.width;
  const scaleY = CANVAS_HEIGHT / rect.height;
  const touch = event.touches[0];
  const touchX = (touch.clientX - rect.left) * scaleX;
  const touchY = (touch.clientY - rect.top) * scaleY;
  setIsDragging(true);
  setDragStart({ x: touchX - photoTransform.x, y: touchY - photoTransform.y });
};

const handleTouchMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
  if (!isDragging || !photoImage) return;
  const canvas = canvasRef.current;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = CANVAS_WIDTH / rect.width;
  const scaleY = CANVAS_HEIGHT / rect.height;
  const touch = event.touches[0];
  const touchX = (touch.clientX - rect.left) * scaleX;
  const touchY = (touch.clientY - rect.top) * scaleY;
  setPhotoTransform((prev: PhotoTransform) => ({
    ...prev,
    x: touchX - dragStart.x,
    y: touchY - dragStart.y,
  }));
  event.preventDefault();
};

const handleTouchEnd = () => {
  setIsDragging(false);
};
import React, { useRef, useEffect, useState, useCallback } from "react";
import ImageUploader from "./ImageUploader";
import { Download, RotateCcw, Move, ZoomIn, ZoomOut } from "lucide-react";

interface CanvasEditorProps {
  frameImage: HTMLImageElement | null;
  photoImage: HTMLImageElement | null;
  onDownload: (canvas: HTMLCanvasElement) => void;
}

interface PhotoTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

const FRAME_FOLDER = "/frames";
const FRAME_LIST = ["frame1.png", "frame2.png", "frame3.png", "frame4.png"];

const CanvasEditor: React.FC<CanvasEditorProps> = ({
  frameImage,
  photoImage,
  onDownload,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photoTransform, setPhotoTransform] = useState<PhotoTransform>({
    x: 200,
    y: 200,
    scale: 1,
    rotation: 0,
  });
  // Frame source state
  const [frameSource, setFrameSource] = useState<"upload" | "folder">("folder");
  const [selectedFrameName, setSelectedFrameName] = useState<string | null>(
    FRAME_LIST[0]
  );
  const [uploadedFrameFile, setUploadedFrameFile] = useState<File | null>(null);
  const [framePreview, setFramePreview] = useState<string | null>(null);
  // Load frame preview and frame image for canvas
  const [frameImageLocal, setFrameImageLocal] =
    useState<HTMLImageElement | null>(null);
  useEffect(() => {
    let img = new window.Image();
    if (frameSource === "folder" && selectedFrameName) {
      img.src = `${FRAME_FOLDER}/${selectedFrameName}`;
      img.onload = () => {
        setFrameImageLocal(img);
        setFramePreview(img.src);
      };
    } else if (frameSource === "upload" && uploadedFrameFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
        img.onload = () => {
          setFrameImageLocal(img);
          setFramePreview(img.src);
        };
      };
      reader.readAsDataURL(uploadedFrameFile);
    } else {
      setFrameImageLocal(null);
      setFramePreview(null);
    }
    // eslint-disable-next-line
  }, [frameSource, selectedFrameName, uploadedFrameFile]);
  // Handle frame upload
  const handleFrameUpload = (file: File) => {
    setUploadedFrameFile(file);
    setSelectedFrameName(null);
  };
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 800;

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw photo first (background layer)
    if (photoImage) {
      ctx.save();

      // Calculate photo dimensions to fit canvas while maintaining aspect ratio
      const photoAspect = photoImage.width / photoImage.height;
      let drawWidth = CANVAS_WIDTH * photoTransform.scale;
      let drawHeight = CANVAS_HEIGHT * photoTransform.scale;

      if (photoAspect > 1) {
        drawHeight = drawWidth / photoAspect;
      } else {
        drawWidth = drawHeight * photoAspect;
      }

      // Apply transformations
      ctx.translate(photoTransform.x, photoTransform.y);
      ctx.rotate((photoTransform.rotation * Math.PI) / 180);
      ctx.drawImage(
        photoImage,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );

      ctx.restore();
    }

    // Draw frame on top
    if (frameImageLocal) {
      ctx.drawImage(frameImageLocal, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else if (frameImage) {
      ctx.drawImage(frameImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  }, [photoImage, frameImage, frameImageLocal, photoTransform]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!photoImage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;

    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    setIsDragging(true);
    setDragStart({
      x: mouseX - photoTransform.x,
      y: mouseY - photoTransform.y,
    });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !photoImage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;

    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    setPhotoTransform((prev) => ({
      ...prev,
      x: mouseX - dragStart.x,
      y: mouseY - dragStart.y,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleScaleChange = (delta: number) => {
    setPhotoTransform((prev) => ({
      ...prev,
      scale: Math.max(0.1, Math.min(3, prev.scale + delta)),
    }));
  };

  const handleRotationChange = (delta: number) => {
    setPhotoTransform((prev) => ({
      ...prev,
      rotation: (prev.rotation + delta) % 360,
    }));
  };

  const handleReset = () => {
    setPhotoTransform({
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      scale: 1,
      rotation: 0,
    });
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onDownload(canvas);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Frame source selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pilih Sumber Frame dari yang sudah disediakan atau Upload Frame kamu
          sendiri:
          <p>
            Nb: Saat Upload Frame sendiri, pastikan frame yang kamu upload
            memiliki background transparan
          </p>
        </label>
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-lg border ${
              frameSource === "folder"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => {
              setFrameSource("folder");
              setUploadedFrameFile(null);
            }}
          >
            Frame Template Lokal
          </button>
          <button
            className={`px-4 py-2 rounded-lg border ${
              frameSource === "upload"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => {
              setFrameSource("upload");
              setSelectedFrameName(null);
            }}
          >
            Upload Frame Sendiri
          </button>
        </div>
      </div>

      {/* Frame picker */}
      {frameSource === "folder" && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Frame Template:
          </label>
          <div className="flex gap-4">
            {FRAME_LIST.map((fname) => (
              <div
                key={fname}
                className={`border rounded-lg p-1 cursor-pointer ${
                  selectedFrameName === fname
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                onClick={() => {
                  setSelectedFrameName(fname);
                  setUploadedFrameFile(null);
                }}
              >
                <img
                  src={`${FRAME_FOLDER}/${fname}`}
                  alt={fname}
                  className="w-20 h-20 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Frame uploader */}
      {frameSource === "upload" && (
        <div className="mb-4">
          <ImageUploader
            onImageUpload={handleFrameUpload}
            title="Upload Frame"
            description="Unggah gambar frame PNG transparan"
            accept="image/png"
          />
          {uploadedFrameFile && framePreview && (
            <div className="mt-2">
              <img
                src={framePreview}
                alt="Preview Frame"
                className="w-20 h-20 object-contain border rounded-lg"
              />
            </div>
          )}
        </div>
      )}

      {/* ...existing code... (toolbar, canvas, controls, download button) */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Canvas Editor</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handleScaleChange(-0.1)}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={!photoImage}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScaleChange(0.1)}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={!photoImage}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleRotationChange(15)}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={!photoImage}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors"
            disabled={!photoImage}
          >
            <Move className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="max-w-full h-auto cursor-move"
            style={{ maxHeight: "400px" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scale: {(photoTransform.scale * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={photoTransform.scale}
              onChange={(e) =>
                setPhotoTransform((prev) => ({
                  ...prev,
                  scale: parseFloat(e.target.value),
                }))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              disabled={!photoImage}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rotation: {photoTransform.rotation}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              step="15"
              value={photoTransform.rotation}
              onChange={(e) =>
                setPhotoTransform((prev) => ({
                  ...prev,
                  rotation: parseInt(e.target.value),
                }))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              disabled={!photoImage}
            />
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={!frameImageLocal || !photoImage}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          <span>Download Gambar</span>
        </button>

        {(!frameImageLocal || !photoImage) && (
          <p className="text-sm text-gray-500 text-center">
            Upload frame template dan foto selfie untuk mulai mengedit
          </p>
        )}
      </div>
    </div>
  );
};

export default CanvasEditor;
