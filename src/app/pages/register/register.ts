import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  // Importamos o CommonModule para usar diretivas como *ngIf
  // e o ReactiveFormsModule para trabalhar com formulários reativos.
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent implements OnInit {

  // Declara a propriedade para o nosso formulário.
  registerForm: FormGroup;

  // Injeta o FormBuilder para criar o formulário e o AuthService para a lógica de negócio.
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({}); // Inicialização básica
  }

  ngOnInit(): void {
    // Define a estrutura e as validações do formulário.
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Método chamado quando o formulário é enviado.
  onSubmit(): void {
    // Verifica se o formulário é válido antes de prosseguir.
    if (this.registerForm.valid) {
      console.log('Formulário válido. Enviando dados:', this.registerForm.value);
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Resposta do serviço:', response);
          // Aqui você pode adicionar a lógica para redirecionar o usuário
          // para a página de login após o sucesso.
        },
        error: (err) => {
          console.error('Erro no registro:', err);
          // Aqui você pode exibir uma mensagem de erro para o usuário.
        }
      });
    } else {
      console.log('Formulário inválido. Por favor, verifique os campos.');
      // Marca todos os campos como "tocados" para exibir as mensagens de erro.
      this.registerForm.markAllAsTouched();
    }
  }
}
