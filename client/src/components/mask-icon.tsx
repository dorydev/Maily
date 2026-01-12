type MaskIconProps = {
  src: string
  className?: string
}

export function MaskIcon({ src, className }: MaskIconProps) {
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        backgroundColor: "currentColor",
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  )
}
