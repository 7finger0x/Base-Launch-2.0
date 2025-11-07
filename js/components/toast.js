// Toast Notification System
class ToastManager {
  constructor() {
    this.container = document.getElementById('toastContainer');
    this.toasts = new Map();
    this.maxToasts = 5;
    this.defaultDuration = 5000;
  }

  show(message, type = 'info', duration = this.defaultDuration) {
    const id = this.generateId();
    const toast = this.createToast(id, message, type, duration);
    
    this.container.appendChild(toast);
    this.toasts.set(id, toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    
    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
    
    // Limit number of toasts
    this.enforceLimit();
    
    return id;
  }

  createToast(id, message, type, duration) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.dataset.toastId = id;
    
    const icon = this.getIcon(type);
    const progressBar = duration > 0 ? this.createProgressBar(duration) : '';
    
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${this.sanitizeMessage(message)}</div>
        <button class="toast-close" onclick="toast.remove('${id}')" aria-label="Close notification">
          <i class="fas fa-times" aria-hidden="true"></i>
        </button>
      </div>
      ${progressBar}
    `;
    
    return toast;
  }

  createProgressBar(duration) {
    return `
      <div class="toast-progress">
        <div class="toast-progress-bar" style="animation: shrink ${duration}ms linear"></div>
      </div>
    `;
  }

  getIcon(type) {
    const icons = {
      success: '<i class="fas fa-check-circle" aria-hidden="true"></i>',
      error: '<i class="fas fa-exclamation-circle" aria-hidden="true"></i>',
      warning: '<i class="fas fa-exclamation-triangle" aria-hidden="true"></i>',
      info: '<i class="fas fa-info-circle" aria-hidden="true"></i>'
    };
    return icons[type] || icons.info;
  }

  remove(id) {
    const toast = this.toasts.get(id);
    if (!toast) return;
    
    toast.classList.add('removing');
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      this.toasts.delete(id);
    }, 300);
  }

  clear() {
    this.toasts.forEach((toast, id) => {
      this.remove(id);
    });
  }

  enforceLimit() {
    if (this.toasts.size > this.maxToasts) {
      const oldestId = this.toasts.keys().next().value;
      this.remove(oldestId);
    }
  }

  generateId() {
    return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  sanitizeMessage(message) {
    const div = document.createElement('div');
    div.textContent = message;
    return div.innerHTML;
  }

  // Predefined toast types
  success(message, duration) {
    return this.show(message, 'success', duration);
  }

  error(message, duration) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration) {
    return this.show(message, 'info', duration);
  }
}

// Add styles for toast animations
const toastStyles = `
<style>
.toast {
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.3s ease-out;
  margin-bottom: 0.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  position: relative;
}

.toast.show {
  opacity: 1;
  transform: translateX(0);
}

.toast.removing {
  opacity: 0;
  transform: translateX(100%);
  margin-bottom: 0;
  max-height: 0;
  padding: 0;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--white);
}

.toast-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.toast-success .toast-icon {
  color: var(--success-color);
}

.toast-error .toast-icon {
  color: var(--error-color);
}

.toast-warning .toast-icon {
  color: var(--warning-color);
}

.toast-info .toast-icon {
  color: var(--primary-color);
}

.toast-message {
  flex: 1;
  font-weight: 500;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
  flex-shrink: 0;
}

.toast-close:hover {
  color: var(--gray-600);
  background: var(--gray-100);
}

.toast-progress {
  height: 3px;
  background: var(--gray-200);
  position: relative;
  overflow: hidden;
}

.toast-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  width: 100%;
  transform-origin: left;
}

@keyframes shrink {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

@media (max-width: 768px) {
  .toast-container {
    left: 1rem;
    right: 1rem;
    top: 5rem;
  }
  
  .toast {
    min-width: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .toast {
    transition: none;
  }
  
  .toast-progress-bar {
    animation: none;
  }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', toastStyles);

// Initialize global toast manager
const toast = new ToastManager();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ToastManager };
}