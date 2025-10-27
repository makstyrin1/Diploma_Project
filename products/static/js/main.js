// Получение CSRF-токена из cookie
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

document.addEventListener('DOMContentLoaded', function () {

    // Модальное окно для удаления из корзины 
    const deleteModal = document.getElementById('deleteModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const deleteModalText = document.getElementById('deleteModalText');
    let deleteForm = null;

    document.querySelectorAll('.cart-delete-form').forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            deleteForm = form;
            deleteModalText.textContent = 'Вы уверены, что хотите удалить товар из корзины?';
            deleteModal.style.display = 'flex';
        });
    });

    function closeDeleteModal() {
        deleteModal.style.display = 'none';
        deleteForm = null;
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    }
    const modalCloseBtn = document.querySelector('.close');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeDeleteModal);
    }
    window.addEventListener('click', function (e) {
        if (e.target === deleteModal) closeDeleteModal();
    });

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function () {
            if (deleteForm) deleteForm.submit();
            closeDeleteModal();
        });
    }

    // Выпадающее меню категорий 
    const toggle = document.getElementById('categoriesToggle');
    const menu = document.getElementById('categoriesMenu');

    if (toggle && menu) {
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            menu.classList.toggle('show');
        });

        document.addEventListener('click', function (e) {
            if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.remove('show');
            }
        });
    }

    // Бургер-меню 
const burgerToggle = document.getElementById('burgerToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (burgerToggle && mobileMenu) {
    // Открытие/закрытие по клику на бургер
    burgerToggle.addEventListener('click', function (e) {
        e.stopPropagation(); // останавливаем всплытие
        mobileMenu.classList.toggle('active');
    });

    // Закрытие при клике вне меню
    document.addEventListener('click', function (e) {
        if (mobileMenu.classList.contains('active')) {
            if (!mobileMenu.contains(e.target) && e.target !== burgerToggle) {
                mobileMenu.classList.remove('active');
            }
        }
    });

    // Закрытие при нажатии Esc
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        }
    });
}

    // Галерея: клик по миниатюре замена основного изображения
    const mainImage = document.getElementById('main-image');
    const galleryItems = document.querySelectorAll('.gallery-item img');

    galleryItems.forEach(img => {
        img.addEventListener('click', function () {
            if (mainImage) {
                mainImage.src = this.src;
                mainImage.alt = this.alt;
            }
        });
    });

    // Управление аватаром
    const deleteAvatarBtn = document.getElementById('delete-avatar-btn');
    const changeAvatarBtn = document.getElementById('change-avatar-btn');

    if (deleteAvatarBtn) {
        deleteAvatarBtn.addEventListener('click', function () {
            if (confirm('Вы уверены, что хотите удалить аватар?')) {
                const clearCheckbox = document.getElementById('id_avatar-clear');
                const form = document.getElementById('profile-form');
                if (clearCheckbox && form) {
                    clearCheckbox.checked = true;
                    form.submit();
                }
            }
        });
    }

    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', function () {
            const avatarInput = document.getElementById('id_avatar');
            if (avatarInput) avatarInput.click();
        });
    }

    // ДОБАВЛЕНИЕ/УДАЛЕНИЕ ИЗ ИЗБРАННОГО (в каталоге: через формы)
    document.querySelectorAll('.favorite-form').forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const url = this.action;
            const button = this.querySelector('.favorite-btn');
            const icon = button.querySelector('.favorite-icon');
            const csrfToken = this.querySelector('[name=csrfmiddlewaretoken]').value;

            fetch(url, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            })
            .then(response => {
                if (!response.ok) throw new Error('Network error');
                return response.json();
            })
            .then(data => {
                if (data.status === 'added') {
                    icon.src = '/static/icons/heart-filled.svg';
                    icon.alt = 'В избранном';
                    button.title = 'Убрать из избранного';
                } else if (data.status === 'removed') {
                    icon.src = '/static/icons/heart-outline.svg';
                    icon.alt = 'Добавить в избранное';
                    button.title = 'В избранное';
                }
            })
            .catch(error => {
                console.error('Ошибка избранного:', error);
                alert('Не удалось обновить избранное.');
            });
        });
    });

    // УДАЛЕНИЕ ИЗ ИЗБРАННОГО НА СТРАНИЦЕ /products/favorites/
    document.querySelectorAll('.favorite-remove-btn').forEach(button => {
        button.addEventListener('click', function () {
            const url = this.dataset.url; // Берём URL из шаблона!
            const card = this.closest('.product-card');
            const csrfToken = getCookie('csrftoken');

            if (!csrfToken) {
                alert('Ошибка безопасности. Обновите страницу.');
                return;
            }

            fetch(url, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: ''
            })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then(data => {
                if (data.status === 'removed') {
                    card.style.transition = 'opacity 0.3s';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.remove();
                        const grid = document.querySelector('.product-grid');
                        if (grid && grid.querySelectorAll('.product-card').length === 0) {
                            grid.insertAdjacentHTML('afterend', '<p class="empty-state">Ваше избранное пусто.</p>');
                            grid.remove();
                        }
                    }, 300);
                }
            })
            .catch(error => {
                console.error('Ошибка удаления из избранного:', error);
                alert('Не удалось удалить товар из избранного. Попробуйте обновить страницу.');
            });
        });
    });

});