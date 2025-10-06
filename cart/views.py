from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db import IntegrityError
from .models import CartItem
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