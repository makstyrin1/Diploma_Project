document.addEventListener("DOMContentLoaded", function () {
    // ==== Модальное окно для удаления ====
    const deleteModal = document.getElementById("deleteModal");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
    const deleteModalText = document.getElementById("deleteModalText");
    let deleteForm = null;

    document.querySelectorAll(".cart-delete-form").forEach((form) => {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            deleteForm = form;
            deleteModalText.textContent = "Вы уверены, что хотите удалить товар из корзины?";
            deleteModal.style.display = "flex";
        });
    });

    function closeDeleteModal() {
        deleteModal.style.display = "none";
        deleteForm = null;
    }

    cancelDeleteBtn.addEventListener("click", closeDeleteModal);
    document.querySelector(".close")?.addEventListener("click", closeDeleteModal);
    window.addEventListener("click", function (e) {
        if (e.target === deleteModal) closeDeleteModal();
    });

    confirmDeleteBtn.addEventListener("click", function () {
        if (deleteForm) deleteForm.submit();
        closeDeleteModal();
    });

    // ==== Выпадающее меню категорий ====
    const toggle = document.getElementById("categoriesToggle");
    const menu = document.getElementById("categoriesMenu");

    if (toggle && menu) {
        toggle.addEventListener("click", function (e) {
            e.stopPropagation();
            menu.classList.toggle("show");
        });

        document.addEventListener("click", function (e) {
            if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.remove("show");
            }
        });
    }

    // ==== Бургер-меню ====
    const burgerToggle = document.getElementById("burgerToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    if (burgerToggle && mobileMenu) {
        burgerToggle.addEventListener("click", function () {
            mobileMenu.classList.toggle("active");
        });

        document.addEventListener("click", function (e) {
            if (
                mobileMenu.classList.contains("active") &&
                !mobileMenu.contains(e.target) &&
                !burgerToggle.contains(e.target)
            ) {
                mobileMenu.classList.remove("active");
            }
        });
    }

// ==== Галерея: клик по миниатюре → замена основного изображения ====
const mainImage = document.getElementById('main-image');
const galleryItems = document.querySelectorAll('.gallery-item img');

galleryItems.forEach(img => {
    img.addEventListener('click', function() {
        if (mainImage) {
            mainImage.src = this.src;
            mainImage.alt = this.alt;
        }
    });
  });

// JavaScript для управления аватаром
    document.getElementById('delete-avatar-btn')?.addEventListener('click', function () {
        if (confirm('Вы уверены, что хотите удалить аватар?')) {
            document.getElementById('id_avatar-clear').checked = true;
            document.getElementById('profile-form').submit();
        }
    });

    document.getElementById('change-avatar-btn')?.addEventListener('click', function () {
        document.getElementById('id_avatar').click();
    });
});