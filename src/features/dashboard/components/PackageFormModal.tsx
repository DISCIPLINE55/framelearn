import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Select } from '../../../components/ui/Select';
import { Service, ServicePackage } from '../../../types/database';
import {
  CreatePackageInput,
  UpdatePackageInput,
  generatePackageSlug,
  normalizeDeliverables,
} from '../../services';
import { Plus, X, Star, Coins, Check } from 'lucide-react';

export interface PackageFormModalProps {
  isOpen: boolean;
  packageToEdit: ServicePackage | null;
  services: Service[];
  defaultServiceId?: string;
  onClose: () => void;
  onSubmit: (input: CreatePackageInput | UpdatePackageInput, packageId?: string) => Promise<boolean>;
  isLoading?: boolean;
}

export const PackageFormModal: React.FC<PackageFormModalProps> = ({
  isOpen,
  packageToEdit,
  services,
  defaultServiceId,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const isEditing = Boolean(packageToEdit);

  const [name, setName] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const [description, setDescription] = useState('');
  const [isCustomQuote, setIsCustomQuote] = useState(false);
  const [priceAmount, setPriceAmount] = useState('');
  const [currency, setCurrency] = useState('GHS');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [newDeliverable, setNewDeliverable] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState('0');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (packageToEdit) {
      setName(packageToEdit.name);
      setServiceId(packageToEdit.service_id);
      setSlug(packageToEdit.slug);
      setIsSlugCustomized(true);
      setDescription(packageToEdit.description || '');
      if (packageToEdit.price_amount === null || packageToEdit.price_amount === undefined) {
        setIsCustomQuote(true);
        setPriceAmount('');
      } else {
        setIsCustomQuote(false);
        setPriceAmount(String(packageToEdit.price_amount));
      }
      setCurrency(packageToEdit.currency || 'GHS');
      setDurationMinutes(packageToEdit.duration_minutes ? String(packageToEdit.duration_minutes) : '');
      setDeliverables(normalizeDeliverables(packageToEdit.deliverables));
      setIsFeatured(packageToEdit.is_featured);
      setIsActive(packageToEdit.is_active);
      setSortOrder(String(packageToEdit.sort_order ?? 0));
    } else {
      setName('');
      setServiceId(defaultServiceId || (services.length > 0 ? services[0].id : ''));
      setSlug('');
      setIsSlugCustomized(false);
      setDescription('');
      setIsCustomQuote(false);
      setPriceAmount('');
      setCurrency('GHS');
      setDurationMinutes('');
      setDeliverables([]);
      setIsFeatured(false);
      setIsActive(true);
      setSortOrder('0');
    }
    setNewDeliverable('');
    setFormErrors({});
  }, [packageToEdit, isOpen, defaultServiceId, services]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!isSlugCustomized) {
      setSlug(generatePackageSlug(val));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setIsSlugCustomized(true);
  };

  const handleAddDeliverable = () => {
    const item = newDeliverable.trim();
    if (item && !deliverables.includes(item)) {
      setDeliverables([...deliverables, item]);
      setNewDeliverable('');
    }
  };

  const handleRemoveDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, idx) => idx !== index));
  };

  const handleKeyDownDeliverable = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddDeliverable();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = 'Please provide a package name.';
    }
    if (!serviceId.trim()) {
      errors.serviceId = 'Please select an associated photography service.';
    }

    if (!isCustomQuote) {
      if (priceAmount.trim() === '') {
        errors.price = 'Please enter a price amount, or select "Custom Quotation".';
      } else {
        const num = Number(priceAmount);
        if (isNaN(num) || num < 0) {
          errors.price = 'Price must be a valid non-negative number.';
        }
      }
    }

    if (durationMinutes.trim() !== '') {
      const dur = Number(durationMinutes);
      if (isNaN(dur) || dur <= 0) {
        errors.duration = 'Duration must be a positive number of minutes.';
      }
    }

    if (sortOrder.trim() !== '') {
      const so = Number(sortOrder);
      if (isNaN(so) || so < 0) {
        errors.sortOrder = 'Sort order must be a non-negative number.';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const payload: CreatePackageInput = {
      name: name.trim(),
      service_id: serviceId.trim(),
      slug: slug.trim() ? generatePackageSlug(slug) : generatePackageSlug(name),
      description: description.trim() || null,
      price_amount: isCustomQuote ? null : Number(priceAmount),
      currency: currency.trim() || 'GHS',
      duration_minutes: durationMinutes.trim() ? Math.round(Number(durationMinutes)) : null,
      deliverables,
      is_featured: isFeatured,
      is_active: isActive,
      sort_order: Number(sortOrder) || 0,
    };

    const success = await onSubmit(payload, packageToEdit?.id);
    if (success) {
      onClose();
    }
  };

  const serviceOptions = services.map((s) => ({
    value: s.id,
    label: `${s.name} (${s.category})`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Photography Package' : 'Create Photography Package'}
      size="lg"
    >
      <form noValidate onSubmit={handleSubmit} className="space-y-6 pt-2">
        {/* Service & Package Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Associated Photography Service"
            required
            options={serviceOptions}
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            errorText={formErrors.serviceId}
            helperText="Choose the discipline offering this package."
          />

          <Input
            label="Package Name"
            required
            placeholder="e.g. Standard Portrait Session"
            value={name}
            onChange={handleNameChange}
            errorText={formErrors.name}
            helperText="Clear and client-facing title."
          />
        </div>

        {/* Slug & Display Order */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="URL Slug"
            placeholder="e.g. standard-portrait-session"
            value={slug}
            onChange={handleSlugChange}
            helperText="URL-safe identifier (auto-generated)."
          />

          <Input
            label="Display Order"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            errorText={formErrors.sortOrder}
            helperText="Controls position within service (lowest first)."
          />
        </div>

        {/* Description */}
        <Textarea
          label="Package Description"
          placeholder="Briefly describe what this package is best suited for..."
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          helperText="Highlights the ideal scenario or purpose of this package."
        />

        {/* Pricing Configuration */}
        <div className="p-4 bg-cream/50 rounded-frame border-2 border-sage-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-small font-bold text-navy flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-sage" />
              Pricing & Quotation
            </span>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isCustomQuote}
                onChange={(e) => setIsCustomQuote(e.target.checked)}
                className="w-4 h-4 text-navy rounded border-sage focus:ring-sage"
              />
              <span className="text-xs font-bold text-navy">
                Custom Quotation (No fixed price)
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
            <div className="sm:col-span-2">
              <Input
                label="Price Amount"
                type="number"
                min="0"
                step="0.01"
                placeholder={isCustomQuote ? 'Inquire for a Quote' : 'e.g. 750'}
                value={isCustomQuote ? '' : priceAmount}
                disabled={isCustomQuote}
                onChange={(e) => setPriceAmount(e.target.value)}
                errorText={formErrors.price}
                helperText={
                  isCustomQuote
                    ? 'Displayed to public as "Inquire for a Quote".'
                    : 'Fixed package fee in Ghana Cedis.'
                }
              />
            </div>

            <Input
              label="Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              disabled={isCustomQuote}
              helperText="Default currency is GHS."
            />
          </div>
        </div>

        {/* Duration & Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <Input
            label="Duration (Minutes)"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 60"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            errorText={formErrors.duration}
            helperText="Estimated session time (e.g. 60 min = 1 hour)."
          />

          <div className="pt-2 sm:pt-6 space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer select-none p-2 rounded hover:bg-cream/40 border border-transparent hover:border-sage-200">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-navy rounded border-sage focus:ring-sage"
              />
              <div className="flex items-center gap-1.5">
                <Star className={`w-4 h-4 ${isFeatured ? 'fill-sage text-sage' : 'text-gray-400'}`} />
                <span className="text-small font-bold text-navy">Mark as Featured Package</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none p-2 rounded hover:bg-cream/40 border border-transparent hover:border-sage-200">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-navy rounded border-sage focus:ring-sage"
              />
              <span className="text-small font-bold text-navy">
                Package Active (Available to Public)
              </span>
            </label>
          </div>
        </div>

        {/* Deliverables Management */}
        <div className="p-4 bg-white rounded-frame border-2 border-sage-200 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-small font-bold text-navy flex items-center gap-1.5">
              <Check className="w-4 h-4 text-sage" />
              Package Deliverables ({deliverables.length})
            </label>
            <span className="text-xs text-navy/70">
              Press Enter or click Add to add items
            </span>
          </div>

          {/* Add input */}
          <div className="flex gap-2">
            <Input
              placeholder="e.g. 20 high-resolution edited images"
              value={newDeliverable}
              onChange={(e) => setNewDeliverable(e.target.value)}
              onKeyDown={handleKeyDownDeliverable}
              fullWidth
            />
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleAddDeliverable}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add
            </Button>
          </div>

          {/* Deliverables List */}
          {deliverables.length === 0 ? (
            <p className="text-xs text-navy/60 italic py-2">
              No deliverables added yet. Add items such as photos, prints, or gallery access.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-40 overflow-y-auto pt-1">
              {deliverables.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded bg-cream/40 border border-sage-200 text-xs font-medium text-navy"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sage/20 text-navy font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    {item}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDeliverable(idx)}
                    className="p-1 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded"
                    aria-label={`Remove deliverable ${item}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-sage-200">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>

          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            {isEditing ? 'Save Changes' : 'Create Package'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
