const users = [
    { username: "user1", password: "pass1" },
    { username: "user2", password: "pass2" }
];

document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.querySelector('.user_save.text');
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            const login = document.querySelector('.user_login.text').value;
            const password = document.querySelector('.user_pass.text').value;

            const user = users.find(u => u.username === login && u.password === password);
            if (user) {
                alert('Успешная авторизация!');
            } else {
                alert('Неверный логин или пароль.');
            }
        });
    }

    const registerButton = document.querySelector('.user_profile.registration .user_save.text');
    if (registerButton) {
        registerButton.addEventListener('click', function() {
            const login = document.querySelector('.user_profile.registration .user_login.text').value;
            const password = document.querySelector('.user_profile.registration .user_pass.text').value;
            const confirmPassword = document.querySelector('.user_profile.registration .user_pass.text:nth-of-type(2)').value;

            if (password !== confirmPassword) {
                alert('Пароли не совпадают');
                return;
            }

            // Проверка на существующего пользователя
            const existingUser = users.find(u => u.username === login);
            if (existingUser) {
                alert('Пользователь с таким логином уже существует.');
                return;
            }
            
            // Добавление нового пользователя
            users.push({ username: login, password: password });
            alert('Регистрация прошла успешно!');
            console.log(users); // Для проверки вы можете вывести массив пользователей
        });
    }


    
});
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.button_list');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.innerText; 
            const targetHeadings = document.querySelectorAll('.zag'); 

            if (target === "Аудитория № 218") {
                const specialHeading = Array.from(targetHeadings).find(targetHeading => 
                    targetHeading.innerText.includes("Аудитория № 227(218)")
                ); 
                if (specialHeading) {
                    specialHeading.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                targetHeadings.forEach(targetHeading => {
                    if (targetHeading.innerText.includes(target)) { 
                        targetHeading.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const problemInput = document.querySelector('.write.text');
    const addProblemButton = document.querySelector('.button_save.text');
    const problemsList = document.createElement('div');
    document.querySelector('.menu').appendChild(problemsList);

    let selectedIcon = null;

    console.log('Ищем иконки...');
    const iconLinks = document.querySelectorAll('.pc a');
    console.log(iconLinks);
    if (iconLinks.length === 0) {
        console.error('Иконки не найдены! Проверьте селектор .pc a');
        return; // выход из функции, если иконки не найдены
        
    }
    iconLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            selectedIcon = link.querySelector('img').alt || link.dataset.icon;
            iconLinks.forEach(l => l.classList.remove('selected'));
            link.classList.add('selected');
        });
    });
    console.log(selectedIcon)

    addProblemButton.addEventListener('click', function() {
        const problemText = problemInput.value;
        console.log(problemText)
        if (selectedIcon && problemText) {
            const problemItem = document.createElement('div');
            problemItem.className = 'problem-item';
            problemItem.textContent = `Иконка ${selectedIcon}: ${problemText}`;

            const resolvedButton = document.createElement('button');
            resolvedButton.textContent = 'Решено';
            resolvedButton.className = 'button_problem text';
            resolvedButton.addEventListener('click', function() {
                problemItem.style.textDecoration = 'line-through';
            });

            problemItem.appendChild(resolvedButton);
            problemsList.appendChild(problemItem);

            problemInput.value = '';
            selectedIcon = null;
            iconLinks.forEach(l => l.classList.remove('selected'));
        } else {
            alert('Пожалуйста, выберите иконку и напишите проблему!');
        }
    });
});











document.addEventListener('DOMContentLoaded', function() {
    // Открытие окна проблем при клике на иконку компьютера
    const pcIcons = document.querySelectorAll('.pc img');
    const problemMenu = document.querySelector('.menu');
    const problemTitle = problemMenu.querySelector('.zag_menu');
    let selectedPc = null;
    let problemsData = new Map();

    pcIcons.forEach((icon, index) => {
        problemsData.set(index, []);
        icon.addEventListener('click', function() {
            selectedPc = index;
            problemTitle.textContent = `Компьютер №${index + 1}`;
            updateProblemList();
            problemMenu.classList.add('visible');
        });
    });

    function updateProblemList() {
        const problemContainer = problemMenu.querySelector('.problem');
        problemContainer.innerHTML = '';
        problemsData.get(selectedPc).forEach(problem => {
            const problemDiv = document.createElement('div');
            problemDiv.classList.add('problem_text');
            
            const input = document.createElement('input');
            input.type = 'text';
            input.classList.add('write', 'text', problem.severity);
            input.value = problem.text;
            input.disabled = true;
            
            const resolveButton = document.createElement('button');
            resolveButton.classList.add('button_problem', 'text');
            resolveButton.textContent = 'Решено';
            resolveButton.addEventListener('click', function() {
                problemsData.set(selectedPc, problemsData.get(selectedPc).filter(p => p !== problem));
                updateProblemList();
                updatePcIconColor();
            });

            problemDiv.appendChild(input);
            problemDiv.appendChild(resolveButton);
            problemContainer.appendChild(problemDiv);
        });
        updatePcIconColor();
    }

    // Открытие окна добавления проблемы
    const addProblemButton = document.querySelector('.button_save.text');
    const newProblemModal = document.querySelector('.new_problem');
    addProblemButton.addEventListener('click', function() {
        newProblemModal.classList.add('visible');
    });

    // Добавление проблемы
    const problemInput = document.querySelector('.problem_input_write');
    const addProblemConfirmButton = document.querySelector('.problem_input_button');
    const severityButtons = document.querySelectorAll('.button_new_Problem');
    let problemSeverity = 'yellow';

    severityButtons.forEach(button => {
        button.addEventListener('click', function() {
            problemSeverity = button.classList.contains('red') ? 'red' : 'yellow';
        });
    });

    addProblemConfirmButton.addEventListener('click', function() {
        if (selectedPc !== null && problemInput.value.trim() !== '') {
            problemsData.get(selectedPc).push({ text: problemInput.value, severity: problemSeverity });
            updateProblemList();
            problemInput.value = '';
            newProblemModal.classList.remove('visible');
        } else {
            alert('Выберите компьютер и введите проблему!');
        }
    });

    function updatePcIconColor() {
        pcIcons.forEach((icon, index) => {
            const hasRed = problemsData.get(index).some(p => p.severity === 'red');
            icon.style.border = hasRed ? '3px solid red' : '3px solid yellow';
        });
    }
});
