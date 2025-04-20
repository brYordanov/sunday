import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-bar',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatAutocompleteModule,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  @Input() control: FormControl = new FormControl();
  @Input() label = '';
  @Input() styleVariation: 'fullWidth' | 'default' = 'default';
  @Input() type: 'default' | 'autocomplete' = 'default';
  @Input() onInput: (value: string) => void = () => {};
  @Input() options: string[] | null = [];
}
