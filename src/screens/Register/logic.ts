import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated } from 'react-native';

import { createProfile, emailExists } from '../../data';

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const hasSequentialChars = (value: string, minLength = 3) => {
  if (value.length < minLength) {
    return false;
  }

  const sanitized = value.replace(/[^A-Za-z0-9]/g, '');
  for (let i = 0; i <= sanitized.length - minLength; i += 1) {
    const slice = sanitized.slice(i, i + minLength);
    const codes = slice.split('').map(char => char.charCodeAt(0));
    const ascending = codes.every((code, idx) =>
      idx === 0 ? true : code === codes[idx - 1] + 1,
    );
    const descending = codes.every((code, idx) =>
      idx === 0 ? true : code === codes[idx - 1] - 1,
    );

    if (ascending || descending) {
      return true;
    }
  }

  return false;
};

const includesName = (value: string, fullName: string) => {
  const normalizedPassword = value.toLowerCase();
  const parts = fullName
    .toLowerCase()
    .split(/\s+/)
    .map(part => part.trim())
    .filter(part => part.length >= 3);

  return parts.some(part => normalizedPassword.includes(part));
};

const getPasswordRules = (fullName: string) => [
  {
    id: 'length-8',
    label: 'At least 8 characters',
    test: (value: string) => value.length >= 8,
  },
  {
    id: 'length-12',
    label: '12+ characters',
    test: (value: string) => value.length >= 12,
  },
  {
    id: 'upper',
    label: 'One uppercase letter',
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: 'lower',
    label: 'One lowercase letter',
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    id: 'number',
    label: 'One number',
    test: (value: string) => /\d/.test(value),
  },
  {
    id: 'symbol',
    label: 'One symbol',
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
  {
    id: 'no-sequence',
    label: 'Avoid sequences (123, abc)',
    test: (value: string) => !hasSequentialChars(value),
  },
  {
    id: 'no-name',
    label: 'Avoid your name',
    test: (value: string) => !includesName(value, fullName),
    hideWhen: fullName.trim().length === 0,
  },
];

const getPasswordStrength = (value: string, fullName: string) => {
  if (!value) {
    return {
      score: 0,
      label: 'Weak',
      percent: 0,
      tips: [],
    };
  }

  const rules = getPasswordRules(fullName);
  const passed = rules.filter(rule => rule.test(value));
  const score = passed.length;
  const percent = Math.min((score / rules.length) * 100, 100);

  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSymbol = /[^A-Za-z0-9]/.test(value);
  const noSequence = !hasSequentialChars(value);
  const noName = !includesName(value, fullName);

  let label: 'Weak' | 'Moderate' | 'Strong' = 'Weak';
  const strong =
    value.length >= 12 &&
    hasUpper &&
    hasLower &&
    hasNumber &&
    hasSymbol &&
    noSequence &&
    noName;

  const moderate =
    value.length >= 8 &&
    hasUpper &&
    hasLower &&
    hasNumber &&
    noSequence &&
    noName;

  if (strong) {
    label = 'Strong';
  } else if (moderate) {
    label = 'Moderate';
  }

  const tips = rules
    .filter(rule => !rule.test(value))
    .filter(rule => !rule.hideWhen)
    .map(rule => rule.label);

  return {
    score,
    label,
    percent,
    tips,
  };
};

export const useRegisterLogic = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdProfileId, setCreatedProfileId] = useState<string | null>(null);

  const passwordStrength = useMemo(
    () => getPasswordStrength(password, fullName),
    [password, fullName],
  );

  const strengthProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const target = passwordStrength.percent / 100;
    Animated.timing(strengthProgress, {
      toValue: target,
      duration: 280,
      useNativeDriver: false,
    }).start();
  }, [passwordStrength.percent, strengthProgress]);

  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const passwordTooWeak =
    password.length > 0 && passwordStrength.label === 'Weak';

  useEffect(() => {
    let isActive = true;

    if (!email) {
      setEmailError('');
      setIsCheckingEmail(false);
      return () => {
        isActive = false;
      };
    }

    if (!isValidEmail(email)) {
      setEmailError('Enter a valid email.');
      setIsCheckingEmail(false);
      return () => {
        isActive = false;
      };
    }

    setIsCheckingEmail(true);
    const timer = setTimeout(async () => {
      const exists = await emailExists(email);
      if (isActive) {
        setEmailError(exists ? 'Email already exists.' : '');
        setIsCheckingEmail(false);
      }
    }, 350);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [email]);

  const canSubmit = useMemo(() => {
    if (!fullName || !email || !password || !confirmPassword) {
      return false;
    }

    if (password.length < 8 || password !== confirmPassword) {
      return false;
    }

    if (passwordStrength.label === 'Weak') {
      return false;
    }

    if (emailError || isCheckingEmail || !isValidEmail(email)) {
      return false;
    }

    return true;
  }, [
    confirmPassword,
    email,
    emailError,
    fullName,
    isCheckingEmail,
    password,
    passwordStrength.label,
  ]);

  const handleSubmit = async () => {
    if (!canSubmit || submitSuccess) {
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);

    try {
      const profile = await createProfile({ fullName, email });
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setIsPasswordFocused(false);
      setSubmitSuccess(true);
      setCreatedProfileId(profile.id);
    } catch {
      setSubmitError('Unable to create account locally.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    canSubmit,
    passwordMismatch,
    passwordStrength,
    passwordTooWeak,
    strengthProgress,
    isPasswordFocused,
    setIsPasswordFocused,
    emailError,
    isCheckingEmail,
    isSubmitting,
    submitError,
    submitSuccess,
    createdProfileId,
    handleSubmit,
  };
};
