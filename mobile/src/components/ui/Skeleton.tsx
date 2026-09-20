import { useEffect } from 'react';
import { type DimensionValue } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

export type SkeletonProps = {
  width: DimensionValue;
  height: DimensionValue;
  radius?: number;
};

/** Loading placeholder — .sk in the kit's 1.4s shimmer, approximated with an opacity pulse on native. */
export function Skeleton({ width, height, radius = 6 }: SkeletonProps) {
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[{ width, height, borderRadius: radius }, style]} className="bg-surface-2" />;
}
