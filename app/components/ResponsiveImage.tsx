import Image from 'next/image'

interface ImageVariation {
  name: string
  url: string
  width: number
  height: number
}

interface ResponsiveImageProps {
  src?: string
  image?: { url: string; alt?: string; width?: number; height?: number; variations?: ImageVariation[] } | null
  alt?: string
  fill?: boolean
  className?: string
  priority?: boolean
  width?: number
  height?: number
  variations?: ImageVariation[]
  targetWidth?: number
  sizes?: string
}

export default function ResponsiveImage({
  src,
  image,
  alt = '',
  fill = false,
  className = '',
  priority = false,
  width,
  height,
  variations,
  targetWidth,
  sizes,
}: ResponsiveImageProps) {
  const imageUrl = src || image?.url || ''
  const imageAlt = alt || image?.alt || ''
  const imageVariations = variations || image?.variations

  if (!imageUrl) return null

  // Try to find a variation matching the target width
  let displayUrl = imageUrl
  if (targetWidth && imageVariations) {
    const match = imageVariations.find(v => v.width >= targetWidth)
    if (match) displayUrl = match.url
  }

  // For Unsplash URLs, use directly
  if (displayUrl.includes('unsplash.com')) {
    if (fill) {
      return <Image src={displayUrl} alt={imageAlt} fill className={className} priority={priority} sizes={sizes || '(max-width: 768px) 100vw, 50vw'} unoptimized />
    }
    return <Image src={displayUrl} alt={imageAlt} width={width || image?.width || 800} height={height || image?.height || 533} className={className} priority={priority} unoptimized />
  }

  if (fill) {
    return <Image src={displayUrl} alt={imageAlt} fill className={className} priority={priority} sizes={sizes || '(max-width: 768px) 100vw, 50vw'} />
  }
  return <Image src={displayUrl} alt={imageAlt} width={width || image?.width || 800} height={height || image?.height || 533} className={className} priority={priority} />
}
