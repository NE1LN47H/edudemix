"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Format numeric value as Indian Rupee currency (INR)
 */
function formatCurrencyINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount) || 0);
}

/**
 * Format numeric value with standard locale commas
 */
function formatLocaleNumber(amount, decimals = 0) {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount || 0);
}

/**
 * Easing function: Quartic ease-out for ultra-smooth landing
 */
function easeOutQuart(x) {
  return 1 - Math.pow(1 - x, 4);
}

/**
 * AnimatedCounter component
 *
 * Smoothly animates a numeric value from its start (or previous value) to target value.
 * Supports prefixes, suffixes, currency formatting, decimals, and custom duration.
 */
export default function AnimatedCounter({
  value = 0,
  duration = 1200,
  prefix = "",
  suffix = "",
  decimals = 0,
  isCurrency = false,
  formatter,
  className = "",
}) {
  const numericTarget = typeof value === "number" ? value : parseFloat(value) || 0;
  const [displayValue, setDisplayValue] = useState(0);
  const previousValueRef = useRef(0);
  const frameRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    // Respect user's reduced-motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplayValue(numericTarget);
      previousValueRef.current = numericTarget;
      return;
    }

    const startVal = previousValueRef.current;
    const endVal = numericTarget;
    const change = endVal - startVal;

    if (change === 0) {
      setDisplayValue(endVal);
      return;
    }

    startTimeRef.current = null;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);

      const currentVal = startVal + change * easedProgress;
      setDisplayValue(currentVal);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endVal);
        previousValueRef.current = endVal;
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      previousValueRef.current = numericTarget;
    };
  }, [numericTarget, duration]);

  // Format the current output
  let formattedOutput = "";

  if (formatter && typeof formatter === "function") {
    formattedOutput = formatter(displayValue);
  } else if (isCurrency) {
    formattedOutput = formatCurrencyINR(displayValue);
  } else {
    formattedOutput = `${prefix}${formatLocaleNumber(displayValue, decimals)}${suffix}`;
  }

  return (
    <span
      className={`animated-counter ${className}`.trim()}
      aria-label={`${prefix}${numericTarget}${suffix}`}
    >
      {formattedOutput}
    </span>
  );
}
