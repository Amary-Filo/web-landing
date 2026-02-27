import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'page-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.page.html',
  styleUrl: './not-found.page.scss',
  standalone: true,
})
export class NotFoundPage {}
