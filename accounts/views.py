from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from django.urls import reverse_lazy
from django.views.generic import CreateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView

class SignUpView(CreateView):
    form_class = UserCreationForm
    success_url = reverse_lazy('product_list')
    template_name = 'accounts/signup.html'

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect(self.success_url)

class ProfileView(LoginRequiredMixin, TemplateView):
    template_name = 'accounts/profile.html'