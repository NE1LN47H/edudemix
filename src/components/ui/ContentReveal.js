"use client";

/**
 * ContentReveal component
 *
 * Smoothly reveals newly loaded content with a subtle slide-up and fade-in animation.
 * Ideal for wrapping API data when loading completes.
 */
export default function ContentReveal({
  children,
  stagger = 0,
  delay = 0,
  className = "",
  style = {},
  as: Component = "div",
  ...props
}) {
  const staggerClass = stagger > 0 ? `reveal-stagger-${Math.min(stagger, 4)}` : "";
  const customStyle = {
    ...style,
    ...(delay > 0 ? { animationDelay: `${delay}ms` } : {}),
  };

  return (
    <Component
      className={`reveal-content ${staggerClass} ${className}`.trim()}
      style={customStyle}
      {...props}
    >
      {children}
    </Component>
  );
}
