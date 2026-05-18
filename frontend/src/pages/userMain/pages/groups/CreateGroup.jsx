import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, Badge } from '../../components';

/**
 * Step-based Group Buying Room Creator page for userMain module.
 * Replaces generic crowded layout forms with a modern guided structure.
 */
const CreateGroup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    product: '',
    spots: 5,
    customPrice: '',
    duration: 12 // hours
  });

  const handleNext = () => {
    if (step < 2) setStep(prev => prev + 1);
    else {
      // Complete creation mock
      navigate('/groups');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  return (
    <div className="flex flex-col gap-5 select-none animate-fadeIn">
      {/* Header breadcrumb */}
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-black text-primary uppercase tracking-widest">
          Group Room Builder
        </span>
        <span className="text-xs font-bold text-muted">
          Step {step} of 2
        </span>
      </div>

      {step === 1 ? (
        <div className="flex flex-col gap-5 animate-fadeIn">
          <div className="flex flex-col gap-1 px-1">
            <h3 className="text-lg font-black text-ink">Choose Product & Pricing</h3>
            <p className="text-xs text-muted font-medium">Select what you want to buy and target the discount range.</p>
          </div>

          <Input
            label="Product Name"
            placeholder="e.g. Alphonso Mangoes, Organic Avocado"
            value={formData.product}
            onChange={e => setFormData(prev => ({ ...prev, product: e.target.value }))}
            helperText="Write the generic item name or brand."
          />

          <Input
            label="Target Group Buying Price (₹)"
            type="number"
            placeholder="e.g. 299"
            value={formData.customPrice}
            onChange={e => setFormData(prev => ({ ...prev, customPrice: e.target.value }))}
            helperText="Lower target prices attract more community members!"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-5 animate-fadeIn">
          <div className="flex flex-col gap-1 px-1">
            <h3 className="text-lg font-black text-ink">Set Group Limits</h3>
            <p className="text-xs text-muted font-medium">Configure slots and deal validation periods.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-ink/80 uppercase tracking-wide px-1">Required Slots</label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 5, 8, 10].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, spots: num }))}
                  className={`
                    h-11 
                    rounded-2xl 
                    text-xs 
                    font-bold 
                    transition-all
                    ${formData.spots === num ? 'bg-primary text-white shadow-glow' : 'bg-white border border-line text-ink'}
                    active:scale-95
                  `}
                >
                  {num} Users
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-ink/80 uppercase tracking-wide px-1">Active Deal Timeframe</label>
            <div className="grid grid-cols-3 gap-2">
              {[6, 12, 24].map(hours => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, duration: hours }))}
                  className={`
                    h-11 
                    rounded-2xl 
                    text-xs 
                    font-bold 
                    transition-all
                    ${formData.duration === hours ? 'bg-primary text-white shadow-glow' : 'bg-white border border-line text-ink'}
                    active:scale-95
                  `}
                >
                  {hours} Hours
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Button Layout */}
      <div className="flex gap-3 mt-6">
        {step > 1 && (
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex-1"
          >
            Back
          </Button>
        )}
        <Button
          variant="primary"
          onClick={handleNext}
          className="flex-[2]"
          disabled={step === 1 && (!formData.product || !formData.customPrice)}
        >
          {step === 2 ? 'Launch Pool' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};

export default CreateGroup;
