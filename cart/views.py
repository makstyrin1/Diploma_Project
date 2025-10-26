from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db import IntegrityError
from .models import CartItem, OrderItem, Order
from products.models import Product


@login_required
def cart_detail(request):
    cart_items = CartItem.objects.filter(user=request.user)
    total = sum(item.total_price for item in cart_items)
    return render(request, 'cart/cart.html', {
        'cart_items': cart_items,
        'total': total
    })


@login_required
def cart_add(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    try:
        cart_item, created = CartItem.objects.get_or_create(
            user=request.user,
            product=product,
            defaults={'quantity': 1}
        )
        if not created:
            cart_item.quantity += 1
            cart_item.save()
        messages.success(request, f'{product.name} добавлен в корзину!')
    except IntegrityError:
        messages.error(request, 'Ошибка при добавлении товара.')
    return redirect('product_list')


@login_required
def cart_remove(request, product_id):
    if request.method == "POST":
        CartItem.objects.filter(user=request.user, product_id=product_id).delete()
        messages.info(request, 'Товар удалён из корзины.')
    return redirect('cart_detail')


@login_required
def cart_increase(request, product_id):
    cart_item = get_object_or_404(CartItem, user=request.user, product_id=product_id)
    cart_item.quantity += 1
    cart_item.save()
    return redirect('cart_detail')


@login_required
def cart_decrease(request, product_id):
    cart_item = get_object_or_404(CartItem, user=request.user, product_id=product_id)
    if cart_item.quantity > 1:
        cart_item.quantity -= 1
        cart_item.save()
    else:
        cart_item.delete()
    return redirect('cart_detail')

@login_required
def cart_checkout(request):
    cart_items = CartItem.objects.filter(user=request.user)
    if not cart_items.exists():
        messages.warning(request, 'Нельзя оформить пустой заказ.')
        return redirect('cart_detail')

    # Создаём заказ
    total = sum(item.total_price for item in cart_items)
    order = Order.objects.create(user=request.user, total_amount=total)

    # Переносим товары из корзины в заказ
    for item in cart_items:
        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.price  # фиксируем цену на момент заказа
        )

    # Очищаем корзину
    cart_items.delete()

    messages.success(request, 'Заказ успешно оформлен!')
    return redirect('order_detail', order_id=order.id)

@login_required
def order_detail(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)
    return render(request, 'cart/order_detail.html', {'order': order})


@login_required
def order_list(request):
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    return render(request, 'cart/order_list.html', {'orders': orders})