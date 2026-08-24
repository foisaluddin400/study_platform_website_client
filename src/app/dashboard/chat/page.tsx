"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRole } from "@/context/RoleContext";
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Eye,
  Trash2,
  Check,
  CheckCheck,
  Shield,
  Loader2,
  FileText,
  X,
  Sparkles,
  UserCheck,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { FilePreviewModal } from "@/components/ui/FilePreviewModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { messagesApi } from "@/lib/api/messages";
import { getSocket } from "@/lib/socket";
import { ChatMessage } from "@/types";

interface ConversationItem {
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  targetDegree?: string;
  targetCountry?: string;
  preferredCourse?: string;
  assignedCounselor?: any;
  assignedCounselors?: any[];
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  isOnline?: boolean;
}

export default function DashboardChatPage() {
  const { role, currentUser } = useRole();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typingUsers, setTypingUsers] = useState<{ [studentId: string]: string }>({});

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

  // Preview & Delete state
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

  // Fetch conversation lists
  const fetchConversations = useCallback(async () => {
    try {
      setLoadingConv(true);
      const data = await messagesApi.getConversations();
      const normalized: ConversationItem[] = (data || []).map((c: any) => ({
        studentId: c.studentId || c.id || "",
        studentName: c.studentName || c.name || "Student Applicant",
        studentAvatar: c.studentAvatar || c.avatar,
        targetDegree: c.targetDegree || "Applicant",
        targetCountry:
          c.targetCountry ||
          (Array.isArray(c.preferredCountries) && c.preferredCountries.length > 0
            ? c.preferredCountries[0]
            : "Global"),
        preferredCourse: c.preferredCourse,
        assignedCounselor: c.assignedCounselor,
        assignedCounselors: c.assignedCounselors,
        unreadCount: typeof c.unreadCount === "number" ? c.unreadCount : 0,
        lastMessage: c.lastMessage || "No messages yet",
        lastMessageTime: c.lastMessageTime || "",
        isOnline: Boolean(c.isOnline),
      }));

      setConversations(normalized);

      const urlParams =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("studentId")
          : null;

      if (urlParams && normalized.some((c) => c.studentId === urlParams)) {
        setSelectedStudentId(urlParams);
      } else if (normalized.length > 0 && !selectedStudentId) {
        setSelectedStudentId(normalized[0].studentId);
      }
    } catch (err) {
      console.error("Failed to load conversations", err);
    } finally {
      setLoadingConv(false);
    }
  }, [selectedStudentId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Fetch messages when selectedStudentId changes
  useEffect(() => {
    if (!selectedStudentId) return;

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const data = await messagesApi.getAll(selectedStudentId);
        setMessages(data || []);

        // Notify socket of joining room & mark as read
        const socket = getSocket();
        if (socket) {
          socket.emit("join_chat", { studentId: selectedStudentId });
          if (role !== "admin") {
            socket.emit("mark_seen", { studentId: selectedStudentId });
          }
        }

        // Also call REST markSeen as fallback
        if (role !== "admin") {
          messagesApi.markSeen(selectedStudentId).catch(() => {});
        }

        // Reset unread count for active conversation locally
        setConversations((prev) =>
          prev.map((c) => (c.studentId === selectedStudentId ? { ...c, unreadCount: 0 } : c))
        );
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedStudentId, role]);

  // Real-time socket listeners
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // Make sure we join current room if selected
    if (selectedStudentId) {
      socket.emit("join_chat", { studentId: selectedStudentId });
    }

    const handleIncomingMessage = (msg: ChatMessage) => {
      const msgStudentId = msg.student || msg.studentId || (msg as any).student?._id;

      if (msgStudentId === selectedStudentId) {
        setMessages((prev) => {
          const msgId = msg.id || msg._id;
          const exists = prev.some((m) => (m.id || m._id) === msgId);
          if (exists) return prev;
          return [...prev, msg];
        });

        if (role !== "admin") {
          socket.emit("mark_seen", { studentId: selectedStudentId });
        }
      }

      // Update conversations preview
      setConversations((prev) =>
        prev.map((c) =>
          c.studentId === msgStudentId
            ? {
                ...c,
                lastMessage: msg.isDeleted ? "This message was deleted." : msg.text || "New message",
                lastMessageTime: msg.createdAt || new Date().toISOString(),
                unreadCount: c.studentId === selectedStudentId ? 0 : c.unreadCount + 1,
              }
            : c
        )
      );
    };

    const handleTyping = (data: { studentId: string; userName?: string; isTyping?: boolean }) => {
      if (data.isTyping === false) {
        setTypingUsers((prev) => {
          const next = { ...prev };
          delete next[data.studentId];
          return next;
        });
      } else {
        setTypingUsers((prev) => ({
          ...prev,
          [data.studentId]: data.userName || "Student",
        }));
      }
    };

    const handleStopTyping = (data: { studentId: string }) => {
      setTypingUsers((prev) => {
        const next = { ...prev };
        delete next[data.studentId];
        return next;
      });
    };

    const handleMessageDeleted = (data: { messageId: string; studentId: string }) => {
      setMessages((prev) =>
        prev.map((m) =>
          (m.id || m._id) === data.messageId
            ? { ...m, isDeleted: true, text: "This message was deleted.", attachment: undefined }
            : m
        )
      );
    };

    const handleMessagesSeen = (data: { studentId: string }) => {
      if (data.studentId === selectedStudentId) {
        setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
      }
    };

    const handleOnlineStatus = (data: { userId: string; online: boolean }) => {
      setConversations((prev) =>
        prev.map((c) => {
          // If conversation belongs to this user ID
          return c;
        })
      );
    };

    socket.on("new_message", handleIncomingMessage);
    socket.on("receive_message", handleIncomingMessage);
    socket.on("user_typing", handleTyping);
    socket.on("user_stop_typing", handleStopTyping);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("messages_seen", handleMessagesSeen);
    socket.on("user_online_status", handleOnlineStatus);

    return () => {
      socket.off("new_message", handleIncomingMessage);
      socket.off("receive_message", handleIncomingMessage);
      socket.off("user_typing", handleTyping);
      socket.off("user_stop_typing", handleStopTyping);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("messages_seen", handleMessagesSeen);
      socket.off("user_online_status", handleOnlineStatus);
    };
  }, [selectedStudentId, role]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputText.trim() && !attachedFile) || !selectedStudentId || role === "admin") return;

    const messageText = inputText.trim();
    const currentAttachment = attachedFile;

    setInputText("");
    setAttachedFile(null);
    setSending(true);

    const socket = getSocket();
    if (socket) {
      socket.emit("send_message", {
        studentId: selectedStudentId,
        text: messageText,
        attachment: currentAttachment,
      });
      socket.emit("stop_typing", { studentId: selectedStudentId });
    } else {
      try {
        const created = await messagesApi.send({
          studentId: selectedStudentId,
          text: messageText,
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
    setInputText(e.target.value);
    const socket = getSocket();
    if (socket && selectedStudentId && role !== "admin") {
      socket.emit("typing", {
        studentId: selectedStudentId,
        isTyping: true,
        userName: currentUser.name || "Counselor",
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop_typing", { studentId: selectedStudentId });
      }, 3000);
    }
  };

  const handleInputBlur = () => {
    const socket = getSocket();
    if (socket && selectedStudentId && role !== "admin") {
      socket.emit("stop_typing", { studentId: selectedStudentId });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read file metadata & generate preview data URL
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

    // Reset input
    e.target.value = "";
  };

  const handleDeleteMessage = async () => {
    if (!confirmDelete.messageId) return;
    const msgId = confirmDelete.messageId;

    const socket = getSocket();
    if (socket && selectedStudentId) {
      socket.emit("delete_message", {
        messageId: msgId,
        studentId: selectedStudentId,
      });
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

  const selectedConv = conversations.find((c) => c.studentId === selectedStudentId);

  const filteredConversations = conversations.filter((c) => {
    const name = c.studentName || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header Banner for Admin Monitoring Mode */}
      {role === "admin" && (
        <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Agency Admin Monitoring Mode:</strong> You are auditing live counselor-student communications in read-only mode.
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
            Read-Only
          </span>
        </div>
      )}

      {/* Main Chat Interface Layout */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row min-h-[500px] h-[calc(100vh-12rem)]">
        {/* Left Sidebar: Student Conversation List */}
        <div className={`${selectedStudentId ? "hidden md:flex" : "flex"} w-full md:w-80 lg:w-96 border-r border-slate-200 flex-col bg-slate-50/50 shrink-0 h-full`}>
          <div className="p-3.5 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={role === "admin" ? "Filter agency chats..." : "Search assigned students..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
            {loadingConv ? (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
                <span className="text-xs text-slate-400">Loading student conversations...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-1">
                <p className="text-xs font-bold text-slate-700">No conversations found</p>
                <p className="text-[11px] text-slate-400">
                  {role === "admin" ? "No chats active across agency." : "You have no assigned students yet."}
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.studentId === selectedStudentId;

                return (
                  <div
                    key={conv.studentId}
                    onClick={() => setSelectedStudentId(conv.studentId)}
                    className={`p-3 rounded-2xl transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? "bg-white shadow-xs border border-teal-200/80 ring-2 ring-teal-500/10"
                        : "hover:bg-white/80"
                    }`}
                  >
                    <Avatar
                      src={conv.studentAvatar}
                      name={conv.studentName}
                      size="md"
                      statusIndicator={conv.isOnline ? "online" : undefined}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {conv.studentName}
                        </span>
                        {conv.lastMessageTime && (
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {new Date(conv.lastMessageTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {conv.lastMessage || "Click to open chat conversation..."}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-teal-700 font-semibold truncate">
                          {conv.targetDegree || "Applicant"} • {conv.targetCountry || "Study Abroad"}
                        </span>

                        {conv.unreadCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-teal-600 text-white text-[10px] font-bold">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Conversation Messages Window */}
        <div className={`${!selectedStudentId ? "hidden md:flex" : "flex"} flex-1 flex-col bg-white h-full`}>
          {selectedStudentId && selectedConv ? (
            <>
              {/* Chat Top Header */}
              <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <button
                    onClick={() => setSelectedStudentId(null)}
                    className="md:hidden p-1 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
                    title="Back to conversations"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <Avatar
                    src={selectedConv.studentAvatar}
                    name={selectedConv.studentName}
                    size="sm"
                    statusIndicator={selectedConv.isOnline ? "online" : undefined}
                  />
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                      {selectedConv.studentName}
                      <span className="text-[10px] font-normal text-slate-500">
                        ({selectedConv.targetCountry || "Study Abroad"} • {selectedConv.targetDegree || "Degree"})
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {typingUsers[selectedStudentId] ? (
                        <span className="text-teal-600 font-semibold animate-pulse">
                          {typingUsers[selectedStudentId]} is typing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-teal-600" />
                          Student Applicant Dossier
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <Link href={`/dashboard/students/${selectedStudentId}`}>
                  <Button variant="outline" size="xs" leftIcon={<Eye className="w-3 h-3" />}>
                    View Student File
                  </Button>
                </Link>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
                {loadingMessages ? (
                  <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
                    <span className="text-xs text-slate-400">Loading conversation history...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-12 text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-700">No messages exchanged yet</p>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                      Send a message to greet the student. Automatic email notifications will be delivered to their inbox.
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isSystem = msg.senderRole === "system";
                    const isCounselorOrAdmin =
                      msg.senderRole === "counselor" ||
                      msg.senderRole === "COUNSELOR" ||
                      msg.senderRole === "AGENCY_ADMIN" ||
                      msg.senderRole === "admin";
                    const isOwnMessage =
                      msg.sender === currentUser.id ||
                      (role === "counselor" && isCounselorOrAdmin);

                    if (isSystem) {
                      return (
                        <div key={msg.id || msg._id || index} className="flex justify-center my-2">
                          <div className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] text-slate-600 font-medium">
                            <span className="font-semibold text-teal-700">{msg.senderName}:</span> {msg.text}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id || msg._id || index}
                        className={`flex flex-col group ${isOwnMessage ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 shadow-2xs relative ${
                            msg.isDeleted
                              ? "bg-slate-100 text-slate-400 italic border border-slate-200"
                              : isOwnMessage
                              ? "bg-teal-600 text-white rounded-br-xs"
                              : "bg-white text-slate-900 border border-slate-200 rounded-bl-xs"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 text-[10px] opacity-80 pb-0.5">
                            <span className="font-bold">{msg.senderName}</span>
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

                          {/* Optional Attachment */}
                          {msg.attachment && !msg.isDeleted && (
                            <div className="pt-2">
                              <div
                                onClick={() =>
                                  setPreviewModal({
                                    isOpen: true,
                                    title: msg.attachment?.name || "Document Attachment",
                                    fileUrl: msg.attachment?.fileUrl || msg.attachment?.url,
                                  })
                                }
                                className={`p-2 rounded-xl flex items-center gap-2 cursor-pointer transition-all ${
                                  isOwnMessage
                                    ? "bg-teal-700/80 hover:bg-teal-700"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-800"
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

                          {/* Seen receipt indicator for own messages */}
                          {isOwnMessage && !msg.isDeleted && (
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

                        {/* Delete message button */}
                        {isOwnMessage && !msg.isDeleted && role !== "admin" && (
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
                <div ref={messagesEndRef} />
              </div>

              {/* Attached file preview chip */}
              {attachedFile && (
                <div className="px-4 py-2 bg-teal-50 border-t border-teal-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-teal-900">
                    <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                    <span className="font-semibold truncate max-w-xs">{attachedFile.name}</span>
                    <span className="text-[10px] text-teal-600">({attachedFile.size})</span>
                  </div>
                  <button
                    onClick={() => setAttachedFile(null)}
                    className="p-1 text-teal-700 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Bottom Input Area */}
              <div className="p-3 border-t border-slate-200 bg-white">
                {role === "admin" ? (
                  <div className="p-2.5 rounded-xl bg-slate-100 text-center text-xs text-slate-500 font-medium">
                    Admin Read-Only Monitoring Enabled. (Sending is reserved for assigned counselors and students).
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
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
                      className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors cursor-pointer"
                      title="Attach file"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>

                    <input
                      type="text"
                      placeholder="Type a counseling response or guidance..."
                      value={inputText}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all font-medium"
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      isLoading={sending}
                      disabled={!inputText.trim() && !attachedFile}
                      leftIcon={<Send className="w-4 h-4" />}
                    >
                      Send
                    </Button>
                  </form>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-2">
              <MessageSquare className="w-12 h-12 text-slate-300" />
              <p className="font-bold text-sm text-slate-700">Select a student conversation</p>
              <p className="text-xs text-slate-400 max-w-sm">
                Choose a student applicant from the sidebar to open their active counseling chat channel.
              </p>
            </div>
          )}
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
        message="Are you sure you want to delete this message from the conversation?"
        confirmText="Delete Message"
      />
    </div>
  );
}

