import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { getGroceryListForRange, getSession } from '../../data';
import { subscribeMealPlanChange } from '../../utils/mealPlanEvents';

type GroceryUsage = {
  label: string;
};

type GroceryItem = {
  id: string;
  name: string;
  amount: number;
  unit: string;
  usages: GroceryUsage[];
};

type GroceryRow = GroceryItem & {
  amountLabel: string;
  checked: boolean;
  inPantry: boolean;
};

type CategoryGroup = {
  id: string;
  label: string;
  items: GroceryRow[];
};

const formatDateLabel = (date: Date) =>
  date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

const formatAmount = (value: number) => {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
};

const isoDate = (date: Date) => date.toISOString().slice(0, 10);

const signatureFromItems = (
  items: { name: string; amount: number; unit: string }[],
) =>
  items
    .map(
      item =>
        `${item.name.toLowerCase()}|${item.unit}|${item.amount.toFixed(2)}`,
    )
    .sort()
    .join('||');

const CATEGORY_RULES: { id: string; label: string; keywords: string[] }[] = [
  {
    id: 'produce',
    label: '🥦 Produce',
    keywords: [
      'apple',
      'banana',
      'berry',
      'broccoli',
      'carrot',
      'cucumber',
      'garlic',
      'onion',
      'pepper',
      'lettuce',
      'spinach',
      'tomato',
      'avocado',
      'fruit',
      'vegetable',
      'greens',
      'herb',
    ],
  },
  {
    id: 'meat',
    label: '🍗 Meat & Fish',
    keywords: [
      'chicken',
      'beef',
      'pork',
      'turkey',
      'fish',
      'salmon',
      'shrimp',
      'tuna',
    ],
  },
  {
    id: 'dairy',
    label: '🥛 Dairy & Alternatives',
    keywords: [
      'milk',
      'yogurt',
      'cheese',
      'butter',
      'cream',
      'almond milk',
      'oat milk',
    ],
  },
  {
    id: 'grains',
    label: '🌾 Grains & Carbs',
    keywords: [
      'rice',
      'pasta',
      'bread',
      'oats',
      'tortilla',
      'noodle',
      'quinoa',
    ],
  },
  {
    id: 'oils',
    label: '🫒 Oils & Condiments',
    keywords: [
      'oil',
      'vinegar',
      'sauce',
      'ketchup',
      'mustard',
      'mayo',
      'dressing',
    ],
  },
  {
    id: 'spices',
    label: '🧂 Spices',
    keywords: [
      'salt',
      'pepper',
      'spice',
      'paprika',
      'cumin',
      'curry',
      'oregano',
      'basil',
    ],
  },
  {
    id: 'beverages',
    label: '🧃 Beverages',
    keywords: ['juice', 'tea', 'coffee', 'water', 'sparkling'],
  },
  {
    id: 'sweets',
    label: '🍬 Sweets',
    keywords: [
      'chocolate',
      'candy',
      'dessert',
      'cookie',
      'cake',
      'sugar',
      'sweet',
      'protein bar',
      'pudding',
      'protein shake',
    ],
  },
  {
    id: 'frozen',
    label: '❄️ Frozen',
    keywords: ['frozen'],
  },
  {
    id: 'other',
    label: '📦 Other',
    keywords: [],
  },
];

const CATEGORY_ORDER = CATEGORY_RULES.map(rule => rule.id);

const categorize = (name: string) => {
  const value = name.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some(keyword => value.includes(keyword))) {
      return rule;
    }
  }
  return CATEGORY_RULES[CATEGORY_RULES.length - 1];
};

