const defaultColors = ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"];

function createElements(root, elementCount, colors, width, height) {
  return Array.from({ length: elementCount }).map((_, index) => {
    const element = document.createElement("div");
    const color = colors[index % colors.length];
    element.style["background-color"] = color; // eslint-disable-line space-infix-ops
    element.style.width = width;
    element.style.height = height;
    element.style.position = "absolute";
    element.style.willChange = "transform, opacity";
    root.appendChild(element);
    return element;
  });
}

function randomPhysics(angle, spread, startVelocity, random) {
  const radAngle = angle * (Math.PI / 180);
  const radSpread = spread * (Math.PI / 180);
  return {
    x: 0,
    y: 0,
    wobble: random() * 10,
    wobbleSpeed: 0.1 + random() * 0.1,
    velocity: startVelocity * 0.5 + random() * startVelocity,
    angle2D: -radAngle + (0.5 * radSpread - random() * radSpread),
    angle3D: -(Math.PI / 4) + random() * (Math.PI / 2),
    tiltAngle: random() * Math.PI,
    tiltAngleSpeed: 0.1 + random() * 0.3
  };
}

function updateFetti(fetti, progress, decay) {
  /* eslint-disable no-param-reassign */
  fetti.physics.x += Math.cos(fetti.physics.angle2D) * fetti.physics.velocity;
  fetti.physics.y += Math.sin(fetti.physics.angle2D) * fetti.physics.velocity;
  fetti.physics.z += Math.sin(fetti.physics.angle3D) * fetti.physics.velocity;
  fetti.physics.wobble += fetti.physics.wobbleSpeed;
  fetti.physics.velocity *= decay;
  fetti.physics.y += 3;
  fetti.physics.tiltAngle += fetti.physics.tiltAngleSpeed;

  const { x, y, tiltAngle, wobble } = fetti.physics;
  const wobbleX = x + 10 * Math.cos(wobble);
  const wobbleY = y + 10 * Math.sin(wobble);
  const transform = `translate3d(${wobbleX}px, ${wobbleY}px, 0) rotate3d(1, 1, 1, ${tiltAngle}rad)`;

  fetti.element.style.transform = transform;
  fetti.element.style.opacity = 1 - progress;

  /* eslint-enable */
}

function animate(root, fettis, decay, duration) {
  let startTime;

  return new Promise(resolve => {
    function update(time) {
      if (!startTime) startTime = time;
      const progress = startTime === time ? 0 : (time - startTime) / duration;
      fettis.forEach(fetti => updateFetti(fetti, progress, decay));

      if (time - startTime < duration) {
        requestAnimationFrame(update);
      } else {
        fettis.forEach(fetti => {
          if (fetti.element.parentNode === root) {
            return root.removeChild(fetti.element);
          }
        });
        resolve();
      }
    }

    requestAnimationFrame(update);
  });
}

const defaults = {
  angle: 90,
  decay: 0.9,
  spread: 45,
  startVelocity: 45,
  elementCount: 50,
  width: "10px",
  height: "10px",
  colors: defaultColors,
  duration: 3000,
  random: Math.random
};

export function confetti(root, config = {}) {
  const {
    elementCount,
    colors,
    width,
    height,
    angle,
    spread,
    startVelocity,
    decay,
    duration,
    random
  } = Object.assign({}, defaults, config);
  const elements = createElements(root, elementCount, colors, width, height);
  const fettis = elements.map(element => ({
    element,
    physics: randomPhysics(angle, spread, startVelocity, random)
  }));

  return animate(root, fettis, decay, duration);
}
