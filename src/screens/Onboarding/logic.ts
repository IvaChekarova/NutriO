import { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, ImageSourcePropType } from 'react-native';

import { images } from '../../assets/images';

export type OnboardingItem = {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
};

export const useOnboardingLogic = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList<OnboardingItem>>(null);

  const data = useMemo<OnboardingItem[]>(
    () => [
      {
        id: 'plan',
        title: 'Plan smarter meals',
        description:
          'Build daily meal plans with quick nutrition insights and balanced macros.',
        image: images.onboardingPlan,
      },
      {
        id: 'track',
        title: 'Track what matters',
        description:
          'Log calories, macros, and water intake with a clean, focused experience.',
        image: images.onboardingTrack,
      },
      {
        id: 'cook',
        title: 'Cook with confidence',
        description:
          'Get recipe suggestions tailored to your dietary preferences and goals.',
        image: images.onboardingCook,
      },
    ],
    [],
  );

  const handleNext = useCallback(() => {
    const nextIndex = Math.min(activeIndex + 1, data.length - 1);
    listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  }, [activeIndex, data.length]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<{ index?: number }> }) => {
      const index = viewableItems[0]?.index ?? 0;
      setActiveIndex(index);
    },
  ).current;

  return {
    data,
    listRef,
    activeIndex,
    handleNext,
    onViewableItemsChanged,
  };
};