export const useGroceryLogic = () => {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [manualItems, setManualItems] = useState<GroceryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(
    () => new Set(),
  );
  const [pantryItems, setPantryItems] = useState<Set<string>>(() => new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    () => new Set(),
  );
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    () => new Set(),
  );
  const [rangeOffsetWeeks, setRangeOffsetWeeks] = useState(0);
  const [completedRanges, setCompletedRanges] = useState<Set<string>>(
    () => new Set(),
  );
  const [profileId, setProfileId] = useState<string | null>(null);
  const [currentSignature, setCurrentSignature] = useState('');
  const [checkedRangeKey, setCheckedRangeKey] = useState('');
  const [rangeOption, setRangeOption] = useState<'today' | 'next3' | 'week'>(
    'week',
  );
  const refreshList = async (rangeStart: Date, rangeEnd: Date, key: string) => {
    if (!profileId) {
      return null;
    }
    setIsLoading(true);
    const results = await getGroceryListForRange(rangeStart, rangeEnd);
    const signature = signatureFromItems(results);
    const storedSignature = await AsyncStorage.getItem(
      `grocery.signature.${profileId}.${key}`,
    );
    const storedChecked = await AsyncStorage.getItem(
      `grocery.checked.${profileId}.${key}`,
    );
    if (completedRanges.has(key)) {
      if (!storedSignature || storedSignature !== signature) {
        const nextCompleted = new Set(completedRanges);
        nextCompleted.delete(key);
        setCompletedRanges(nextCompleted);
        AsyncStorage.setItem(
          `grocery.completedRanges.${profileId}`,
          JSON.stringify(Array.from(nextCompleted)),
        ).catch(() => undefined);
      } else {
        setIsLoading(false);
        return;
      }
    }
    setItems(
      results.map(item => ({
        id: `${item.name}_${item.unit}`,
        name: item.name,
        amount: item.amount,
        unit: item.unit,
        usages: item.usages,
      })),
    );
    if (storedChecked) {
      setCheckedItems(new Set(JSON.parse(storedChecked) as string[]));
    } else {
      setCheckedItems(new Set());
    }
    setCurrentSignature(signature);
    setCheckedRangeKey(key);
    setPantryItems(new Set());
    setExpandedItems(new Set());
    setCollapsedCategories(new Set(CATEGORY_ORDER));
    setManualItems([]);
    setIsLoading(false);
    return { signature, storedSignature };
  };

  const range = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() + rangeOffsetWeeks * 7);
    const end = new Date(start);
    if (rangeOption === 'today') {
      end.setDate(start.getDate());
    } else if (rangeOption === 'next3') {
      end.setDate(start.getDate() + 2);
    } else {
      end.setDate(start.getDate() + 6);
    }
    return { start, end };
  }, [rangeOffsetWeeks, rangeOption]);

  const rangeKey = useMemo(
    () => `${isoDate(range.start)}_${isoDate(range.end)}`,
    [range],
  );

  const rangeLabel = useMemo(
    () => `${formatDateLabel(range.start)} - ${formatDateLabel(range.end)}`,
    [range],
  );

  useEffect(() => {
    let isActive = true;

    const loadCompleted = async () => {
      const session = await getSession();
      const id = session.profileId ?? null;
      if (isActive) {
        setProfileId(id);
      }
      if (!id) {
        return;
      }
      const raw = await AsyncStorage.getItem(`grocery.completedRanges.${id}`);
      if (!isActive) {
        return;
      }
      if (raw) {
        const list = JSON.parse(raw) as string[];
        setCompletedRanges(new Set(list));
      }
    };

    loadCompleted();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!profileId) {
      return () => undefined;
    }
    return subscribeMealPlanChange(() => {
      void refreshList(range.start, range.end, rangeKey);
    });
  }, [profileId, range.end, range.start, rangeKey, completedRanges]);

  useFocusEffect(
    useMemo(
      () => () => {
        if (!profileId) {
          return;
        }
        void refreshList(range.start, range.end, rangeKey);
      },
      [profileId, range.end, range.start, rangeKey, completedRanges],
    ),
  );

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      const result = await refreshList(range.start, range.end, rangeKey);
      if (!isActive || !result) {
        return;
      }
      if (
        completedRanges.has(rangeKey) &&
        result.storedSignature === result.signature
      ) {
        setIsLoading(false);
        setRangeOffsetWeeks(current => current + 1);
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, [completedRanges, profileId, range, rangeKey]);

  useEffect(() => {
    if (!profileId || checkedRangeKey !== rangeKey || isLoading) {
      return;
    }
    AsyncStorage.setItem(
      `grocery.checked.${profileId}.${rangeKey}`,
      JSON.stringify(Array.from(checkedItems)),
    ).catch(() => undefined);
  }, [checkedItems, checkedRangeKey, isLoading, profileId, rangeKey]);

  const rows = useMemo(() => {
    const mapped = [...items, ...manualItems].map(item => ({
      ...item,
      amountLabel: `${formatAmount(item.amount)} ${item.unit}`,
      checked: checkedItems.has(item.id),
      inPantry: pantryItems.has(item.id),
    }));

    return mapped.filter(item => {
      if (item.inPantry) {
        return false;
      }
      return true;
    });
  }, [checkedItems, items, manualItems, pantryItems]);

  const allRows = useMemo(() => {
    return [...items, ...manualItems].map(item => ({
      ...item,
      amountLabel: `${formatAmount(item.amount)} ${item.unit}`,
      checked: checkedItems.has(item.id),
      inPantry: pantryItems.has(item.id),
    }));
  }, [checkedItems, items, manualItems, pantryItems]);

  const groupedItems = useMemo(() => {
    const groups = new Map<string, CategoryGroup>();
    rows.forEach(item => {
      const category = categorize(item.name);
      const existing = groups.get(category.id);
      if (existing) {
        existing.items.push(item);
      } else {
        groups.set(category.id, {
          id: category.id,
          label: category.label,
          items: [item],
        });
      }
    });

    groups.forEach(group => {
      group.items.sort((a, b) => {
        if (a.checked !== b.checked) {
          return a.checked ? 1 : -1;
        }
        if (a.inPantry !== b.inPantry) {
          return a.inPantry ? 1 : -1;
        }
        return a.name.localeCompare(b.name);
      });
    });

    return CATEGORY_ORDER.map(id => groups.get(id)).filter(
      (group): group is CategoryGroup => Boolean(group),
    );
  }, [rows]);

  const toggleCategory = (id: string) =>
    setCollapsedCategories(current => {
      const next = new Set(CATEGORY_ORDER);
      if (current.has(id)) {
        next.delete(id);
      }
      return next;
    });

  const toggleChecked = (id: string) =>
    setCheckedItems(current => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const markInPantry = (id: string) =>
    setPantryItems(current => {
      const next = new Set(current);
      next.add(id);
      return next;
    });

  const toggleExpanded = (id: string) =>
    setExpandedItems(current => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const addManualItem = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    const id = `manual_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    setManualItems(current => [
      {
        id,
        name: trimmed,
        amount: 1,
        unit: 'pcs',
        usages: [],
      },
      ...current,
    ]);
  };

  const completeShopping = () => {
    if (!profileId) {
      return;
    }
    const nextCompleted = new Set(completedRanges);
    nextCompleted.add(rangeKey);
    setCompletedRanges(nextCompleted);
    AsyncStorage.setItem(
      `grocery.completedRanges.${profileId}`,
      JSON.stringify(Array.from(nextCompleted)),
    ).catch(() => undefined);
    const signature = currentSignature || signatureFromItems(items);
    AsyncStorage.setItem(
      `grocery.signature.${profileId}.${rangeKey}`,
      signature,
    ).catch(() => undefined);
    setPantryItems(new Set());
    setExpandedItems(new Set());
    setCollapsedCategories(new Set(CATEGORY_ORDER));
    setManualItems([]);
    setRangeOffsetWeeks(current => current + 1);
  };

  return {
    groupedItems,
    isLoading,
    rangeLabel,
    checkedItems,
    pantryItems,
    expandedItems,
    collapsedCategories,
    toggleCategory,
    toggleChecked,
    toggleExpanded,
    markInPantry,
    addManualItem,
    rangeOption,
    setRangeOption,
    completeShopping,
  } as const;
};
