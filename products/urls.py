from django.urls import path
from . import views

urlpatterns = [
    path('', views.ProductListView.as_view(), name='product_list'),
    path('category/<slug:slug>/', views.ProductListByCategoryView.as_view(), name='product_list_by_category'),
    path('<int:pk>/', views.ProductDetailView.as_view(), name='product_detail'),
    path('favorites/toggle/<int:product_id>/', views.toggle_favorite, name='toggle_favorite'),
    path('favorites/', views.favorite_list, name='favorite_list'),
]