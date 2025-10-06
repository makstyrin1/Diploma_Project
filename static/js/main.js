document.addEventListener('DOMContentLoaded', function () {

    // ==== Модальное окно для удаления ====
    const deleteModal = document.getElementById('deleteModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const deleteModalText = document.getElementById('deleteModalText');
    let deleteForm = null; // Сохраняем форму для отправки

    // Открытие модального окна
    document.querySelectorAll('.cart-delete-form').forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            deleteForm = form;
            deleteModalText.textContent = "Вы уверены, что хотите удалить товар из корзины?";
            deleteModal.style.display = 'flex';
        });
    });

    // Закрытие по кнопке "Отмена"
    cancelDeleteBtn.addEventListener('click', function () {
        deleteModal.style.display = 'none';
        deleteForm = null;
    });

    // Закрытие по крестику
    document.querySelector('.close').addEventListener('click', function () {
        deleteModal.style.display = 'none';
        deleteForm = null;
    });

    // Закрытие при клике вне окна
    window.addEventListener('click', function (e) {
        if (e.target === deleteModal) {
            deleteModal.style.display = 'none';
            deleteForm = null;
        }
    });

    // Подтверждение удаления
    confirmDeleteBtn.addEventListener('click', function () {
        if (deleteForm) {
            deleteForm.submit(); // Отправляем форму
        }
        deleteModal.style.display = 'none';
        deleteForm = null;
    });

    // ==== Выпадающее меню категорий ====
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

});