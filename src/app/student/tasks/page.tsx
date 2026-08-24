"use client";

import React, { useState, useEffect } from "react";
import { CheckSquare, AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/ui/Badge";
import { tasksApi } from "@/lib/api/tasks";
import { TaskItem } from "@/types";

export default function StudentTasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = await tasksApi.getMyTasks();
        setTasks(data);
      } catch (err) {
        console.error("Failed to load my tasks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const toggleTask = async (task: TaskItem) => {
    const nextStatus = task.status === "Completed" ? "Todo" : "Completed";
    try {
      const updated = await tasksApi.update(task.id, { status: nextStatus as any });
      setTasks(tasks.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
          <span>Student Portal</span>
          <span>•</span>
          <span className="text-teal-700 font-semibold">Action Items</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          My Action Tasks & Counselor Reminders
        </h1>
      </div>

      {/* Task list */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs text-slate-500 font-medium">Loading your action items...</span>
        </div>
      ) : tasks.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <p className="text-sm font-bold text-slate-800">No pending tasks</p>
          <p className="text-xs text-slate-500">You are completely up to date with your admissions requirements.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((t) => (
            <div
              key={t.id}
              onClick={() => toggleTask(t)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                t.status === "Completed"
                  ? "bg-slate-50 border-slate-200 opacity-70"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <input
                  type="checkbox"
                  checked={t.status === "Completed"}
                  onChange={() => {}}
                  className="mt-1 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <div>
                  <h4 className={`text-xs sm:text-sm font-bold ${t.status === "Completed" ? "line-through text-slate-400" : "text-slate-900"}`}>
                    {t.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{t.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-medium">{t.dueDate}</span>
                <StatusBadge status={t.status || "Pending"} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
