"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRole } from "@/context/RoleContext";
import {
  Send,
  Loader2,
  Paperclip,
  Trash2,
  Check,
  CheckCheck,
  FileText,
  Clock,
  Sparkles,
  X,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { FilePreviewModal } from "@/components/ui/FilePreviewModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { messagesApi } from "@/lib/api/messages";
import { getSocket } from "@/lib/socket";
import { ChatMessage } from "@/types";

export default function StudentChatPage() {
  const { currentUser } = useRole();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [counselorTyping, setCounselorTyping] = useState<string | null>(null);

  // File attachment state
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    size: string;
    type: string;
    fileUrl: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Preview & Delete states
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    title: string;
    fileUrl?: string;
  }>({
    isOpen: false,
    title: "",
    fileUrl: "",
  });

  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    messageId: string;
  }>({
    isOpen: false,
    messageId: "",
  });

  const quickReplies = [
    "I have uploaded my updated academic transcripts.",
    "Could you review my university statement of purpose?",
    "When is the deposit deadline for my unconditional offer?",
    "What documents are needed for my student visa application?",
  ];

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await messagesApi.getAll();
        setMessages(data || []);

        // Mark as seen and join chat room
        const socket = getSocket();
        if (socket) {
          socket.emit("join_chat", {});
          socket.emit("mark_seen", {});
        }
        messagesApi.markSeen().catch(() => {});
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  // Real-time socket events
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit("join_chat", {});

    const handleIncomingMessage = (msg: ChatMessage) => {
      setMessages((prev) => {
        const msgId = msg.id || msg._id;
        const exists = prev.some((m) => (m.id || m._id) === msgId);
        if (exists) return prev;
        return [...prev, msg];
      });
      socket.emit("mark_seen", {});
      messagesApi.markSeen().catch(() => {});
    };

    const handleTyping = (data: { userName?: string; isTyping?: boolean }) => {
      if (data.isTyping === false) {
        setCounselorTyping(null);
      } else {
        setCounselorTyping(data.userName || "Counselor");
      }
    };

    const handleStopTyping = () => {
      setCounselorTyping(null);
    };

    const handleMessageDeleted = (data: { messageId: string }) => {
      setMessages((prev) =>
        prev.map((m) =>
          (m.id || m._id) === data.messageId
            ? { ...m, isDeleted: true, text: "This message was deleted.", attachment: undefined }
            : m
        )
      );
    };

    const handleMessagesSeen = () => {
      setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
    };

    socket.on("new_message", handleIncomingMessage);
    socket.on("receive_message", handleIncomingMessage);
    socket.on("user_typing", handleTyping);
    socket.on("user_stop_typing", handleStopTyping);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("messages_seen", handleMessagesSeen);

    return () => {
      socket.off("new_message", handleIncomingMessage);
      socket.off("receive_message", handleIncomingMessage);
      socket.off("user_typing", handleTyping);
      socket.off("user_stop_typing", handleStopTyping);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("messages_seen", handleMessagesSeen);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, counselorTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text && !attachedFile) return;

    const currentAttachment = attachedFile;
    setInputMessage("");
    setAttachedFile(null);
    setSending(true);

    const socket = getSocket();
    if (socket) {
      socket.emit("send_message", {
        text,
        attachment: currentAttachment,
      });
      socket.emit("stop_typing", {});
    } else {
      try {
        const created = await messagesApi.send({
          text,
          attachment: currentAttachment,
        });
        setMessages((prev) => [...prev, created]);
      } catch (err) {
        console.error("Failed to send message", err);
      }
    }
    setSending(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    const socket = getSocket();
    if (socket) {
      socket.emit("typing", {
        isTyping: true,
        userName: currentUser.name || "Student",
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop_typing", {});
      }, 3000);
    }
  };

  const handleInputBlur = () => {
    const socket = getSocket();
    if (socket) {
      socket.emit("stop_typing", {});
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const formattedSize =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      setAttachedFile({
        name: file.name,
        size: formattedSize,
        type: file.type || "application/octet-stream",
        fileUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleDeleteMessage = async () => {
    if (!confirmDelete.messageId) return;
    const msgId = confirmDelete.messageId;

    const socket = getSocket();
    if (socket) {
      socket.emit("delete_message", { messageId: msgId });
    }

    try {
      await messagesApi.delete(msgId);
    } catch (err) {
      // ignore
    }

    setMessages((prev) =>
      prev.map((m) =>
        (m.id || m._id) === msgId
          ? { ...m, isDeleted: true, text: "This message was deleted.", attachment: undefined }
          : m
      )
    );
    setConfirmDelete({ isOpen: false, messageId: "" });
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-0.5">
            <span>Student Portal</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">Live Support</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            Admissions Counselor Chat
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
          <div className="text-left">
            <p className="font-bold text-xs text-slate-900">Assigned Counselor Team</p>
            <span className="text-[10px] text-teal-700 font-medium">Direct Live Channel</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
        {/* Messages List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-slate-50/40">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
              <span className="text-xs">Connecting to counselor channel...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-center p-8">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="font-bold text-xs text-slate-800 mt-2">Welcome to your admissions desk!</p>
              <p className="text-[11px] text-slate-500 max-w-sm">
                Send any inquiry to your assigned counselor. Our team will review and reply directly to you.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isSystem = msg.senderRole === "system";
              const isMe = msg.senderRole === "student" || msg.sender === currentUser.id;

              if (isSystem) {
                return (
                  <div key={msg.id || msg._id || index} className="flex justify-center my-2">
                    <div className="px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-[11px] text-teal-900 font-medium shadow-2xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>
                        <strong>{msg.senderName}:</strong> {msg.text}
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id || msg._id || index}
                  className={`flex flex-col group ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 shadow-2xs relative ${
                      msg.isDeleted
                        ? "bg-slate-100 text-slate-400 italic border border-slate-200"
                        : isMe
                        ? "bg-teal-600 text-white rounded-br-xs"
                        : "bg-white text-slate-900 border border-slate-200 rounded-bl-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] opacity-80 pb-0.5">
                      <span className="font-bold">{msg.senderName || (isMe ? "You" : "Counselor")}</span>
                      <span className="text-[10px]">
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Just now"}
                      </span>
                    </div>

                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                    {/* Attachment */}
                    {msg.attachment && !msg.isDeleted && (
                      <div className="pt-1.5">
                        <div
                          onClick={() =>
                            setPreviewModal({
                              isOpen: true,
                              title: msg.attachment?.name || "Document Attachment",
                              fileUrl: msg.attachment?.fileUrl || msg.attachment?.url,
                            })
                          }
                          className={`p-2 rounded-xl flex items-center gap-2 cursor-pointer transition-all ${
                            isMe ? "bg-teal-700/80 hover:bg-teal-700" : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                          }`}
                        >
                          <FileText className="w-4 h-4 shrink-0" />
                          <span className="truncate flex-1 font-semibold">{msg.attachment.name}</span>
                          {msg.attachment.size && (
                            <span className="text-[10px] opacity-75">{msg.attachment.size}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Seen receipts for student messages */}
                    {isMe && !msg.isDeleted && (
                      <div className="flex items-center justify-end gap-1 pt-1 text-[10px] opacity-80">
                        {msg.read ? (
                          <span className="flex items-center gap-0.5">
                            Seen <CheckCheck className="w-3 h-3 text-white" />
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5">
                            Sent <Check className="w-3 h-3 text-teal-200" />
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Student can delete their own message */}
                  {isMe && !msg.isDeleted && (
                    <button
                      onClick={() =>
                        setConfirmDelete({
                          isOpen: true,
                          messageId: (msg.id || msg._id) as string,
                        })
                      }
                      className="opacity-0 group-hover:opacity-100 text-[10px] text-slate-400 hover:text-rose-600 mt-0.5 transition-opacity px-1 cursor-pointer"
                    >
                      Delete message
                    </button>
                  )}
                </div>
              );
            })
          )}

          {/* Typing Indicator */}
          {counselorTyping && (
            <div className="flex items-center gap-2 text-xs text-teal-700 font-semibold animate-pulse pl-1">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span>{counselorTyping} is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider shrink-0 hidden sm:inline">
            Quick Prompts:
          </span>
          {quickReplies.map((reply, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(reply)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 text-slate-600 transition-all font-medium shrink-0 cursor-pointer whitespace-nowrap"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Attached file preview chip */}
        {attachedFile && (
          <div className="px-4 py-2 bg-teal-50 border-t border-teal-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-teal-900 min-w-0 pr-2">
              <FileText className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="font-semibold truncate max-w-[200px] sm:max-w-xs">{attachedFile.name}</span>
              <span className="text-[10px] text-teal-600 shrink-0">({attachedFile.size})</span>
            </div>
            <button
              onClick={() => setAttachedFile(null)}
              className="p-1 text-teal-700 hover:text-rose-600 rounded-md transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Bottom Input Form */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Attach file"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder="Ask your admissions counselor a question..."
              value={inputMessage}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="flex-1 px-3 sm:px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all font-medium min-w-0"
            />

            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={sending}
              disabled={!inputMessage.trim() && !attachedFile}
              leftIcon={<Send className="w-4 h-4" />}
            >
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>
        </div>
      </div>

      {/* Attachment Preview Modal */}
      <FilePreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal((prev) => ({ ...prev, isOpen: false }))}
        title={previewModal.title}
        fileUrl={previewModal.fileUrl}
      />

      {/* Confirm Delete Message */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, messageId: "" })}
        onConfirm={handleDeleteMessage}
        title="Delete Chat Message"
        message="Are you sure you want to delete this message?"
        confirmText="Delete Message"
      />
    </div>
  );
}

