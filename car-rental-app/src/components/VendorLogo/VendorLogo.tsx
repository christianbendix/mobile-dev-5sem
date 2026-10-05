/* ___ VendorLogo component ___________________________
    The rental company's logo in a square tile, fx on
    the result cards and the car details. Falls back
    to the first letter of the name when there is no
    logo, or when the image fails to load.
   ____________________________________________________*/

import { useState } from 'react';
import { Image, Text, View } from 'react-native';

import { styles } from './VendorLogo.styles';

type Props = { name: string; logoUrl?: string; size?: number };

export function VendorLogo({ name, logoUrl, size = 28 }: Props) {
  const [failed, setFailed] = useState(false);
  const showImage = logoUrl && !failed;
  const shape = { width: size, height: size, borderRadius: Math.round(size * 0.3) };

  return (
    <View
      style={[styles.tile, shape, !showImage && styles.fallback]}
      accessibilityRole="image"
      accessibilityLabel={`${name} logo`}
    >
      {showImage ? (
        <Image
          source={{ uri: logoUrl }}
          style={styles.image}
          resizeMode="contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <Text style={[styles.initial, { fontSize: Math.round(size * 0.45) }]}>
          {name.charAt(0).toUpperCase()}
        </Text>
      )}
    </View>
  );
}
