// Modal Component System
class ModalManager {
  constructor() {
    this.overlay = document.getElementById('modalOverlay');
    this.modal = this.overlay?.querySelector('.modal');
    this.title = document.getElementById('modalTitle');
    this.body = document.getElementById('modalBody');
    this.isOpen = false;
    this.currentModal = null;
    
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    if (!this.overlay) return;

    // Close on overlay click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Prevent scroll when modal is open
    document.addEventListener('modal:open', () => {
      document.body.style.overflow = 'hidden';
    });

    document.addEventListener('modal:close', () => {
      document.body.style.overflow = '';
    });
  }

  open(config) {
    if (!this.overlay) {
      console.error('Modal overlay not found');
      return;
    }

    this.currentModal = config;
    this.isOpen = true;

    // Set content
    if (this.title) {
      this.title.textContent = config.title || 'Modal';
    }
    
    if (this.body) {
      this.body.innerHTML = this.sanitizeContent(config.content || '');
    }

    // Add modal size class
    if (this.modal) {
      this.modal.className = `modal ${config.size || 'medium'}`;
    }

    // Show overlay
    this.overlay.style.display = 'flex';
    
    // Trigger animation
    requestAnimationFrame(() => {
      this.overlay.classList.add('show');
    });

    // Focus management
    this.trapFocus();

    // Dispatch event
    document.dispatchEvent(new CustomEvent('modal:open', { detail: config }));

    return this;
  }

  close() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.overlay.classList.remove('show');

    setTimeout(() => {
      this.overlay.style.display = 'none';
      this.cleanup();
    }, 300);

    // Dispatch event
    document.dispatchEvent(new CustomEvent('modal:close', { detail: this.currentModal }));

    this.currentModal = null;
    return this;
  }

  cleanup() {
    if (this.title) this.title.textContent = '';
    if (this.body) this.body.innerHTML = '';
    if (this.modal) this.modal.className = 'modal';
  }

  trapFocus() {
    const focusableElements = this.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement?.focus();

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);

    // Clean up when modal closes
    const cleanup = () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('modal:close', cleanup);
    };

    document.addEventListener('modal:close', cleanup);
  }

  sanitizeContent(content) {
    if (typeof content === 'string') {
      const div = document.createElement('div');
      div.innerHTML = content;
      return div.innerHTML;
    }
    return content;
  }

  // Predefined modal types
  confirm(title, message, onConfirm, onCancel) {
    const content = `
      <div class="modal-confirm">
        <p class="modal-message">${this.sanitizeContent(message)}</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="modal.close(); (${onCancel || (() => {})})()">
            Cancel
          </button>
          <button class="btn btn-primary" onclick="modal.close(); (${onConfirm})()">
            Confirm
          </button>
        </div>
      </div>
    `;

    return this.open({ title, content, size: 'small' });
  }

  alert(title, message, onOk) {
    const content = `
      <div class="modal-alert">
        <p class="modal-message">${this.sanitizeContent(message)}</p>
        <div class="modal-actions">
          <button class="btn btn-primary" onclick="modal.close(); (${onOk || (() => {})})()">
            OK
          </button>
        </div>
      </div>
    `;

    return this.open({ title, content, size: 'small' });
  }

  prompt(title, message, defaultValue = '', onSubmit, onCancel) {
    const id = `prompt_${Date.now()}`;
    const content = `
      <div class="modal-prompt">
        <p class="modal-message">${this.sanitizeContent(message)}</p>
        <input type="text" id="${id}" class="form-input" value="${defaultValue}" placeholder="Enter value...">
        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="modal.close(); (${onCancel || (() => {})})()">
            Cancel
          </button>
          <button class="btn btn-primary" onclick="modal.handlePromptSubmit('${id}', ${onSubmit})">
            Submit
          </button>
        </div>
      </div>
    `;

    this.open({ title, content, size: 'small' });

    // Focus input after modal opens
    setTimeout(() => {
      const input = document.getElementById(id);
      input?.focus();
      input?.select();
    }, 100);

    return this;
  }

  handlePromptSubmit(inputId, onSubmit) {
    const input = document.getElementById(inputId);
    const value = input?.value || '';
    this.close();
    if (onSubmit) onSubmit(value);
  }

  form(title, fields, onSubmit, onCancel) {
    const formId = `form_${Date.now()}`;
    const fieldsHtml = fields.map(field => this.renderField(field)).join('');
    
    const content = `
      <form id="${formId}" class="modal-form">
        ${fieldsHtml}
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" onclick="modal.close(); (${onCancel || (() => {})})()">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    `;

    this.open({ title, content, size: 'medium' });

    // Handle form submission
    setTimeout(() => {
      const form = document.getElementById(formId);
      form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        this.close();
        if (onSubmit) onSubmit(data);
      });
    }, 100);

    return this;
  }

  renderField(field) {
    const { type, name, label, placeholder, required, options } = field;
    const requiredAttr = required ? 'required' : '';
    const requiredMark = required ? '<span class="required">*</span>' : '';

    switch (type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return `
          <div class="form-field">
            <label for="${name}">${label}${requiredMark}</label>
            <input type="${type}" id="${name}" name="${name}" 
                   placeholder="${placeholder || ''}" ${requiredAttr}
                   class="form-input">
          </div>
        `;

      case 'textarea':
        return `
          <div class="form-field">
            <label for="${name}">${label}${requiredMark}</label>
            <textarea id="${name}" name="${name}" 
                      placeholder="${placeholder || ''}" ${requiredAttr}
                      class="form-input" rows="4"></textarea>
          </div>
        `;

      case 'select':
        const optionsHtml = options?.map(opt => 
          `<option value="${opt.value}">${opt.label}</option>`
        ).join('') || '';
        
        return `
          <div class="form-field">
            <label for="${name}">${label}${requiredMark}</label>
            <select id="${name}" name="${name}" ${requiredAttr} class="form-input">
              <option value="">Select...</option>
              ${optionsHtml}
            </select>
          </div>
        `;

      case 'checkbox':
        return `
          <div class="form-field form-checkbox">
            <label class="checkbox-label">
              <input type="checkbox" id="${name}" name="${name}" ${requiredAttr}>
              <span class="checkmark"></span>
              ${label}${requiredMark}
            </label>
          </div>
        `;

      default:
        return '';
    }
  }
}

// Add modal styles
const modalStyles = `
<style>
.modal-overlay {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modal-overlay.show {
  opacity: 1;
}

.modal {
  transform: scale(0.95);
  transition: transform 0.3s ease;
}

.modal-overlay.show .modal {
  transform: scale(1);
}

.modal.small {
  max-width: 400px;
}

.modal.medium {
  max-width: 600px;
}

.modal.large {
  max-width: 900px;
}

.modal-message {
  margin-bottom: 1.5rem;
  line-height: 1.6;
  color: var(--gray-700);
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field label {
  font-weight: 500;
  color: var(--gray-700);
}

.required {
  color: var(--error-color);
}

.form-input {
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-checkbox {
  flex-direction: row;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: normal;
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
}

@media (max-width: 768px) {
  .modal {
    margin: 1rem;
    max-width: none;
    width: calc(100% - 2rem);
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-actions .btn {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .modal-overlay,
  .modal {
    transition: none;
  }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', modalStyles);

// Initialize global modal manager
const modal = new ModalManager();

// Global close function for inline handlers
function closeModal() {
  modal.close();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ModalManager };
}