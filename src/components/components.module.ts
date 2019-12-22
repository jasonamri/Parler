import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
@NgModule({
	declarations: [LoginComponent,
    RegisterComponent],
	imports: [],
	exports: [LoginComponent,
    RegisterComponent]
})
export class ComponentsModule {}
