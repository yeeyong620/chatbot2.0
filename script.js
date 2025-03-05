document.addEventListener("DOMContentLoaded", function () {
    const chatbox = document.getElementById("chatbox");
    const userInput = document.getElementById("userInput");
    const sendButton = document.getElementById("sendButton");

    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (message === "") return;

        appendMessage("user", message);
        userInput.value = "";

        processUserMessage(message);
    }

    function appendMessage(sender, message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", sender);
        messageElement.textContent = message;
        chatbox.appendChild(messageElement);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    function processUserMessage(message) {
        if (message.toLowerCase().includes("tukar temu janji")) {
            askForDetails();
        } else {
            appendMessage("bot", "Maaf, saya tidak memahami pertanyaan anda. Sila cuba lagi.");
        }
    }

    function askForDetails() {
        appendMessage("bot", "Sila masukkan nama anda:");
        userInput.addEventListener("keypress", getName);
    }

    function getName(event) {
        if (event.key === "Enter") {
            const userName = userInput.value.trim();
            if (userName === "") return;
            appendMessage("user", userName);
            userInput.value = "";
            userInput.removeEventListener("keypress", getName);

            appendMessage("bot", "Sila masukkan nombor IC anda:");
            userInput.addEventListener("keypress", function getIC(event) {
                if (event.key === "Enter") {
                    const userIC = userInput.value.trim();
                    if (userIC === "") return;
                    appendMessage("user", userIC);
                    userInput.value = "";
                    userInput.removeEventListener("keypress", getIC);

                    appendMessage("bot", "Masukkan tarikh asal temujanji anda (YYYY-MM-DD):");
                    userInput.addEventListener("keypress", function getOldDate(event) {
                        if (event.key === "Enter") {
                            const oldDate = userInput.value.trim();
                            if (oldDate === "") return;
                            appendMessage("user", oldDate);
                            userInput.value = "";
                            userInput.removeEventListener("keypress", getOldDate);

                            appendMessage("bot", "Masukkan tarikh baru temujanji anda (YYYY-MM-DD):");
                            userInput.addEventListener("keypress", function getNewDate(event) {
                                if (event.key === "Enter") {
                                    const newDate = userInput.value.trim();
                                    if (newDate === "") return;
                                    appendMessage("user", newDate);
                                    userInput.value = "";
                                    userInput.removeEventListener("keypress", getNewDate);

                                    saveAppointment(userName, userIC, oldDate, newDate);
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    function saveAppointment(userName, userIC, oldDate, newDate) {
        fetch(https://script.google.com/macros/s/AKfycbwnZh74D8JMN-M8e3fOfvBNji6u3ORjOj5C83NPRMO8u4QlQaHpDFzWDYxrrIRRx-c9_w/exec, {
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
                appendMessage("bot", "Temujanji telah berjaya dihantar ke Google Sheets!");
            } else {
                appendMessage("bot", "Maaf, terdapat masalah menyimpan data.");
            }
        })
        .catch(error => {
            appendMessage("bot", "Ralat dalam menghantar data. Sila cuba lagi.");
            console.error("Error:", error);
        });
    }
});

