from django.views.generic import ListView, DetailView
from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from .models import Product, Category, Favorite


class ProductListView(ListView):
    model = Product
    template_name = 'products/product_list.html'
    context_object_name = 'products'

    def get_queryset(self):
        queryset = Product.objects.prefetch_related('images')
        query = self.request.GET.get('q')
        if query:
            queryset = queryset.filter(
                Q(name__icontains=query) | Q(description__icontains=query)
            )
        return queryset.order_by('?')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['current_category'] = None
        context['search_query'] = self.request.GET.get('q', '')
        if self.request.user.is_authenticated:
            context['user_favorites'] = set(
                self.request.user.favorites.values_list('product_id', flat=True)
            )
        else:
            context['user_favorites'] = set()
        return context


class ProductListByCategoryView(ListView):
    model = Product
    template_name = 'products/product_list.html'
    context_object_name = 'products'

    def get_queryset(self):
        self.category = get_object_or_404(Category, slug=self.kwargs['slug'])
        queryset = Product.objects.filter(category=self.category).prefetch_related('images')
        query = self.request.GET.get('q')
        if query:
            queryset = queryset.filter(
                Q(name__icontains=query) | Q(description__icontains=query)
            )
        return queryset.order_by('?')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['current_category'] = self.category
        context['search_query'] = self.request.GET.get('q', '')
        if self.request.user.is_authenticated:
            context['user_favorites'] = set(
                self.request.user.favorites.values_list('product_id', flat=True)
            )
        else:
            context['user_favorites'] = set()
        return context


class ProductDetailView(DetailView):
    model = Product
    template_name = 'products/product_detail.html'
    context_object_name = 'product'

    def get_queryset(self):
        return Product.objects.prefetch_related('images')


@login_required
@require_POST
def toggle_favorite(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    favorite = Favorite.objects.filter(user=request.user, product=product).first()
    
    if favorite:
        favorite.delete()
        status = 'removed'
    else:
        Favorite.objects.create(user=request.user, product=product)
        status = 'added'

    return JsonResponse({'status': status})


@login_required
def favorite_list(request):
    favorites = Favorite.objects.filter(user=request.user).select_related('product__category')
    products = [fav.product for fav in favorites]
    return render(request, 'products/favorites.html', {'products': products})