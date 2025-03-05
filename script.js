document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    let userName = "";
    let userIC = "";
    let oldDate = "";
    let newDate = "";
    let currentStep = "";

    function appendMessage(sender, message) {
        let messageElement = document.createElement("div");
        messageElement.classList.add(sender === "bot" ? "bot-message" : "user-message");
        messageElement.innerHTML = message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function appendOptions(options) {
        let optionsContainer = document.createElement("div");
        optionsContainer.classList.add("options");
        options.forEach(option => {
            let btn = document.createElement("button");
            btn.innerText = option.text;
            btn.onclick = option.action;
            optionsContainer.appendChild(btn);
        });
        chatBox.appendChild(optionsContainer);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function startChat() {
        appendMessage("bot", "Salam sejahtera! Saya Minibot daripada KKM. <br>Sebelum kita mula, bolehkah saya dapatkan nama Tuan/Puan?");
    }

    function showMainMenu() {
        appendOptions([
            { text: "Rawatan Pergigian", action: handleRawatanPergigian },
            { text: "Complain", action: handleComplain },
            { text: "Tukar Temu Janji", action: handleTukarTemuJanji }
        ]);
    }

    function sendMessage() {
        let userText = userInput.value.trim();
        if (userText === "") return;

        appendMessage("user", userText);
        userInput.value = "";

        if (!userName) {
            userName = userText;
            appendMessage("bot", `Bagaimana saya dapat membantu ${userName}?`);
            showMainMenu();
        } else if (currentStep === "askIC") {
            userIC = userText;
            appendMessage("bot", "Bolehkah saya dapat tarikh temujanji asal Tuan/Puan?");
            currentStep = "askOldDate";
        } else if (currentStep === "askOldDate") {
            oldDate = userText;
            appendMessage("bot", "Bolehlah saya dapatkan tarikh temujanji baru yang Tuan/Puan ingin?");
            currentStep = "askNewDate";
        } else if (currentStep === "askNewDate") {
            newDate = userText;
            appendMessage("bot", "Terima kasih! Data akan dihantar. Sila tunggu...");

            // Send data to backend
            saveAppointment();

            appendOptions([{ text: "Kembali ke Menu", action: showMainMenu }]);
            currentStep = ""; 
        }
    }

    function saveAppointment() {
        fetch("https://chatbot-backend-lwpb.onrender.com/save_appointment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userName: userName,
                userIC: userIC,
                oldDate: oldDate,
                newDate: newDate
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                appendMessage("bot", "Temujanji telah berjaya dihantar!");
            } else {
                appendMessage("bot", "Maaf, terdapat masalah menyimpan data.");
            }
        })
        .catch(error => {
            appendMessage("bot", "Ralat dalam menghantar data. Sila cuba lagi.");
            console.error("Error:", error);
        });
    }

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") sendMessage();
    });

    function handleRawatanPergigian() {
        appendMessage("bot", "Gigi sangat penting");
        appendOptions([
            { text: "Penskaleran", action: () => appendMessage("bot", "Cuci Gigi") },
            { text: "Tampal Gigi", action: () => appendMessage("bot", "Remove caries") },
            { text: "Cabut Gigi", action: () => appendMessage("bot", "Ambil keluar gigi") },
            { text: "Kembali ke Menu", action: showMainMenu }
        ]);
    }

    function handleComplain() {
        appendMessage("bot", "Maaf atas kesulitan, bolehkah saya mendapat info lanjut?");
        appendOptions([{ text: "Kembali ke Menu", action: showMainMenu }]);
    }

    function handleTukarTemuJanji() {
        appendMessage("bot", "Bolehkah saya dapatkan no.ic Tuan/Puan?");
        currentStep = "askIC";
    }

    startChat();
});

