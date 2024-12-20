import { users } from "../types";

function capitalize(str: string) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function login() {
    const stored_username = localStorage.getItem('username');
    const form = document.getElementById('login-form') as HTMLFormElement;
    const dialog = document.getElementById('password-dialog') as HTMLDialogElement;
    const dialogForm = document.getElementById('dialog-form') as HTMLFormElement;
    const dialogInput = document.getElementById('password') as HTMLInputElement;
    const loggedInDiv = document.getElementById('logged-in');
    const logoutButton = document.getElementById('logout-button');

    if (stored_username && users.find(u => u.username.toLowerCase() === stored_username)) {
        form?.classList.add('hidden');
        loggedInDiv?.classList.remove('hidden');
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            usernameDisplay.textContent = capitalize(stored_username);
        }

        logoutButton?.addEventListener('click', () => {
            localStorage.removeItem('username');
            location.reload();
        });
    } else {
        form?.classList.remove('hidden');
        loggedInDiv?.classList.add('hidden');
    }

    form?.addEventListener('submit', (event) => {
        event.preventDefault();
        const usernameInput = document.getElementById('username') as HTMLInputElement;
        const inputUsername = usernameInput?.value.trim().toLowerCase();

        if (inputUsername) {
            const user = users.find(u => u.username.toLowerCase() === inputUsername);

            if (user) {
                if (user.role === 'admin') {
                    // Open dialog for admin password
                    dialog.showModal();
                    dialogForm.onsubmit = (e) => {
                        e.preventDefault();
                        const password = dialogInput.value.trim();

                        if (password === 'adminpassword') { // Replace with your actual password logic
                            dialog.close();
                            localStorage.setItem('username', user.username);
                            location.reload();
                        } else {
                            alert('Incorrect password!');
                        }
                    };
                } else {
                    // Non-admin user
                    localStorage.setItem('username', user.username);
                    location.reload();
                }
            } else {
                alert('Invalid username.');
            }
        } else {
            alert('Please enter a valid username.');
        }
    });
}

export function useUser() {
    return localStorage.getItem('username');
}

const interval = setInterval(() => login(), 500)
