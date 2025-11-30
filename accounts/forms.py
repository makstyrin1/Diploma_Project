from django import forms
from django.contrib.auth.forms import PasswordChangeForm
from .models import Profile


class ProfileForm(forms.ModelForm):
    email = forms.EmailField(required=False, label='Email')
    class Meta:
        model = Profile
        fields = ['first_name', 'last_name', 'address', 'phone', 'avatar', 'email']
        widgets = {
            'address': forms.Textarea(attrs={'rows': 3}),
            'phone': forms.TextInput(attrs={'placeholder': '+7 (999) 123-45-67',}),
        }

    def save(self, commit=True):
        profile = super().save(commit=False)
    
        user = profile.user
        user.first_name = self.cleaned_data.get('first_name', '')
        user.last_name = self.cleaned_data.get('last_name', '')
        user.email = self.cleaned_data.get('email', '')
        
        if commit:
            user.save()
            profile.save()
        
        return profile

class CustomPasswordChangeForm(PasswordChangeForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['old_password'].widget.attrs.update({'class': 'form-control'})
        self.fields['new_password1'].widget.attrs.update({'class': 'form-control'})
        self.fields['new_password2'].widget.attrs.update({'class': 'form-control'})