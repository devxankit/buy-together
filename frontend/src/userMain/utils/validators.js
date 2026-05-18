/**
 * Form validator schemas for the userMain module.
 * Protects inputs from unexpected exceptions or broken states.
 */

/**
 * Validates 10-digit Indian phone numbers.
 */
export const validatePhoneNumber = (phone) => {
  const clean = phone.replace(/\D/g, '');
  if (!clean) return 'Phone number is required';
  if (clean.length !== 10) return 'Phone number must be exactly 10 digits';
  return '';
};

/**
 * Validates standard 6-digit verification codes.
 */
export const validateOTP = (otp) => {
  const clean = otp.replace(/\D/g, '');
  if (!clean) return 'OTP is required';
  if (clean.length !== 6) return 'Verification code must be 6 digits';
  return '';
};

/**
 * Validates standard group buy creation forms.
 */
export const validateGroupForm = (values) => {
  const errors = {};
  
  if (!values.product || !values.product.trim()) {
    errors.product = 'Product name is required';
  } else if (values.product.trim().length < 3) {
    errors.product = 'Product name must be at least 3 characters';
  }

  const price = Number(values.customPrice);
  if (!values.customPrice) {
    errors.customPrice = 'Target price is required';
  } else if (isNaN(price) || price <= 0) {
    errors.customPrice = 'Target price must be a valid positive amount';
  }

  return errors;
};
