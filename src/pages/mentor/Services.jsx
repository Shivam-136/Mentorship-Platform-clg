import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Briefcase, Plus, Clock, DollarSign, Edit2, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import { addService, updateService, deleteService } from '../../store/slices/earningsSlice';
import useToast from '../../utils/useToast';

export default function MentorServices() {
  const dispatch = useDispatch();
  const toast = useToast();

  const services = useSelector((state) => state.earnings.services) || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    duration: '60 mins',
    price: 120,
    description: '',
    active: true,
  });

  const handleOpenCreateModal = () => {
    setEditingServiceId(null);
    setFormData({
      title: '',
      duration: '60 mins',
      price: 120,
      description: '',
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service) => {
    setEditingServiceId(service.id);
    setFormData({
      title: service.title,
      duration: service.duration,
      price: service.price,
      description: service.description || '',
      active: service.active !== false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.warning('Please enter a service title.');
      return;
    }

    if (editingServiceId) {
      dispatch(
        updateService({
          id: editingServiceId,
          updates: {
            ...formData,
            price: Number(formData.price),
          },
        })
      );
      toast.success('Session offering updated successfully.', 'Service Saved');
    } else {
      const newService = {
        id: `srv-${Date.now()}`,
        ...formData,
        price: Number(formData.price),
        createdAt: new Date().toISOString(),
      };
      dispatch(addService(newService));
      toast.success('New session offering added to your profile.', 'Service Created');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteService(id));
    toast.info('Session offering removed.', 'Service Deleted');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Services & Offerings</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure the 1-on-1 session packages and topic reviews you offer to mentees.
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleOpenCreateModal}
          leftIcon={<Plus className="w-4 h-4" />}
          className="self-start sm:self-auto bg-purple-600 hover:bg-purple-700"
        >
          Add Service Offering
        </Button>
      </div>

      {/* Services List */}
      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <Card key={service.id} className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-slate-900">{service.title}</h3>
                  <Badge variant={service.active ? 'purple' : 'slate'} size="sm">
                    {service.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                {service.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-600">
                  <span className="flex items-center gap-1 font-semibold text-slate-900">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    {service.duration}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 font-bold text-slate-900">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    {service.price} USD
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(service)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition"
                    title="Edit service"
                    aria-label="Edit service"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(service.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition"
                    title="Delete service"
                    aria-label="Delete service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No session offerings created yet"
          description="Create structured mentorship topics (e.g. 'System Design Deep Dive', 'Staff+ Promotion Review') with custom rates and duration."
          actionLabel="Create First Offering"
          onAction={handleOpenCreateModal}
        />
      )}

      {/* Add / Edit Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingServiceId ? 'Edit Session Offering' : 'New Session Offering'}
        description="Define session duration, pricing, and prep instructions."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Offering Title"
            placeholder="e.g. System Design Mock Interview"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-purple-500 bg-white"
              >
                <option value="30 mins">30 mins</option>
                <option value="45 mins">45 mins</option>
                <option value="60 mins">60 mins</option>
                <option value="90 mins">90 mins</option>
              </select>
            </div>

            <Input
              label="Session Fee (USD)"
              type="number"
              min="0"
              step="5"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & Preparation Requirements
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:border-purple-500"
              placeholder="Outline what mentees should bring or expect from this session..."
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="activeService"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="h-4 w-4 text-purple-600 rounded"
            />
            <label htmlFor="activeService" className="text-xs text-slate-700 font-medium cursor-pointer">
              Visible and available for mentee booking
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-700">
              {editingServiceId ? 'Update Offering' : 'Publish Offering'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

