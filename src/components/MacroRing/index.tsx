import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { useTheme } from '../../theme';
import { useMacroRing } from './logic';
import { createStyles } from './styles';

type Segment = {
  id: string;
  color: string;
  percent: number;
};

type MacroRingProps = {
  calories: number;
  goalCalories?: number | null;
  size?: number;
  strokeWidth?: number;
  segments: Segment[];
  emptyColor?: string;
};

const polarToCartesian = (
  center: number,
  radius: number,
  angleInDegrees: number,
) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: center + radius * Math.cos(angleInRadians),
    y: center + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (
  center: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) => {
  const start = polarToCartesian(center, radius, endAngle);
  const end = polarToCartesian(center, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
};

const MacroRing = ({
  calories,
  goalCalories,
  segments,
  size = 150,
  strokeWidth = 12,
  emptyColor,
}: MacroRingProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const { arcs } = useMacroRing(segments);
  const totalPercent = segments.reduce((sum, seg) => sum + seg.percent, 0);
  const isEmpty = totalPercent <= 0.001 && calories <= 0;
  const showCenterText = calories > 0 || (goalCalories ?? 0) > 0;
  const ringColor = emptyColor ?? theme.colors.textSecondary;
  const goalValue =
    goalCalories && goalCalories > 0 ? Math.round(goalCalories) : null;
  const colorProgress = useRef(new Animated.Value(isEmpty ? 0 : 1)).current;
  const AnimatedPath = useMemo(
    () => Animated.createAnimatedComponent(Path),
    [],
  );

  useEffect(() => {
    if (isEmpty) {
      colorProgress.setValue(0);
      return;
    }
    colorProgress.setValue(0);
    Animated.timing(colorProgress, {
      toValue: 1,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [colorProgress, isEmpty, calories, totalPercent]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={isEmpty ? ringColor : theme.colors.surface}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {!isEmpty
          ? arcs.map(arc => (
              <AnimatedPath
                key={arc.id}
                d={describeArc(center, radius, arc.startAngle, arc.endAngle)}
                stroke={arc.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                fill="none"
                opacity={colorProgress}
              />
            ))
          : null}
      </Svg>
      {!isEmpty ? (
        <View style={styles.centerText}>
          <Text style={styles.caloriesValue}>
            {Math.round(calories)}
            {goalValue ? ` / ${goalValue}` : ''}
          </Text>
          <Text style={styles.caloriesLabel}>kcal</Text>
        </View>
      ) : showCenterText ? (
        <View style={styles.centerText}>
          <Text style={styles.caloriesValue}>
            {Math.round(calories)}
            {goalValue ? ` / ${goalValue}` : ''}
          </Text>
          <Text style={styles.caloriesLabel}>kcal</Text>
        </View>
      ) : null}
    </View>
  );
};

export default MacroRing;
