type AnimateType =
  // Attention seekers
  | "bounce"
  | "flash"
  | "pulse"
  | "rubberBand"
  | "shakeX"
  | "shakeY"
  | "headShake"
  | "swing"
  | "tada"
  | "wobble"
  | "jello"
  | "heartBeat"

  // Back entrances
  | "backInDown"
  | "backInLeft"
  | "backInRight"
  | "backInUp"

  // Back exits
  | "backOutDown"
  | "backOutLeft"
  | "backOutRight"
  | "backOutUp"

  // Bouncing entrances
  | "bounceIn"
  | "bounceInDown"
  | "bounceInLeft"
  | "bounceInRight"
  | "bounceInUp"

  // Bouncing exits
  | "bounceOut"
  | "bounceOutDown"
  | "bounceOutLeft"
  | "bounceOutRight"
  | "bounceOutUp"

  // Fading entrances
  | "fadeIn"
  | "fadeInDown"
  | "fadeInDownBig"
  | "fadeInLeft"
  | "fadeInLeftBig"
  | "fadeInRight"
  | "fadeInRightBig"
  | "fadeInUp"
  | "fadeInUpBig"
  | "fadeInTopLeft"
  | "fadeInTopRight"
  | "fadeInBottomLeft"
  | "fadeInBottomRight"

  // Fading exits
  | "fadeOut"
  | "fadeOutDown"
  | "fadeOutDownBig"
  | "fadeOutLeft"
  | "fadeOutLeftBig"
  | "fadeOutRight"
  | "fadeOutRightBig"
  | "fadeOutUp"
  | "fadeOutUpBig"
  | "fadeOutTopLeft"
  | "fadeOutTopRight"
  | "fadeOutBottomRight"
  | "fadeOutBottomLeft"

  // Flippers
  | "flip"
  | "flipInX"
  | "flipInY"
  | "flipOutX"
  | "flipOutY"

  // Lightspeed
  | "lightSpeedInRight"
  | "lightSpeedInLeft"
  | "lightSpeedOutRight"
  | "lightSpeedOutLeft"

  // Rotating entrances
  | "rotateIn"
  | "rotateInDownLeft"
  | "rotateInDownRight"
  | "rotateInUpLeft"
  | "rotateInUpRight"

  // Rotating exits
  | "rotateOut"
  | "rotateOutDownLeft"
  | "rotateOutDownRight"
  | "rotateOutUpLeft"
  | "rotateOutUpRight"

  // Specials
  | "hinge"
  | "jackInTheBox"
  | "rollIn"
  | "rollOut"

  // Zooming entrances
  | "zoomIn"
  | "zoomInDown"
  | "zoomInLeft"
  | "zoomInRight"
  | "zoomInUp"

  // Zooming exits
  | "zoomOut"
  | "zoomOutDown"
  | "zoomOutLeft"
  | "zoomOutRight"
  | "zoomOutUp"

  // Sliding entrances
  | "slideInDown"
  | "slideInLeft"
  | "slideInRight"
  | "slideInUp"

  // Sliding exits
  | "slideOutDown"
  | "slideOutLeft"
  | "slideOutRight"
  | "slideOutUp";

type SpeedType =
  | "slow" // 2s
  | "slower" // 3s
  | "fast" // 800ms
  | "faster"; // 500ms

/**
 * Animate CSS class
 *
 * @see Source: https://animate.style/
 *
 * @param animation - Animation name
 * @param delay - Delay time
 * @returns Animate CSS class
 */
export const animate = (
  animation: AnimateType,
  delay?: number,
  speed?: SpeedType
): string => {
  // Kiểm tra delay có phải là số không âm không
  if (delay && delay < 0) {
    throw new Error("Delay must be a non-negative number");
  }

  return `animate__animated animate__${animation} ${
    delay && `animate__delay-${delay}s`
  } ${speed && `animate__${speed}`}`;
};
