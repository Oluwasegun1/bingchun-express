import Image from 'next/image';

interface BrandLogoProps {
  /** Rendered edge length in px. The supplied logo is square (400×400) and is never cropped or recoloured. */
  size?: number;
  className?: string;
  priority?: boolean;
}

/** The supplied Bing Chun logo, rendered as-is. */
export default function BrandLogo({ size = 56, className = '', priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/brand/bing-chun-logo.png"
      alt="Bing Chun — Since 2012, Ice Cream & Tea"
      width={400}
      height={400}
      priority={priority}
      style={{ width: size, height: size }}
      className={`shrink-0 select-none ${className}`}
    />
  );
}
