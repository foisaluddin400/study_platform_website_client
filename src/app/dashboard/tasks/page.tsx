"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Search,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { tasksApi } from "@/lib/api/tasks";
import { studentsApi } from "@/lib/api/students";
import { usersApi } from "@/lib/api/users";
import { TaskItem, TaskPriority, TaskStatus, Student, TeamMember } from "@/types";

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Confirm delete dialog state
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    taskId: string;
    taskTitle: string;
  }>({
    isOpen: false,
    taskId: "",
    taskTitle: "",
  });

  // Create task state
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    studentId: "",
    assignedTo: "Senior Counselor",
    priority: "High" as TaskPriority,
    dueDate: "Tomorrow",
    category: "General" as const,
    status: "Todo" as TaskStatus,
  });

  // Edit task state (all fields editable)
  const [editTask, setEditTask] = useState({
    id: "",
    title: "",
    description: "",
    studentId: "",
    assignedTo: "",
    priority: "Medium" as TaskPriority,
    dueDate: "",
    category: "General" as any,
    status: "Todo" as TaskStatus,
  });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const [tasksData, studentsData, teamData] = await Promise.all([
        tasksApi.getAll({
          priority: priorityFilter !== "All" ? priorityFilter : undefined,
          status: statusFilter !== "All" ? statusFilter : undefined,
          search: searchQuery || undefined,
        }),
        studentsApi.getAll().catch(() => []),
        usersApi.getTeam().catch(() => []),
      ]);
      setTasks(tasksData);
      setStudents(studentsData);
      setTeamMembers(teamData);
      if (studentsData.length > 0 && !newTask.studentId) {
        setNewTask((prev) => ({ ...prev, studentId: studentsData[0].id }));
      }
    } catch (err) {
      console.error("Failed to load tasks", err);
    } finally {
      setLoading(false);
    }
  }, [priorityFilter, statusFilter, searchQuery]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleTaskStatus = async (task: TaskItem) => {
    const nextStatus: TaskStatus = task.status === "Completed" ? "Todo" : "Completed";
    try {
      const updated = await tasksApi.update(task.id, { status: nextStatus });
      setTasks(tasks.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      console.error("Failed to update task status", err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await tasksApi.create({
        title: newTask.title,
        description: newTask.description,
        studentId: newTask.studentId || undefined,
        assignedTo: newTask.assignedTo,
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        category: newTask.category,
        status: newTask.status,
      });

      setTasks([created, ...tasks]);
      setIsAddModalOpen(false);
      setNewTask({
        title: "",
        description: "",
        studentId: students[0]?.id || "",
        assignedTo: "Senior Counselor",
        priority: "High",
        dueDate: "Tomorrow",
        category: "General",
        status: "Todo",
      });
    } catch (err) {
      console.error("Failed to create task", err);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (task: TaskItem) => {
    setSelectedTask(task);
    setEditTask({
      id: task.id,
      title: task.title,
      description: task.description || "",
      studentId: task.studentId || "",
      assignedTo: task.assignedTo || "Senior Counselor",
      priority: task.priority || "Medium",
      dueDate: task.dueDate || "Tomorrow",
      category: task.category || "General",
      status: task.status || "Todo",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTask.id) return;
    setSubmitting(true);
    try {
      const updated = await tasksApi.update(editTask.id, {
        title: editTask.title,
        description: editTask.description,
        studentId: editTask.studentId || "",
        assignedTo: editTask.assignedTo,
        priority: editTask.priority,
        dueDate: editTask.dueDate,
        category: editTask.category,
        status: editTask.status,
      });

      setTasks(tasks.map((t) => (t.id === editTask.id ? updated : t)));
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update task", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!confirmDelete.taskId) return;
    try {
      await tasksApi.delete(confirmDelete.taskId);
      setTasks(tasks.filter((t) => t.id !== confirmDelete.taskId));
      setConfirmDelete({ isOpen: false, taskId: "", taskTitle: "" });
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Productivity</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">Counselor Action Items</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Task Queue & Follow-ups
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
              {tasks.length} Tasks
            </span>
          </h1>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create New Task
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks by title, assignee, student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Priority filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
        >
          <option value="All">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option value="Todo">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          <span className="text-xs text-slate-500 font-medium">Loading counselor tasks...</span>
        </div>
      ) : tasks.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <p className="text-sm font-bold text-slate-800">No tasks found</p>
          <p className="text-xs text-slate-500">Create a task to stay on top of admissions follow-ups.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">Done</TableHead>
              <TableHead>Task Title & Description</TableHead>
              <TableHead>Related Student</TableHead>
              <TableHead>Assigned Counselor</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                {/* Done Checkbox */}
                <TableCell>
                  <input
                    type="checkbox"
                    checked={task.status === "Completed"}
                    onChange={() => toggleTaskStatus(task)}
                    className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                </TableCell>

                {/* Title */}
                <TableCell>
                  <div>
                    <span
                      className={`font-bold text-xs block ${
                        task.status === "Completed"
                          ? "line-through text-slate-400"
                          : "text-slate-900"
                      }`}
                    >
                      {task.title}
                    </span>
                    {task.description && (
                      <span className="text-[11px] text-slate-500 line-clamp-1">{task.description}</span>
                    )}
                  </div>
                </TableCell>

                {/* Student */}
                <TableCell className="text-xs font-semibold text-slate-800">
                  {task.studentName || "General"}
                </TableCell>

                {/* Assigned */}
                <TableCell className="text-xs text-slate-700">
                  {task.assignedTo}
                </TableCell>

                {/* Category */}
                <TableCell className="text-xs text-slate-600">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200/60">
                    {task.category || "General"}
                  </span>
                </TableCell>

                {/* Priority */}
                <TableCell>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      task.priority === "High"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : task.priority === "Medium"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {task.priority}
                  </span>
                </TableCell>

                {/* Due Date */}
                <TableCell className="text-xs text-slate-500">
                  {task.dueDate}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <StatusBadge status={task.status || "Pending"} />
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => openEditModal(task)}
                      title="Edit task"
                    >
                      <Edit className="w-3.5 h-3.5 text-slate-600 hover:text-teal-600" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() =>
                        setConfirmDelete({
                          isOpen: true,
                          taskId: task.id,
                          taskTitle: task.title,
                        })
                      }
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500 hover:text-rose-700" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Counselor Task"
        description="Schedule a follow-up or document verification action."
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Task Summary"
            placeholder="e.g. Audit 28-day bank statement for Manchester visa application"
            required
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />

          <Textarea
            label="Description / Context"
            placeholder="e.g. Ensure closing balance does not drop below £32,500."
            rows={2}
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Related Student"
              value={newTask.studentId}
              onChange={(e) => setNewTask({ ...newTask, studentId: e.target.value })}
              options={[
                { value: "", label: "General Agency Task" },
                ...students.map((s) => ({ value: s.id, label: `${s.name}` })),
              ]}
            />

            <Select
              label="Assign Staff Member"
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
              options={[
                { value: "Senior Counselor", label: "Senior Counselor" },
                ...teamMembers.map((t) => ({ value: t.name, label: `${t.name} (${t.role})` })),
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Priority Level"
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
              options={[
                { value: "High", label: "High Priority" },
                { value: "Medium", label: "Medium Priority" },
                { value: "Low", label: "Low Priority" },
              ]}
            />

            <Select
              label="Category"
              value={newTask.category}
              onChange={(e) => setNewTask({ ...newTask, category: e.target.value as any })}
              options={[
                { value: "General", label: "General" },
                { value: "Document", label: "Document" },
                { value: "Application", label: "Application" },
                { value: "Offer", label: "Offer" },
                { value: "Visa", label: "Visa" },
                { value: "Financial", label: "Financial" },
                { value: "Follow-up", label: "Follow-up" },
              ]}
            />

            <Input
              label="Due Date"
              placeholder="e.g. Tomorrow or 2026-08-30"
              required
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Task Modal (ALL FIELDS EDITABLE) */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Task Item"
        description="Update task description, assignee, priority, due date, category, or status."
      >
        <form onSubmit={handleUpdateTask} className="space-y-4">
          <Input
            label="Task Summary"
            required
            value={editTask.title}
            onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
          />

          <Textarea
            label="Description / Context"
            rows={2}
            value={editTask.description}
            onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Related Student"
              value={editTask.studentId}
              onChange={(e) => setEditTask({ ...editTask, studentId: e.target.value })}
              options={[
                { value: "", label: "General Agency Task" },
                ...students.map((s) => ({ value: s.id, label: `${s.name}` })),
              ]}
            />

            <Select
              label="Assign Staff Member"
              value={editTask.assignedTo}
              onChange={(e) => setEditTask({ ...editTask, assignedTo: e.target.value })}
              options={[
                { value: "Senior Counselor", label: "Senior Counselor" },
                ...teamMembers.map((t) => ({ value: t.name, label: `${t.name} (${t.role})` })),
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Priority Level"
              value={editTask.priority}
              onChange={(e) => setEditTask({ ...editTask, priority: e.target.value as any })}
              options={[
                { value: "High", label: "High Priority" },
                { value: "Medium", label: "Medium Priority" },
                { value: "Low", label: "Low Priority" },
              ]}
            />

            <Select
              label="Category"
              value={editTask.category}
              onChange={(e) => setEditTask({ ...editTask, category: e.target.value as any })}
              options={[
                { value: "General", label: "General" },
                { value: "Document", label: "Document" },
                { value: "Application", label: "Application" },
                { value: "Offer", label: "Offer" },
                { value: "Visa", label: "Visa" },
                { value: "Financial", label: "Financial" },
                { value: "Follow-up", label: "Follow-up" },
              ]}
            />

            <Select
              label="Task Status"
              value={editTask.status}
              onChange={(e) => setEditTask({ ...editTask, status: e.target.value as TaskStatus })}
              options={[
                { value: "Todo", label: "To Do" },
                { value: "In Progress", label: "In Progress" },
                { value: "Completed", label: "Completed" },
              ]}
            />
          </div>

          <Input
            label="Due Date"
            placeholder="e.g. Tomorrow or 2026-08-30"
            required
            value={editTask.dueDate}
            onChange={(e) => setEditTask({ ...editTask, dueDate: e.target.value })}
          />

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              Save Task Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, taskId: "", taskTitle: "" })}
        onConfirm={handleDeleteTask}
        title="Delete Task Item"
        message={`Are you sure you want to delete task "${confirmDelete.taskTitle}"?`}
        confirmText="Are you sure you want to delete this task?"
      />
    </div>
  );
}
