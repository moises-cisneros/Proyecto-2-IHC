## MODIFIED Requirements

### Requirement: Clean Login Screen
The Login Page SHALL contain only the authentication form (email, password, submit button, and recovery/registration links). It SHALL NOT display test or demonstration buttons.

#### Scenario: User visits login page
- GIVEN a visitor on `/login`
- THEN the page displays "Correo electrónico", "Contraseña", and "Entrar" button
- AND the page does NOT display the test color toggle button
