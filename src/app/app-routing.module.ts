import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { TodoComponent } from './todo/todo.component';
import { IndexComponent } from './index/index.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'signup', component: SignupComponent},
    { path: 'todo/:username', component: TodoComponent},
    { path: '', component: IndexComponent}

];