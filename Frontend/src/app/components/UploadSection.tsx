import React from "react";
import { Upload, FileImage, FileText, File } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { apiFetch, API_BASE_URL, resolveApiUrl } from "../lib/api";
import type { ViewerAsset } from "../App";

type UploadSectionProps = {
  setViewerAsset: (asset: ViewerAsset) => void;
  onProjectCreated: () => void;
};

type StatsResponse = {
  totalUploads: number;
  successRate: number;
  avgProcessingTime: string;
};

type ConfigResponse = {
  meshyConfigured: boolean;
};

function getUploadedAsset(fileUrl: string): ViewerAsset {
  const normalizedUrl = resolveApiUrl(fileUrl);
  const lower = fileUrl.toLowerCase();
  if (lower.endsWith(".pdf")) return { kind: "pdf", url: normalizedUrl };
  if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".svg")) {
    return { kind: "image", url: normalizedUrl };
  }
  return { kind: "file", url: normalizedUrl };
}

function getUploadViewerAsset(data: { modelUrl?: string; iosModelUrl?: string; fileUrl?: string }): ViewerAsset | null {
  if (data.modelUrl) {
    return { kind: "model", url: data.modelUrl, iosUrl: data.iosModelUrl };
  }
  if (data.fileUrl) {
    return getUploadedAsset(data.fileUrl);
  }
  return null;
}

export function UploadSection({ setViewerAsset, onProjectCreated }: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [stats, setStats] = useState<StatsResponse>({
    totalUploads: 0,
    successRate: 100,
    avgProcessingTime: "~2min",
  });
  const [meshyConfigured, setMeshyConfigured] = useState(true);

  const loadStats = async () => {
    try {
      const data = await apiFetch<StatsResponse>("/stats");
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadConfig = async () => {
    try {
      const data = await apiFetch<ConfigResponse>("/config");
      setMeshyConfigured(data.meshyConfigured);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadStats();
    loadConfig();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a JPG or PNG image.");
      return;
    }

    if (!meshyConfigured) {
      alert("Image to 3D needs a real Meshy API key in Backend/.env before uploads can generate 3D models.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Upload failed");
      }

      const viewerAsset = getUploadViewerAsset(data);
      if (viewerAsset) {
        setViewerAsset(viewerAsset);
      }

      onProjectCreated();
      loadStats();
      alert("Image uploaded and 3D model generated successfully.");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.section
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8"
    >
      <h2 className="text-2xl font-bold text-white mb-2">Upload Image to 3D</h2>
      <p className="text-gray-400 mb-6">
        Upload a JPG or PNG photo of a real-world object to generate a matching 3D view
      </p>
      {!meshyConfigured && (
        <div className="mb-6 rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Image-to-3D is not ready yet. Add a real `MESHY_API_KEY` in `Backend/.env`, then restart the backend.
        </div>
      )}

      <div
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);

          const droppedFile = e.dataTransfer.files[0];
          if (droppedFile) {
            setFile(droppedFile);
          }
        }}
        className={`relative rounded-xl border-2 border-dashed p-12 transition-all ${
          isDragging
            ? "border-cyan-500 bg-cyan-500/10"
            : "border-white/20 hover:border-cyan-500/50 hover:bg-white/5"
        }`}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mb-4">
            <Upload className="w-10 h-10 text-cyan-400" />
          </div>

          <h3 className="text-xl font-semibold text-white mb-2">
            Drop your image here, or{" "}
            <label className="text-cyan-400 cursor-pointer">
              browse
              <input
                type="file"
                hidden
                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) {
                    setFile(selectedFile);
                  }
                }}
              />
            </label>
          </h3>

          <p className="text-gray-400 mb-4">
            Use a clear image with one main object centered for the best 3D result
          </p>

          {file && (
            <p className="text-green-400 text-sm mb-4">
              Selected: {file.name}
            </p>
          )}

          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <FileImage className="w-4 h-4" />
              <span>PNG, JPG, JPEG</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <FileText className="w-4 h-4" />
              <span>Real object photo</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <File className="w-4 h-4" />
              <span>3D view + AR QR</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleUpload}
        disabled={isUploading || !meshyConfigured}
        className="mt-6 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl transition"
      >
        {isUploading ? "Generating 3D..." : meshyConfigured ? "Upload Image" : "Meshy Key Required"}
      </button>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="rounded-xl bg-white/5 p-4 border border-white/10">
          <p className="text-2xl font-bold text-white">{stats.totalUploads}</p>
          <p className="text-sm text-gray-400">Total Uploads</p>
        </div>
        <div className="rounded-xl bg-white/5 p-4 border border-white/10">
          <p className="text-2xl font-bold text-white">{stats.successRate}%</p>
          <p className="text-sm text-gray-400">Success Rate</p>
        </div>
        <div className="rounded-xl bg-white/5 p-4 border border-white/10">
          <p className="text-2xl font-bold text-white">{stats.avgProcessingTime}</p>
          <p className="text-sm text-gray-400">Avg. Processing</p>
        </div>
      </div>
    </motion.section>
  );
}
