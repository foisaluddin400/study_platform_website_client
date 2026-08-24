"use client";

import React from "react";
import { X, Download, FileText, ExternalLink } from "lucide-react";
import { Button } from "./Button";

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fileUrl?: string;
  fileBlob?: File | Blob | null;
  fileType?: string;
  onConfirm?: () => void;
  confirmText?: string;
  isConfirming?: boolean;
}

export function FilePreviewModal({
  isOpen,
  onClose,
  title,
  fileUrl,
  fileBlob,
  fileType = "PDF",
  onConfirm,
  confirmText = "Confirm & Upload",
  isConfirming = false,
}: FilePreviewModalProps) {
  if (!isOpen) return null;

  // Derive preview URL
  let previewUrl = fileUrl;
  if (fileBlob) {
    previewUrl = URL.createObjectURL(fileBlob);
  }

  const isPdf = fileType.toUpperCase().includes("PDF") || (fileBlob && fileBlob.type.includes("pdf"));
  const isImage =
    fileType.toUpperCase().includes("JPG") ||
    fileType.toUpperCase().includes("JPEG") ||
    fileType.toUpperCase().includes("PNG") ||
    fileType.toUpperCase().includes("WEBP") ||
    (fileBlob && fileBlob.type.includes("image"));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{title}</h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Document Verification Viewer</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {previewUrl && (
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Preview Area */}
        <div className="flex-1 overflow-auto p-2 sm:p-4 bg-slate-100/50 flex items-center justify-center min-h-[300px] sm:min-h-[420px] max-h-[70vh]">
          {previewUrl ? (
            isPdf ? (
              <iframe
                src={`${previewUrl}#toolbar=0`}
                className="w-full h-full min-h-[320px] sm:min-h-[480px] rounded-xl border border-slate-200 shadow-sm bg-white"
                title="PDF Preview"
              />
            ) : isImage ? (
              <img
                src={previewUrl}
                alt={title}
                className="max-h-[350px] sm:max-h-[500px] max-w-full rounded-xl object-contain shadow-md border border-slate-200 bg-white p-2"
              />
            ) : (
              <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 space-y-3">
                <FileText className="w-12 h-12 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-800">Document ready for viewing</p>
                <p className="text-xs text-slate-500 max-w-sm">
                  This document type cannot be embedded inline. Click below to view or download.
                </p>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-all shadow-sm"
                >
                  <Download className="w-4 h-4" /> Download / Open File
                </a>
              </div>
            )
          ) : (
            <p className="text-xs text-slate-400">No preview available.</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-end gap-3 bg-white">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          {onConfirm && (
            <Button
              variant="primary"
              size="sm"
              onClick={onConfirm}
              isLoading={isConfirming}
            >
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
