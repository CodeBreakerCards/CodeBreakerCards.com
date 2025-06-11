// Crear partículas de fondo
function createParticles() {
  const particleCount = window.innerWidth < 480 ? 10 : 30;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 5 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${Math.random() * 100}vh`;

    const duration = Math.random() * 20 + 10;
    particle.style.animationDuration = `${duration}s`;

    document.body.appendChild(particle);
  }
}

// Crear partículas de fuego dinámicas
function createFireParticles() {
  const container = document.querySelector('.logo-container');
  const particleCount = window.innerWidth < 480 ? 10 : 20;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('fire-particle');

    // Posición aleatoria en la base del fuego
    const left = 50 + (Math.random() * 30 - 15);
    const size = Math.random() * 8 + 4;
    const randomX = Math.random() * 50 - 25;

    particle.style.width = `${size}px`;
    particle.style.height = `${size * 1.5}px`;
    particle.style.left = `${left}%`;
    particle.style.bottom = '30px';
    particle.style.setProperty('--random-x', randomX);

    // Animación aleatoria
    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 5;
    particle.style.animation = `fire-particle ${duration}s ease-in ${delay}s infinite`;

    container.appendChild(particle);
  }
}

// Efecto de escritura en el título
function typeWriter() {
  const title = document.getElementById('mainTitle');
  const text = title.textContent;
  title.textContent = '';

  let i = 0;
  const speed = 100;

  function type() {
    if (i < text.length) {
      title.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Validar el patrón
function isValidPattern(pattern) {
  const regex = /^[\dx|]+$/i;
  return regex.test(pattern) && pattern.includes('x');
}

// Validar el formulario
function validateInputs() {
  const pattern = document.getElementById('pattern').value;
  const amount = parseInt(document.getElementById('amount').value);

  if (!isValidPattern(pattern)) {
    document.getElementById('pattern').classList.add('invalid');
    showNotification("El patrón debe contener 'x' para dígitos aleatorios y solo números, x o |");
    return false;
  }

  if (isNaN(amount) || amount < 10 || amount > 1000) {
    showNotification("La cantidad debe ser entre 10 y 1000");
    return false;
  }

  return true;
}

// Mostrar notificación
function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.classList.add('show');
  notification.style.transform = 'translateX(0)';

  setTimeout(() => {
    notification.classList.remove('show');
    notification.style.transform = 'translateX(200%)';
  }, 3000);
}

// Algoritmo de Luhn
function luhnCheck(number) {
  let sum = 0;
  let doubleDigit = false;
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i]);
    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    doubleDigit = !doubleDigit;
  }
  return sum % 10 === 0;
}

// Copiar al portapapeles (con fallback)
async function copyOutput() {
  const output = document.getElementById('output');
  try {
    await navigator.clipboard.writeText(output.value);
    showNotification('¡Texto copiado al portapapeles!');
  } catch (err) {
    // Fallback para navegadores antiguos
    output.select();
    document.execCommand('copy');
    showNotification('¡Texto copiado! (método antiguo)');
  }
}

// Generar tarjetas
function generateCards() {
  if (!validateInputs()) return;

  const pattern = document.getElementById('pattern').value;
  const amount = parseInt(document.getElementById('amount').value);
  const output = document.getElementById('output');
  const loading = document.getElementById('loading');
  const progressBar = document.getElementById('progressBar');
  const progress = document.getElementById('progress');

  loading.classList.add('active');
  progressBar.style.display = 'block';
  output.value = '';

  setTimeout(() => {
    let result = '';
    let count = 0;
    let attempts = 0;
    const maxAttempts = amount * 100;
    const updateInterval = Math.max(1, Math.floor(amount / 20));
    const generatedCards = new Set();

    function generate() {
      if (count >= amount || attempts >= maxAttempts) {
        loading.classList.remove('active');
        progressBar.style.display = 'none';

        if (count === 0) {
          output.value = "No se pudieron generar tarjetas válidas con ese patrón. Intenta con otro BIN o formato.";
        } else {
          output.value = result.trim();
          showNotification(`Generadas ${count} tarjetas válidas de ${amount} solicitadas (${Math.floor((count / amount) * 100)}% éxito)`);
        }
        return;
      }

      let generated;
      do {
        generated = '';
        for (let i = 0; i < pattern.length; i++) {
          generated += pattern[i] === 'x' ? Math.floor(Math.random() * 10) : pattern[i];
        }
      } while (generatedCards.has(generated));

      const cardNumber = generated.split('|')[0];
      if (luhnCheck(cardNumber)) {
        result += generated + "\n";
        count++;
        generatedCards.add(generated);

        if (count % updateInterval === 0 || count === amount) {
          progress.style.width = `${(count / amount) * 100}%`;
        }
      }

      attempts++;

      if (attempts % 100 === 0) {
        setTimeout(generate, 0);
      } else {
        generate();
      }
    }

    generate();
  }, 100);
}

// Efecto de sonido (opcional)
function playSound() {
  try {
    const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...');
    audio.volume = 0.2;
    audio.play().catch(e => console.log('Audio error:', e));
  } catch (e) {
    console.log('Audio not supported:', e);
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
  createParticles();
  createFireParticles();
  typeWriter();

  // Event listeners modernos
  document.getElementById('generateBtn').addEventListener('click', generateCards);
  document.getElementById('copyBtn').addEventListener('click', copyOutput);

  // Validación en tiempo real
  document.getElementById('pattern').addEventListener('input', function(e) {
    if (isValidPattern(e.target.value)) {
      e.target.classList.remove('invalid');
    }
  });

  // Efecto al pasar el ratón sobre los botones
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.05)';
      button.style.transition = 'transform 0.3s ease';
      playSound();
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
    });

    button.addEventListener('click', () => {
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    });
  });

  // Efecto al hacer clic en el contenedor
  const container = document.querySelector('.container');
  container.addEventListener('click', () => {
    container.style.boxShadow = `0 0 30px var(--neon-red)`;
    setTimeout(() => {
      container.style.boxShadow = `var(--neon-glow)`;
    }, 300);
  });
});