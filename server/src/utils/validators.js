const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RE = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

exports.validateRegister = ({ name, email, address, password, role, storeName }) => {
  const errors = [];
  if (typeof name !== 'string' || name.trim().length < 20 || name.trim().length > 60)
    errors.push('Name must be 20–60 characters');
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim()))
    errors.push('Email is not valid');
  if (typeof address !== 'string' || !address.trim() || address.trim().length > 400)
    errors.push('Address is required and must be at most 400 characters');
  if (typeof password !== 'string' || !PASSWORD_RE.test(password))
    errors.push('Password must be 8–16 characters with at least one uppercase letter and one special character');
  if (!['USER', 'STORE_OWNER'].includes(role)) errors.push('Role must be USER or STORE_OWNER');
  if (role === 'STORE_OWNER' && (typeof storeName !== 'string' || storeName.trim().length < 2 || storeName.trim().length > 100))
    errors.push('Store name must be 2–100 characters');
  return errors;
};

exports.isValidRating = (v) => Number.isInteger(v) && v >= 1 && v <= 5;