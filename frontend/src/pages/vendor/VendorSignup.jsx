import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Store, MapPin, ShieldCheck, 
  ArrowRight, ArrowLeft, CheckCircle2, 
  Upload, CreditCard, Building2, Smartphone, 
  ChevronDown, Hash, Landmark, Mail, ClipboardList 
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const VendorSignup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    businessName: '',
    businessType: 'Individual',
    category: 'Electronics',
    gstNumber: '',
    whatToSell: '',
    city: '',
    address: '',
    pincode: '',
    accountNumber: '',
    ifscCode: ''
  });

  const navigate = useNavigate();

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const steps = [
    { title: 'Identity', icon: User },
    { title: 'Business', icon: Store },
    { title: 'Location', icon: MapPin },
    { title: 'Verify', icon: ShieldCheck },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-8 px-4 md:py-12">
      <div className="max-w-lg mx-auto">
        {/* Back to Login */}
        <Link to="/login" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-secondary font-bold mb-6 transition-colors group text-xs uppercase tracking-widest">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        {/* Progress Stepper */}
        <div className="flex justify-between mb-10 relative px-2">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 -z-0">
             <motion.div 
               className="h-full bg-secondary"
               initial={{ width: '0%' }}
               animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
             />
          </div>
          {steps.map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[10px] transition-all duration-300 ${
                step > i + 1 ? 'bg-secondary text-white' : 
                step === i + 1 ? 'bg-secondary text-white shadow-lg shadow-blue-500/20 ring-4 ring-blue-50' : 
                'bg-white border-2 border-gray-100 text-gray-400'
              }`}>
                {step > i + 1 ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider ${step === i + 1 ? 'text-secondary' : 'text-gray-400'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <motion.div 
          layout
          className="bg-white rounded-[1.5rem] p-7 md:p-8 shadow-xl shadow-blue-500/5 border border-gray-100 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-1">Let's start with you</h2>
                  <p className="text-gray-500 font-medium mb-8">Personal details for account ownership</p>
                </div>
                
                <div className="space-y-4">
                  <InputField 
                    label="Full Name" 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleInputChange} 
                    placeholder="Enter your legal name"
                    icon={User}
                  />
                  <div className="relative group">
                    <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Mobile Number</label>
                    <div className="flex gap-2">
                      <div className="flex-1 flex items-center border-2 border-gray-100 rounded-2xl focus-within:border-secondary transition-colors pr-4 px-4 py-3.5">
                        <Smartphone size={20} className="text-gray-300 mr-3" />
                        <input 
                          type="tel" 
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          className="w-full bg-transparent outline-none font-bold text-gray-900 placeholder:font-medium placeholder:text-gray-300"
                          placeholder="Ex: 98765 43210"
                        />
                      </div>
                      <button className="bg-blue-50 text-secondary font-black px-4 rounded-2xl hover:bg-blue-100 transition-colors text-sm">
                        Verify
                      </button>
                    </div>
                  </div>
                  <InputField 
                    label="Email (Optional)" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    placeholder="name@business.com"
                    type="email"
                    icon={ShieldCheck}
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-1">Business Identity</h2>
                  <p className="text-gray-500 font-medium mb-8">Tell us about your brand and products</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <InputField 
                      label="Business Name" 
                      name="businessName" 
                      value={formData.businessName} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Acme Tech Solutions"
                      icon={Building2}
                    />
                  </div>
                  <SelectField 
                    label="Business Type" 
                    name="businessType" 
                    value={formData.businessType} 
                    onChange={handleInputChange} 
                    options={['Individual', 'Shop', 'Company']}
                  />
                  <SelectField 
                    label="Category" 
                    name="category" 
                    value={formData.category} 
                    onChange={handleInputChange} 
                    options={['Electronics', 'Cars', 'Appliances', 'Fashion', 'Home Decor']}
                  />
                  <div className="md:col-span-2">
                     <InputField 
                      label="GST Number (Optional)" 
                      name="gstNumber" 
                      value={formData.gstNumber} 
                      onChange={handleInputChange} 
                      placeholder="Ex: 22AAAAA0000A1Z5"
                      icon={Hash}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2 px-1">What do you want to sell?</label>
                    <textarea 
                      name="whatToSell"
                      value={formData.whatToSell}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-secondary outline-none font-medium h-24 transition-all"
                      placeholder="Briefly describe your products..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-1">Store Location</h2>
                  <p className="text-gray-500 font-medium mb-8">Where can users find you or where do you ship from?</p>
                </div>

                <div className="space-y-4">
                  <InputField 
                    label="City" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Mumbai"
                    icon={MapPin}
                  />
                  <InputField 
                    label="Area / Full Address" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleInputChange} 
                    placeholder="Building, Street, Landmark"
                  />
                  <InputField 
                    label="Pincode" 
                    name="pincode" 
                    value={formData.pincode} 
                    onChange={handleInputChange} 
                    placeholder="Ex: 400001"
                    type="number"
                    icon={MapPin}
                  />
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-1">Final Verification</h2>
                  <p className="text-gray-500 font-medium mb-8">Secure your payouts and verify your business</p>
                </div>

                <div className="space-y-6">
                  {/* Mock Uploads */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <UploadZone label="ID Proof (Aadhar/PAN)" />
                    <UploadZone label="Business License / GST" />
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                      <CreditCard size={20} className="text-secondary" />
                      Banking Details
                    </h3>
                    <div className="space-y-4">
                      <InputField 
                        label="Account Number" 
                        name="accountNumber" 
                        value={formData.accountNumber} 
                        onChange={handleInputChange} 
                        placeholder="0000 1111 2222 3333"
                        type="password"
                      />
                      <InputField 
                        label="IFSC Code" 
                        name="ifscCode" 
                        value={formData.ifscCode} 
                        onChange={handleInputChange} 
                        placeholder="SBIN0001234"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-12 flex gap-4">
            {step > 1 && (
              <button 
                onClick={prevStep}
                className="flex-[1] py-4 rounded-2xl font-black text-gray-500 bg-gray-50 hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={20} />
                Back
              </button>
            )}
            <button 
              onClick={step === 4 ? () => navigate('/vendor/dashboard') : nextStep}
              className={`flex-[2] py-4 rounded-2xl font-black text-white transition-all flex items-center justify-center gap-2 shadow-lg ${
                step === 4 ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20' : 'bg-secondary hover:bg-blue-700 shadow-blue-500/20'
              }`}
            >
              {step === 4 ? 'Complete Registration' : 'Continue'}
              <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, placeholder, type = "text", icon: Icon }) => (
  <div className="relative group">
    <label className="block text-sm font-black text-gray-700 mb-2 px-1 uppercase tracking-wider">{label}</label>
    <div className="flex items-center border-2 border-gray-100 rounded-2xl focus-within:border-secondary focus-within:bg-white bg-gray-50/30 transition-all pr-4 px-4 py-3.5">
      {Icon && <Icon size={20} className="text-gray-400 group-focus-within:text-secondary transition-colors mr-3" />}
      <input 
        type={type} 
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent outline-none font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium"
        placeholder={placeholder}
        required
      />
    </div>
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="relative group text-left">
    <label className="block text-sm font-black text-gray-700 mb-2 px-1 uppercase tracking-wider">{label}</label>
    <div className="relative">
      <select 
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-4 bg-gray-50/30 rounded-2xl border-2 border-gray-100 focus:border-secondary focus:bg-white outline-none font-bold text-gray-900 appearance-none cursor-pointer transition-all"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-secondary transition-colors" size={20} />
    </div>
  </div>
);

const UploadZone = ({ label }) => (
  <div className="border-2 border-dashed border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-secondary transition-colors cursor-pointer group">
    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-secondary transition-colors">
      <Upload size={20} />
    </div>
    <span className="text-xs font-bold text-gray-400 group-hover:text-secondary transition-colors text-center">{label}</span>
  </div>
);

export default VendorSignup;
