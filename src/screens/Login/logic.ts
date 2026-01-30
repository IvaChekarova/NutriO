import { useMemo, useState } from 'react';

import { getProfileByEmail, setSession } from '../../data';

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const useLoginLogic = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    if (!email || !password) {
      return false;
    }

    if (!isValidEmail(email)) {
      return false;
    }

    return true;
  }, [email, password]);

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) {
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const profile = await getProfileByEmail(email);
      if (!profile) {
        setError('No account found for this email.');
        return;
      }

      await setSession({ isLoggedIn: true, profileId: profile.id });
    } catch {
      setError('Unable to sign in locally.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    canSubmit,
    isSubmitting,
    error,
    handleSubmit,
  };
};
