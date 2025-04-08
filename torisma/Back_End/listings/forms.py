from django import forms
import datetime

class CarForm(forms.Form):
    manufacturing_year = forms.IntegerField()

    def clean_manufacturing_year(self):
        year = self.cleaned_data['manufacturing_year']
        current_year = datetime.date.today().year
        if year < 1900 or year > current_year:
            raise forms.ValidationError(f"Year must be between 1900 and {current_year}.")
        return year
