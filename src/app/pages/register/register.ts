import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router'; // Importa o Router para navegação

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {

  // 1. Apenas declaramos a propriedade aqui.
  registerForm: FormGroup;

  // Injetamos as dependências no construtor.
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {
    // 2. A SOLUÇÃO: Inicializamos o formulário AQUI, dentro do construtor.
    // Agora, 'fb' já existe e o formulário é criado antes de o HTML ser renderizado.
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // O ngOnInit não é necessário para a inicialização do formulário.

  // Método chamado quando o formulário é submetido.
  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Formulário válido. Enviando dados:', this.registerForm.value);
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Resposta do serviço:', response);
          // Redireciona para a página de login após o registo bem-sucedido.
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Erro no registo:', err);
          // Aqui você pode exibir uma mensagem de erro para o utilizador.
        }
      });
    } else {
      console.log('Formulário inválido. Por favor, verifique os campos.');
      this.registerForm.markAllAsTouched();
    }
  }
}

