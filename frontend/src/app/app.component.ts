import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
// import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  credentials = { username: '', password: '' };
  loggedIn = false;

  registerMode = false;
  registerCredentials = { username: '', password: '' };

  title = "Contact App"

  contacts!: { id: number, name: string; phone: string }[];

  newContact = {
    name: '',
    phone: ''
  };

  editMode: boolean = false;
  editContactId: number | null = null;

  currentTime!: string;

  constructor(private http: HttpClient) { }

  login() {
    this.http.post<{ token: string }>(`${environment.apiBaseUrl}/login`, this.credentials)
      .subscribe({
        next: (response) => {
          sessionStorage.setItem('token', response.token);
          this.loggedIn = true;

          this.fetchContacts();
          this.startClock();
        },
        error: () => alert('Login failed')
      });
  }

  logout() {
    sessionStorage.removeItem('token');
    this.loggedIn = false;
  }

  register() {
    this.http.post<{ message: string }>(`${environment.apiBaseUrl}/register`, this.registerCredentials)
      .subscribe({
        next: () => {
          alert('Registration successful! Please log in.');
          this.registerMode = false;
        },
        error: () => alert('Registration failed.')
      });
  }

  getAuthHeaders() {
    const token = sessionStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  startClock() {
    const clockObservable = new Observable<string>((observer) => {
      setInterval(() => {
        const now = new Date().toLocaleTimeString();
        observer.next(now);
      }, 1000);
    })


    clockObservable.subscribe((time) => {
      this.currentTime = time;
    })
  }


  ngOnInit() {

    this.loggedIn = !!sessionStorage.getItem('token');

    if (this.loggedIn) {
      this.fetchContacts();
      this.startClock();
    }
  }

  fetchContacts() {
    this.http
      .get<{ id: number; name: string; phone: string }[]>(`${environment.apiBaseUrl}/contacts`, this.getAuthHeaders())
      .subscribe((data) => this.contacts = data);
  }

  addContact() {
    if (this.newContact.name.trim() && this.newContact.phone.trim()) {
      this.http
        .post<{ id: number; name: string; phone: string }>(`${environment.apiBaseUrl}/contacts/create`, this.newContact, this.getAuthHeaders())
        .subscribe((contact) => {
          this.contacts.push(contact);
          this.newContact.name = '';
          this.newContact.phone = '';
        });
    }
  }

  startEdit(contact: { id: number; name: string; phone: string }) {
    this.editMode = true;
    this.editContactId = contact.id;
    this.newContact.name = contact.name;
    this.newContact.phone = contact.phone;
  }
  updateContact() {
    if (this.editContactId !== null) {
      this.http
        .put<{ id: number; name: string; phone: string }>(
          `${environment.apiBaseUrl}/contacts/update/${this.editContactId}`,
          this.newContact,
          this.getAuthHeaders()
        )
        .subscribe((updatedContact) => {
          const index = this.contacts.findIndex(c => c.id === this.editContactId);
          if (index !== -1) this.contacts[index] = updatedContact;

          this.editMode = false;
          this.editContactId = null;
          this.newContact = { name: '', phone: '' };
          this.fetchContacts();
        });
    }
  }

  deleteContact(id: number) {
    this.http
      .delete(`${environment.apiBaseUrl}/contacts/delete/${id}`, this.getAuthHeaders())
      .subscribe(() => {
        this.contacts = this.contacts.filter(contact => contact.id !== id);
      });
  }

}
