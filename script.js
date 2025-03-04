document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");

    let userName = "";
    let currentState = "askName"; // Tracks the bot's conversation state
    let userDetails = { ic: "", oldDate: "", newDate: "" };

    function addMessage(text, sender = "bot") {
        const message = document.createElement("p");
        message.classList.add(sender === "bot" ? "bot-message" : "user-message");
        message.innerHTML = text;
        chatBox.appendChild(message);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function showMainMenu() {
        currentState = "mainMenu";
        addMessage(`Bagaimana saya dapat membantu ${userName}?`);
        addButtons(["Rawatan Pergigian", "Complain", "Tukar Temu Janji"]);
    }

    function addButtons(options) {
        const buttonContainer = document.createElement("div");
        options.forEach(option => {
            const button = document.createElement("button");
            button.innerText = option;
            button.onclick = () => handleButtonClick(option);
            buttonContainer.appendChild(button);
        });
        chatBox.appendChild(buttonContainer);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function handleButtonClick(choice) {
        if (choice === "Kembali ke Menu") {
            showMainMenu();
        } else if (choice === "Rawatan Pergigian") {
            addMessage("Gigi sangat penting");
            addButtons(["Penskaleran", "Tampal Gigi", "Cabut Gigi", "Kembali ke Menu"]);
        } else if (choice === "Penskaleran") {
            addMessage("Cuci Gigi");
        } else if (choice === "Tampal Gigi") {
            addMessage("Remove caries");
        } else if (choice === "Cabut Gigi") {
            addMessage("Ambil keluar gigi");
        } else if (choice === "Tukar Temu Janji") {
            currentState = "askIC";
            addMessage("Bolehkah saya dapatkan no.ic Tuan/Puan?");
        } else if (choice === "Complain") {
            addMessage("Maaf atas kesulitan yang berlaku, bolehkah saya mendapat info lanjutan supaya laporan dapat dijalankan?");
        }
    }

    function processUserResponse(message) {
        if (currentState === "askName") {
            userName = message;
            addMessage(userName, "user");
            showMainMenu();
        } else if (currentState === "askIC") {
            userDetails.ic = message;
            addMessage(message, "user");
            currentState = "askOldDate";
            addMessage("Bolehkah saya dapat tarikh temujanji asal Tuan/Puan?");
        } else if (currentState === "askOldDate") {
            userDetails.oldDate = message;
            addMessage(message, "user");
            currentState = "askNewDate";
            addMessage("Bolehlah saya dapatkan tarikh temujanji baru yang Tuan/Puan ingin?");
        } else if (currentState === "askNewDate") {
            userDetails.newDate = message;
            addMessage(message, "user");
            currentState = "mainMenu";
            addMessage("Terima kasih, staf kami akan menghubungi Tuan/Puan dalam masa terdekat untuk confirmkan penukaran temu janji anda.");
            addButtons(["Kembali ke Menu"]);
        }
    }

    sendButton.addEventListener("click", function () {
        const message = userInput.value.trim();
        if (message) {
            processUserResponse(message);
            userInput.value = "";
        }
    });

    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendButton.click();
        }
    });

    // Initial Greeting
    addMessage("Salam sejahtera Tuan/Puan, saya Minibot daripada KKM.<br>Sebelum kita mula, bolehkah saya dapatkan nama Tuan/Puan?");
});

