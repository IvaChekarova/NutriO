import { useMemo, useState } from 'react';

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const useForgotPasswordLogic = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const canSubmit = useMemo(() => {
    if (!email) {
      return false;
    }

    return isValidEmail(email);
  }, [email]);

  const handleSubmit = () => {
    if (!canSubmit || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    // TODO: wire Supabase password reset
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage('If an account exists, a reset link was sent.');
    }, 500);
  };

  return {
    email,
    setEmail,
    canSubmit,
    isSubmitting,
    message,
    handleSubmit,
  };
};
