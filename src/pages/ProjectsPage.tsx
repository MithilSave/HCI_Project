import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectTask, TaskStatus, TaskPriority } from '../types';
import {
  FolderKanban,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  Trash2,
  Edit2,
  User,
  AlertCircle,
  MoreVertical,
  ArrowRight,
  Sparkles,
  CheckSquare,
  Square,
  Send,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const ProjectsPage: React.FC = () => {
  const {
    projects,
    tasks,
    profile,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    toggleChecklistItem,
    addCommentToTask,
  } = useApp();

  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0].id);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [detailModalTask, setDetailModalTask] = useState<ProjectTask | null>(null);
  const [deleteConfirmTaskId, setDeleteConfirmTaskId] = useState<string | null>(null);

  // New task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('todo');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskAssigneeId, setTaskAssigneeId] = useState<string>(profile.id);
  const [taskDueDate, setTaskDueDate] = useState(
    new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]
  );
  const [taskChecklistRaw, setTaskChecklistRaw] = useState('');

  // Comment input state
  const [commentInput, setCommentInput] = useState('');

  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === activeProjectId) || projects[0];
  }, [projects, activeProjectId]);

  const projectTasks = useMemo(() => {
    return tasks.filter((t) => t.projectId === activeProjectId);
  }, [tasks, activeProjectId]);

  const columns: { id: TaskStatus; label: string; dotColor: string }[] = [
    { id: 'todo', label: 'To Do', dotColor: 'bg-[#9CA3AF]' },
    { id: 'in-progress', label: 'In Progress', dotColor: 'bg-[#315CEB]' },
    { id: 'in-review', label: 'In Review', dotColor: 'bg-[#F27C66]' },
    { id: 'done', label: 'Done', dotColor: 'bg-[#20845A]' },
  ];

  // Metrics
  const metrics = useMemo(() => {
    const total = projectTasks.length;
    const done = projectTasks.filter((t) => t.status === 'done').length;
    const dueSoon = projectTasks.filter(
      (t) => t.status !== 'done' && t.priority === 'high'
    ).length;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, dueSoon, progress };
  }, [projectTasks]);

  const handleOpenAddTask = (status: TaskStatus = 'todo') => {
    setTaskTitle('');
    setTaskDesc('');
    setTaskStatus(status);
    setTaskPriority('medium');
    setTaskAssigneeId(profile.id);
    setTaskDueDate(new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]);
    setTaskChecklistRaw('');
    setTaskModalOpen(true);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const assignee = activeProject.members.find((m) => m.id === taskAssigneeId);
    const checklistItems = taskChecklistRaw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    addTask({
      projectId: activeProjectId,
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      status: taskStatus,
      priority: taskPriority,
      assigneeId: taskAssigneeId,
      assigneeName: assignee?.name || 'Alex Chen',
      dueDate: taskDueDate,
      checklistItems,
    });

    setTaskModalOpen(false);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailModalTask || !commentInput.trim()) return;
    addCommentToTask(detailModalTask.id, commentInput.trim());
    setCommentInput('');
    // refresh detail modal task reference
    const updated = tasks.find((t) => t.id === detailModalTask.id);
    if (updated) setDetailModalTask(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Project Switcher & Stats */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3E5E8] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">
              Academic Project Workspace
            </span>
            <Badge variant="cobalt" size="sm">
              {activeProject.courseCode}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#17243A]">
              {activeProject.name}
            </h2>

            {/* Project Switcher Dropdown */}
            <select
              value={activeProjectId}
              onChange={(e) => setActiveProjectId(e.target.value)}
              className="bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-1.5 text-xs font-bold text-[#17243A] focus:outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  Switch: {p.courseCode}
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs sm:text-sm text-[#475467] mt-1 max-w-2xl">
            {activeProject.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Member avatars */}
          <div className="flex items-center -space-x-2">
            {activeProject.members.map((member) => (
              <div
                key={member.id}
                title={`${member.name} (${member.role})`}
                className="w-9 h-9 rounded-full text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-2xs cursor-default"
                style={{ backgroundColor: member.avatarColor }}
              >
                {member.name.charAt(0)}
              </div>
            ))}
          </div>

          <button
            onClick={() => handleOpenAddTask('todo')}
            className="px-4 py-2 bg-[#315CEB] hover:bg-[#2447C5] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Progress & Due Soon Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-3xl border border-[#E3E5E8] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#667085]">Sprint Completion</span>
            <span className="text-xl font-bold font-display text-[#17243A] block">
              {metrics.progress}%
            </span>
          </div>
          <div className="w-24 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#315CEB] rounded-full transition-all"
              style={{ width: `${metrics.progress}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-[#E3E5E8] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#667085]">Tasks Finished</span>
            <span className="text-xl font-bold font-display text-[#20845A] block">
              {metrics.done} of {metrics.total}
            </span>
          </div>
          <CheckCircle2 className="w-6 h-6 text-[#20845A]" />
        </div>

        <div className="p-4 bg-white rounded-3xl border border-[#E3E5E8] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#667085]">High Priority Focus</span>
            <span className="text-xl font-bold font-display text-[#C2410C] block">
              {metrics.dueSoon} Pending
            </span>
          </div>
          <AlertCircle className="w-6 h-6 text-[#F27C66]" />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {columns.map((col) => {
          const colTasks = projectTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-[#FAF9F5] rounded-3xl p-4 border border-[#E3E5E8] flex flex-col min-h-[480px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E3E5E8]">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                  <span className="font-display font-bold text-sm text-[#17243A]">
                    {col.label}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-white border border-[#E3E5E8] text-[11px] font-bold text-[#667085]">
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenAddTask(col.id)}
                  className="p-1 rounded-lg text-[#667085] hover:text-[#17243A] hover:bg-white transition-colors"
                  title={`Add task to ${col.label}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Task Cards Column */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTasks.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#9CA3AF] border border-dashed border-[#E3E5E8] rounded-2xl">
                    No tasks in {col.label}
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const checklistTotal = task.checklist.length;
                    const checklistDone = task.checklist.filter((c) => c.done).length;

                    return (
                      <div
                        key={task.id}
                        className="p-4 bg-white rounded-2xl border border-[#E3E5E8] shadow-2xs hover:shadow-md transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <Badge
                            variant={
                              task.priority === 'high'
                                ? 'coral'
                                : task.priority === 'medium'
                                ? 'warning'
                                : 'neutral'
                            }
                            size="sm"
                          >
                            {task.priority}
                          </Badge>

                          {/* Quick Move Dropdown */}
                          <select
                            value={task.status}
                            onChange={(e) => moveTask(task.id, e.target.value as TaskStatus)}
                            className="text-[11px] bg-[#FAF9F5] border border-[#E3E5E8] rounded-lg px-1.5 py-0.5 text-[#667085] font-semibold focus:outline-none"
                            title="Move column"
                          >
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="in-review">In Review</option>
                            <option value="done">Done</option>
                          </select>
                        </div>

                        <h4
                          onClick={() => setDetailModalTask(task)}
                          className="font-bold text-sm text-[#17243A] cursor-pointer hover:text-[#315CEB] leading-snug"
                        >
                          {task.title}
                        </h4>

                        {task.description && (
                          <p className="text-xs text-[#667085] line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        {/* Checklist Counter */}
                        {checklistTotal > 0 && (
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#667085]">
                            <CheckSquare className="w-3.5 h-3.5 text-[#315CEB]" />
                            <span>
                              {checklistDone}/{checklistTotal} items
                            </span>
                          </div>
                        )}

                        {/* Footer with assignee and due date */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#E3E5E8] text-[11px] text-[#667085]">
                          <div className="flex items-center gap-1 truncate pr-2">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{task.dueDate}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {task.comments.length > 0 && (
                              <span className="flex items-center gap-0.5">
                                <MessageSquare className="w-3 h-3" />
                                {task.comments.length}
                              </span>
                            )}
                            <span
                              className="font-semibold text-[#17243A] px-1.5 py-0.5 rounded bg-[#FAF9F5] border border-[#E3E5E8]"
                              title={task.assigneeName}
                            >
                              {task.assigneeName?.split(' ')[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        title="Create New Project Task"
        subtitle={`Adding to ${activeProject.name}`}
        maxWidth="lg"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#17243A] block mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Conduct usability test with 4 freshmen students..."
              className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#17243A] focus:outline-none focus:border-[#315CEB]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-[#17243A] block mb-1">
                Board Column
              </label>
              <select
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
                className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#17243A]"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="in-review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#17243A] block mb-1">
                Priority
              </label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#17243A]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#17243A] block mb-1">
                Due Date
              </label>
              <input
                type="date"
                required
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#17243A]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#17243A] block mb-1">
              Assignee
            </label>
            <select
              value={taskAssigneeId}
              onChange={(e) => setTaskAssigneeId(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#17243A]"
            >
              {activeProject.members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#17243A] block mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              placeholder="Outline deliverables, references, or links..."
              className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl p-3 text-xs sm:text-sm text-[#17243A]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#17243A] block mb-1">
              Checklist Items (one per line)
            </label>
            <textarea
              rows={2}
              value={taskChecklistRaw}
              onChange={(e) => setTaskChecklistRaw(e.target.value)}
              placeholder="Draft consent form&#10;Book testing pod in Library&#10;Record observations"
              className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl p-3 text-xs text-[#17243A]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E3E5E8]">
            <button
              type="button"
              onClick={() => setTaskModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#667085] hover:bg-[#F3F4F6] rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#315CEB] hover:bg-[#2447C5] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Create Task
            </button>
          </div>
        </form>
      </Modal>

      {/* Task Details & Activity Stream Modal */}
      {detailModalTask && (
        <Modal
          isOpen={true}
          onClose={() => setDetailModalTask(null)}
          title={detailModalTask.title}
          subtitle={`Assignee: ${detailModalTask.assigneeName} · Due: ${detailModalTask.dueDate}`}
          maxWidth="lg"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    detailModalTask.priority === 'high'
                      ? 'coral'
                      : detailModalTask.priority === 'medium'
                      ? 'warning'
                      : 'neutral'
                  }
                >
                  {detailModalTask.priority} priority
                </Badge>
                <Badge variant="cobalt">{detailModalTask.status.toUpperCase()}</Badge>
              </div>

              <button
                onClick={() => {
                  setDeleteConfirmTaskId(detailModalTask.id);
                  setDetailModalTask(null);
                }}
                className="text-xs text-[#B93838] hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Task</span>
              </button>
            </div>

            {detailModalTask.description && (
              <div>
                <span className="text-xs font-bold text-[#17243A] block mb-1 uppercase tracking-wider">
                  Description
                </span>
                <p className="text-xs sm:text-sm text-[#475467] leading-relaxed">
                  {detailModalTask.description}
                </p>
              </div>
            )}

            {/* Checklist */}
            {detailModalTask.checklist.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#17243A] block uppercase tracking-wider">
                  Sub-tasks & Checklist
                </span>
                <div className="space-y-1.5">
                  {detailModalTask.checklist.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        toggleChecklistItem(detailModalTask.id, item.id);
                        setDetailModalTask((prev) =>
                          prev
                            ? {
                                ...prev,
                                checklist: prev.checklist.map((c) =>
                                  c.id === item.id ? { ...c, done: !c.done } : c
                                ),
                              }
                            : null
                        );
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-[#FAF9F5] hover:bg-[#EEF2FF] text-left transition-colors"
                    >
                      {item.done ? (
                        <CheckSquare className="w-4 h-4 text-[#20845A]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#9CA3AF]" />
                      )}
                      <span
                        className={`text-xs ${
                          item.done
                            ? 'line-through text-[#9CA3AF]'
                            : 'font-medium text-[#17243A]'
                        }`}
                      >
                        {item.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Stream */}
            <div className="space-y-3 pt-3 border-t border-[#E3E5E8]">
              <span className="text-xs font-bold text-[#17243A] block uppercase tracking-wider">
                Activity & Team Notes ({detailModalTask.comments.length})
              </span>

              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {detailModalTask.comments.length === 0 ? (
                  <p className="text-xs text-[#9CA3AF] italic">
                    No comments yet. Leave a note below.
                  </p>
                ) : (
                  detailModalTask.comments.map((cm) => (
                    <div
                      key={cm.id}
                      className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E3E5E8] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-[#17243A]">
                        <span>{cm.author}</span>
                        <span className="text-[10px] text-[#9CA3AF] font-normal">
                          {new Date(cm.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-[#475467]">{cm.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment input */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Add a progress update or note..."
                  className="flex-1 bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-1.5 text-xs text-[#17243A] focus:outline-none focus:border-[#315CEB]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#315CEB] text-white rounded-xl text-xs font-bold hover:bg-[#2447C5]"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmTaskId)}
        title="Delete Task?"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete Task"
        variant="danger"
        onConfirm={() => {
          if (deleteConfirmTaskId) {
            deleteTask(deleteConfirmTaskId);
            setDeleteConfirmTaskId(null);
          }
        }}
        onCancel={() => setDeleteConfirmTaskId(null)}
      />
    </div>
  );
};
