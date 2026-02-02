type Listener = () => void;

const listeners = new Set<Listener>();

export const emitMealPlanChange = () => {
  listeners.forEach(listener => listener());
};

export const subscribeMealPlanChange = (listener: Listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
