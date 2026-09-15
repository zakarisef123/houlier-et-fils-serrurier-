(function () {
    "use strict";

    /* Mobile nav toggle */
    var navToggle = document.querySelector('.nav-toggle');
    var mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function () {
            var isOpen = mainNav.style.display === 'flex';
            if (isOpen) {
                mainNav.style.display = 'none';
            } else {
                mainNav.style.display = 'flex';
                mainNav.style.position = 'absolute';
                mainNav.style.top = '100%';
                mainNav.style.left = '0';
                mainNav.style.right = '0';
                mainNav.style.background = '#fff';
                mainNav.style.flexDirection = 'column';
                mainNav.style.padding = '16px 20px';
                mainNav.style.borderTop = '1px solid var(--border)';
                mainNav.style.gap = '14px';
                mainNav.style.zIndex = '250';
            }
            navToggle.setAttribute('aria-expanded', String(!isOpen));
        });
    }

    /* FAQ accordion */
    document.querySelectorAll('.faq-q').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var item = btn.closest('.faq-item');
            var wasActive = item.classList.contains('active');
            item.parentElement.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('active'); });
            if (!wasActive) item.classList.add('active');
        });
    });

    /* Generic AJAX submit helper for FormSubmit forms */
    function bindAjaxForm(form, onSuccess, onError) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var action = form.getAttribute('action') || '';
            var email = action.replace('https://formsubmit.co/', '');
            var formData = new FormData(form);
            var submitBtn = form.querySelector('[type="submit"]');
            if (submitBtn) { submitBtn.disabled = true; }
            fetch('https://formsubmit.co/ajax/' + email, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData
            })
                .then(function (res) { return res.json(); })
                .then(function () {
                    onSuccess();
                })
                .catch(function () {
                    if (submitBtn) { submitBtn.disabled = false; }
                    onError();
                });
        });
    }

    /* Main bottom-of-page contact form */
    var devisForm = document.getElementById('devisForm');
    if (devisForm) {
        bindAjaxForm(devisForm, function () {
            devisForm.style.display = 'none';
            var success = document.getElementById('formSuccess');
            if (success) { success.style.display = 'block'; success.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        }, function () {
            alert("Une erreur est survenue lors de l'envoi. Merci de nous appeler directement au " + (window.HOULIER_PHONE_DISPLAY || '') + ".");
        });
    }

    /* Popup quote modal shared across service cards */
    var modal = document.getElementById('quoteModal');
    if (modal) {
        var modalForm = modal.querySelector('form');
        var modalTitle = modal.querySelector('#quoteModalTitle');
        var modalServiceInput = modal.querySelector('input[name="Service"]');
        var modalSubjectInput = modal.querySelector('input[name="_subject"]');
        var modalSuccess = modal.querySelector('.modal-success');
        var lastFocused = null;

        function openModal(serviceName) {
            lastFocused = document.activeElement;
            if (serviceName) {
                if (modalTitle) { modalTitle.textContent = 'Devis gratuit — ' + serviceName; }
                if (modalServiceInput) { modalServiceInput.value = serviceName; }
                if (modalSubjectInput) { modalSubjectInput.value = 'Demande de devis - ' + serviceName + ' - Houlier et fils'; }
            }
            modalForm.style.display = '';
            modalForm.reset();
            if (modalServiceInput && serviceName) { modalServiceInput.value = serviceName; }
            modalSuccess.classList.remove('show');
            modal.classList.add('open');
            document.body.classList.add('modal-open');
            modal.setAttribute('aria-hidden', 'false');
            var firstField = modal.querySelector('input, textarea');
            if (firstField) { firstField.focus(); }
        }

        function closeModal() {
            modal.classList.remove('open');
            document.body.classList.remove('modal-open');
            modal.setAttribute('aria-hidden', 'true');
            if (lastFocused) { lastFocused.focus(); }
        }

        document.querySelectorAll('[data-open-quote]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                openModal(btn.getAttribute('data-open-quote'));
            });
        });

        modal.querySelectorAll('[data-close-modal]').forEach(function (el) {
            el.addEventListener('click', closeModal);
        });

        modal.addEventListener('click', function (e) {
            if (e.target === modal) { closeModal(); }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('open')) { closeModal(); }
        });

        bindAjaxForm(modalForm, function () {
            modalForm.style.display = 'none';
            modalSuccess.classList.add('show');
        }, function () {
            alert("Une erreur est survenue lors de l'envoi. Merci de nous appeler directement au " + (window.HOULIER_PHONE_DISPLAY || '') + ".");
        });
    }
})();
