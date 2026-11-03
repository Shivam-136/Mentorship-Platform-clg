import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Target,
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  Trash2,
  TrendingUp,
  Award,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import { addGoal, deleteGoal, addMilestone, toggleMilestone } from '../../store/slices/progressSlice';
import useToast from '../../utils/useToast';

export default function MentorshipProgress() {
  const dispatch = useDispatch();
  const toast = useToast();

  const { goals, milestones } = useSelector((state) => state.progress);

  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Career Growth');
  const [firstMilestone, setFirstMilestone] = useState('');

  // Handle creating a new goal
  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!goalTitle.trim()) {
      toast.warning('Please enter a goal title.');
      return;
    }

    const newGoalId = `goal-${Date.now()}`;
    const newGoal = {
      id: newGoalId,
      title: goalTitle.trim(),
      category,
      targetDate: targetDate || 'Flexible',
      createdAt: new Date().toISOString(),
    };

    dispatch(addGoal(newGoal));

    if (firstMilestone.trim()) {
      dispatch(
        addMilestone({
          id: `ms-${Date.now()}`,
          goalId: newGoalId,
          title: firstMilestone.trim(),
          completed: false,
        })
      );
    }

    toast.success('Career goal added to your progress tracker.', 'Goal Created');
    setGoalTitle('');
    setTargetDate('');
    setFirstMilestone('');
    setIsAddGoalModalOpen(false);
  };

  const handleDeleteGoal = (goalId) => {
    dispatch(deleteGoal(goalId));
    toast.info('Goal removed from tracker.', 'Goal Deleted');
  };

  const handleToggleMilestone = (milestoneId) => {
    dispatch(toggleMilestone(milestoneId));
  };

  const [newMilestoneText, setNewMilestoneText] = useState({});
  const handleAddMilestoneToGoal = (goalId) => {
    const text = newMilestoneText[goalId]?.trim();
    if (!text) return;

    dispatch(
      addMilestone({
        id: `ms-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        goalId,
        title: text,
        completed: false,
      })
    );

    setNewMilestoneText({ ...newMilestoneText, [goalId]: '' });
    toast.success('Milestone added.', 'Goal Updated');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Mentorship Progress</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track measurable milestones and target outcomes established with your mentors.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsAddGoalModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          Add Career Goal
        </Button>
      </div>

      {/* Goal Summary Statistics */}
      {goals.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Active Goals</span>
              <p className="text-xl font-extrabold text-slate-900">{goals.length}</p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Completed Milestones</span>
              <p className="text-xl font-extrabold text-slate-900">
                {milestones.filter((m) => m.completed).length} / {milestones.length}
              </p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Completion Rate</span>
              <p className="text-xl font-extrabold text-slate-900">
                {milestones.length > 0
                  ? Math.round((milestones.filter((m) => m.completed).length / milestones.length) * 100)
                  : 0}
                %
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Goals List */}
      {goals.length > 0 ? (
        <div className="space-y-4">
          {goals.map((goal) => {
            const goalMilestones = milestones.filter((m) => m.goalId === goal.id);
            const completedCount = goalMilestones.filter((m) => m.completed).length;
            const progressPercent =
              goalMilestones.length > 0
                ? Math.round((completedCount / goalMilestones.length) * 100)
                : 0;

            return (
              <Card key={goal.id} className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="brand" size="sm">
                        {goal.category}
                      </Badge>
                      {goal.targetDate && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" /> Target: {goal.targetDate}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{goal.title}</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-slate-400 hover:text-rose-600 transition p-1 self-start"
                    title="Delete goal"
                    aria-label="Delete goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600">
                      {completedCount} of {goalMilestones.length} milestones complete
                    </span>
                    <span className="text-brand-600">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-brand-600 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Milestones checklist */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Action Milestones
                  </h4>

                  {goalMilestones.length > 0 ? (
                    <div className="space-y-1.5">
                      {goalMilestones.map((ms) => (
                        <div
                          key={ms.id}
                          onClick={() => handleToggleMilestone(ms.id)}
                          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition text-xs select-none"
                        >
                          {ms.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                          )}
                          <span
                            className={
                              ms.completed
                                ? 'text-slate-400 line-through'
                                : 'text-slate-800 font-medium'
                            }
                          >
                            {ms.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No milestones defined yet.</p>
                  )}

                  {/* Add milestone inline input */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Add another milestone..."
                      value={newMilestoneText[goal.id] || ''}
                      onChange={(e) =>
                        setNewMilestoneText({ ...newMilestoneText, [goal.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddMilestoneToGoal(goal.id);
                        }
                      }}
                      className="flex-1 text-xs px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-brand-500"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddMilestoneToGoal(goal.id)}
                      className="text-xs py-1.5"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Target}
          title="No career goals defined yet"
          description="Establish specific targets and action milestones with your mentors to monitor your professional evolution."
          actionLabel="Create Your First Goal"
          onAction={() => setIsAddGoalModalOpen(true)}
        />
      )}

      {/* Add Goal Modal */}
      <Modal
        isOpen={isAddGoalModalOpen}
        onClose={() => setIsAddGoalModalOpen(false)}
        title="Create Career Goal"
        description="Define a new objective to steer your mentorship sessions."
      >
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <Input
            label="Goal Objective"
            placeholder="e.g. Master Distributed Systems Architecture"
            required
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-brand-500 bg-white"
              >
                <option value="Career Growth">Career Growth</option>
                <option value="System Design">System Design</option>
                <option value="Interview Prep">Interview Prep</option>
                <option value="Leadership">Leadership</option>
                <option value="Technical Mastery">Technical Mastery</option>
              </select>
            </div>

            <Input
              label="Target Date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          <Input
            label="First Action Milestone (Optional)"
            placeholder="e.g. Complete Raft consensus mock interview"
            value={firstMilestone}
            onChange={(e) => setFirstMilestone(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddGoalModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Goal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

