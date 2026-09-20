import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type ViewProps } from 'react-native';

/**
 * Dark canvas with a red glow in the upper-right — approximates the kit's
 * `radial-gradient(...#b1111b...), linear-gradient(#232323, #111)` splash
 * background (LinearGradient can't do radial, so two layered linear
 * gradients fake the falloff).
 */
export function AuthBackground({ children, style, ...rest }: ViewProps) {
  return (
    <View style={[styles.root, style]} {...rest}>
      <LinearGradient
        colors={['#232323', '#111111']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <LinearGradient
        colors={['rgba(177,17,27,0.55)', 'rgba(177,17,27,0.12)', 'rgba(177,17,27,0)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.85, y: 0 }}
        end={{ x: 0.35, y: 0.55 }}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#111111' },
});
