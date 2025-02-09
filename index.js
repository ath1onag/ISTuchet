const users = [
    { username: "1", password: "2" },
    { username: "admin", password: "adminaud" }
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
                document.getElementById("popup").style.display = "none";
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
                    targetHeading.innerText.includes("Аудитория № 218")
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
    let selectedAuditoriumContainer = null;
    let selectedPc = null;
    const auditoriumProblems = new Map();
    const newProblemModal = document.getElementById('popip');
    const problemInput = document.querySelector('.problem_input_write');
    const addProblemConfirmButton = document.getElementById('delprob');
    const severityButtons = document.querySelectorAll('.button_new_Problem');
    let problemSeverity = 'yellow';

    severityButtons.forEach(button => {
        button.addEventListener('click', function() {
            problemSeverity = button.classList.contains('red') ? 'red' : 'yellow';
        });
    });

    function updatePcIconColor(container) {
        const pcIcons = container.querySelectorAll('.pc img');
        const computersProblems = auditoriumProblems.get(container);
        pcIcons.forEach((icon, idx) => {
            if (computersProblems[idx].length === 0) {
                icon.style.filter = 'none';
            } else {
                const hasCritical = computersProblems[idx].some(p => p.severity === 'red');
                icon.style.filter = hasCritical ? 'invert(34%) sepia(88%) saturate(7492%) hue-rotate(357deg) brightness(105%) contrast(110%)' 
                                               : 'invert(83%) sepia(39%) saturate(421%) hue-rotate(356deg) brightness(99%) contrast(95%)';
            }
        });
    }

    function updateProblemList(container, pcIndex) {
        const computersProblems = auditoriumProblems.get(container);
        const menuElement = container.querySelector('.menu');
        const problemContainer = menuElement.querySelector('.problem');
        problemContainer.innerHTML = '';

        computersProblems[pcIndex].forEach((problem, problemIndex) => {
            const problemDiv = document.createElement('div');
            problemDiv.classList.add('problem_text');
            
            const input = document.createElement('div');
            input.classList.add('write', problem.severity);
            input.innerHTML = `<p class="text pad">${problem.text}</p>`;
            
            const resolveButton = document.createElement('button');
            resolveButton.classList.add('button_problem', 'text');
            resolveButton.textContent = 'Решено';
            resolveButton.addEventListener('click', function() {
                computersProblems[pcIndex].splice(problemIndex, 1);
                updateProblemList(container, pcIndex);
                updatePcIconColor(container);
            });

            problemDiv.appendChild(input);
            problemDiv.appendChild(resolveButton);
            problemContainer.appendChild(problemDiv);
        });

        const addButton = document.createElement('button');
        addButton.classList.add('button_save', 'text');
        addButton.textContent = 'Добавить проблему';
        addButton.addEventListener('click', function() {
            selectedAuditoriumContainer = container;
            selectedPc = pcIndex;
            newProblemModal.style.display = 'flex';
        });
        problemContainer.appendChild(addButton);

        updatePcIconColor(container);
    }

    const auditoriumContainers = Array.from(document.querySelectorAll('.container')).filter(container => container.querySelector('.pc'));
    auditoriumContainers.forEach(container => {
        const pcIcons = container.querySelectorAll('.pc img');
        const computersProblems = Array.from({ length: pcIcons.length }, () => []);
        auditoriumProblems.set(container, computersProblems);

        pcIcons.forEach((icon, index) => {
            icon.addEventListener('click', function(event) {
                event.preventDefault();
                selectedAuditoriumContainer = container;
                selectedPc = index;
                const menuElement = container.querySelector('.menu');
                menuElement.querySelector('.zag_menu').textContent = `Компьютер №${index + 1}`;
                updateProblemList(container, index);
                menuElement.classList.add('visible');
            });
        });
    });

    addProblemConfirmButton.addEventListener('click', function() {
        if (selectedAuditoriumContainer && selectedPc !== null && problemInput.value.trim() !== '') {
            const computersProblems = auditoriumProblems.get(selectedAuditoriumContainer);
            computersProblems[selectedPc].push({ text: problemInput.value, severity: problemSeverity });
            updateProblemList(selectedAuditoriumContainer, selectedPc);
            problemInput.value = '';
            newProblemModal.style.display = 'none';
        } else {
            alert('Выберите компьютер и введите проблему!');
        }
    });

    document.getElementById('popup').style.display = 'flex';
    document.getElementById('closePopup').onclick = function() {
        document.getElementById('popup').style.display = 'none';
    };
});




document.getElementById("addprob1").onclick = function() {
    document.getElementById("popip").style.display = "flex";
}
document.getElementById("addprob2").onclick = function() {
    document.getElementById("popip").style.display = "flex";
}
document.getElementById("addprob3").onclick = function() {
    document.getElementById("popip").style.display = "flex";
}
document.getElementById("addprob4").onclick = function() {
    document.getElementById("popip").style.display = "flex";
}
document.getElementById("addprob5").onclick = function() {
    document.getElementById("popip").style.display = "flex";
}
document.getElementById("addprob6").onclick = function() {
    document.getElementById("popip").style.display = "flex";
}
document.getElementById("delprob").onclick = function() {
    document.getElementById("popip").style.display = "none";
}


document.getElementById("popup").style.display = "flex";


document.getElementById("closePopup").onclick = function() {
    document.getElementById("popup").style.display = "none";
}

// Функции для открытия и закрытия поп-ап окна

