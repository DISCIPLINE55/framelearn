import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Select } from '../../../components/ui/Select';
import { Service } from '../../../types/database';
import { CreateServiceInput, UpdateServiceInput } from '../../services';

export interface ServiceFormModalProps {
  isOpen: boolean;
  serviceToEdit: Service | null;
  onClose: () => void;
  onSubmit: (input: CreateServiceInput | UpdateServiceInput, serviceId?: string) => Promise<boolean>;
  isLoading?: boolean;
}

const CATEGORY_OPTIONS = [
  { value: 'Portraiture', label: 'Portraiture' },
  { value: 'Academic', label: 'Academic & Graduation' },
  { value: 'Events', label: 'Weddings & Celebrations' },
  { value: 'Outdoor', label: 'Outdoor & Landscapes' },
  { value: 'Commercial', label: 'Commercial & Products' },
  { value: 'Creative Services', label: 'Creative Retouching & Editing' },
  { value: 'Education', label: 'Photography Workshops & Training' },
];

export const ServiceFormModal: React.FC<ServiceFormModalProps> = ({
  isOpen,
  serviceToEdit,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const isEditing = Boolean(serviceToEdit);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Portraiture');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState('1');
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (serviceToEdit) {
      setName(serviceToEdit.name);
      setCategory(serviceToEdit.category);
      setDescription(serviceToEdit.description);
      setSortOrder(String(serviceToEdit.sort_order ?? 1));
      setIsActive(serviceToEdit.is_active);
    } else {
      setName('');
      setCategory('Portraiture');
      setDescription('');
      setSortOrder('1');
      setIsActive(true);
    }
    setFormErrors({});
  }, [serviceToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = 'Please provide a service name.';
    }
    if (!category.trim()) {
      errors.category = 'Please choose a category.';
    }
    if (!description.trim()) {
      errors.description = 'Please provide a service description.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const payload: CreateServiceInput = {
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      sort_order: parseInt(sortOrder, 10) || 0,
      is_active: isActive,
    };

    const success = await onSubmit(payload, serviceToEdit?.id);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Photography Service' : 'Add New Photography Service'}
      description={
        isEditing
          ? `Modify details for "${serviceToEdit?.name}"`
          : 'Define a new photography service offering for FrameLearn Studio.'
      }
      size="md"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            {isEditing ? 'Save Changes' : 'Create Service'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Service Name"
          placeholder="e.g. Executive Studio Portraits"
          value={name}
          onChange={(e) => setName(e.target.value)}
          errorText={formErrors.name}
          required
          disabled={isLoading}
        />

        <Select
          label="Discipline / Category"
          options={CATEGORY_OPTIONS}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          errorText={formErrors.category}
          disabled={isLoading}
        />

        <Textarea
          label="Service Description"
          placeholder="Describe what this photography offering entails, key deliverables, and client experience..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          errorText={formErrors.description}
          rows={4}
          required
          disabled={isLoading}
        />

        <div className="grid grid-cols-2 gap-4 items-center pt-2">
          <Input
            label="Catalog Display Order"
            type="number"
            min="0"
            max="100"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            disabled={isLoading}
          />

          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="service-active-toggle"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 text-navy rounded border-sage-300 focus:ring-sage"
            />
            <label
              htmlFor="service-active-toggle"
              className="text-small font-bold text-navy cursor-pointer select-none"
            >
              Active in Public Catalog
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
};

