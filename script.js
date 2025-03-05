document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    let userName = "";
    let userIC = "";
    let oldDate = "";
    let newDate = "";
    let currentStep = "";

    const API_URL = "https://chatbot-backend-lwpb.onrender.com"; // ✅ Update API URL

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
        appendMessage("bot", "Salam sejahtera Tuan/Puan, saya Minibot daripada KKM. <br>Sebelum kita mula, bolehkah saya dapatkan nama Tuan/Puan?");
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
            appendMessage("bot", "Bolehkah saya dapatkan tarikh temujanji baru yang Tuan/Puan inginkan?");
            currentStep = "askNewDate";
        } else if (currentStep === "askNewDate") {
            newDate = userText;
            appendMessage("bot", "Terima kasih, staf kami akan menghubungi Tuan/Puan dalam masa terdekat untuk mengesahkan penukaran temu janji anda.");
            
            // ✅ Send data to backend on Render
            sendDataToBackend({ userName, userIC, oldDate, newDate });

            appendOptions([{ text: "Kembali ke Menu", action: showMainMenu }]);
            currentStep = "";
        }
    }

    function sendDataToBackend(data) {
        fetch(`${API_URL}/submit`, {  // ✅ Updated endpoint
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => console.log("Server Response:", result))
        .catch(error => console.error("Error:", error));
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
        appendMessage("bot", "Maaf atas kesulitan yang berlaku, bolehkah saya mendapat info lanjutan supaya laporan dapat dijalankan?");
        appendOptions([{ text: "Kembali ke Menu", action: showMainMenu }]);
    }

    function handleTukarTemuJanji() {
        appendMessage("bot", "Bolehkah saya dapatkan no.ic Tuan/Puan?");
        currentStep = "askIC";
    }

    startChat();
});

