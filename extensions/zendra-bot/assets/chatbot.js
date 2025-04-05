document.addEventListener("DOMContentLoaded", function () {
  // Inyectar la nueva interfaz en #chatbot-window
  const chatbotWindow = document.getElementById("chatbot-window");
  chatbotWindow.innerHTML = `
    <div class="chatbot-header">
      <div class="brand">
        <img src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png" alt="bot-icon">
        Zendra
      </div>
      <div class="hamburger-menu" id="hamburgerMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="dropdown-content" id="dropdownContent">
        <button id="resetBtn">Resetear</button>
      </div>
    </div>
    <div class="chatbot-body" id="chatbotBody">
      <!-- Mensajes se cargarán aquí -->
    </div>
    <div class="chatbot-footer">
      <input type="text" id="userInput" placeholder="Escribe tu mensaje..." />
      <button id="sendBtn">Enviar</button>
    </div>
  `;

  // --- Función para abrir/cerrar el chatbot ---
  const chatbotToggle = document.getElementById("chatbot-toggle");
  const chatbotOpenToggle = document.getElementById("chatbot-open-toggle");
  const chatbotCloseToggle = document.getElementById("chatbot-close-toggle");

  chatbotToggle.addEventListener("click", function () {
    chatbotWindow.classList.toggle("visible");
    chatbotOpenToggle.classList.toggle("hidden");
    chatbotCloseToggle.classList.toggle("hidden");
  });

  // --- Funciones de utilidad ---

  // Genera un UUID v4
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function setConversationId(conversationId) {
    localStorage.setItem('zendra_chat_conversation_id', conversationId);
  }

  function getConversationId() {
    return localStorage.getItem('zendra_chat_conversation_id');
  }

  // Obtiene o crea un ID único para el usuario
  const getUserId = () => {
    let userId = localStorage.getItem('zendra_chat_user_id');
    if (!userId) {
      userId = generateUUID();
      localStorage.setItem('zendra_chat_user_id', userId);
    }
    return userId;
  };

  // Cargar el historial de mensajes desde la API
  async function loadChatHistory(userId) {
    const conversationId = getConversationId();
    if (!conversationId) return [];
    try {
      const response = await fetch(`https://api.dify.ai/v1/messages?user=${userId}&conversation_id=${conversationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer app-6yotohJxpOjC1pSAaC5TpFSl`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Error al cargar el historial');
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error cargando el historial:', error);
      return [];
    }
  }

  // Agregar un mensaje en la nueva interfaz
  function addMessage(text, sender = 'bot', timestamp_from_data = null) {
    const chatbotBody = document.getElementById('chatbotBody');
    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper');

    const msg = document.createElement('div');
    msg.textContent = text;
    if (sender === 'bot') {
      msg.classList.add('bot-message');
    } else {
      msg.classList.add('user-message');
    }
    wrapper.appendChild(msg);

    // Agregar timestamp
    const timestamp = document.createElement('div');
    if (sender === 'bot') {
      timestamp.classList.add('timestamp-bot');
    } else {
      timestamp.classList.add('timestamp-user');
    }
    const now = new Date();

    let timestamp_text;
    if (timestamp_from_data) {
      // Convertir timestamp Unix (segundos) a milisegundos para Date()
      const date = new Date(timestamp_from_data * 1000);
      timestamp_text = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      timestamp_text = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    timestamp.textContent = timestamp_text;
    wrapper.appendChild(timestamp);

    chatbotBody.appendChild(wrapper);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  }

  // Inicializar el chat cargando el historial
  async function initializeChat() {
    const userId = getUserId();
    const messages = await loadChatHistory(userId);
    messages.sort((a, b) => a.created_at - b.created_at).forEach(message => {
      if (message.query) addMessage(message.query, 'user', message.created_at);
      if (message.answer) addMessage(message.answer, 'bot', message.created_at);
    });
  }

  // Resetear el chat (por ejemplo, mediante el botón del dropdown)
  function resetChat() {
    const chatbotBody = document.getElementById('chatbotBody');
    chatbotBody.innerHTML = '';
    addMessage('¡Bienvenidos a nuestra tienda en línea!', 'bot');
    addMessage('¿Cómo te puedo ayudar?', 'bot');
  }

  // --- Eventos de la nueva UI ---

  // Menú hamburguesa para desplegar opciones
  const hamburgerMenu = document.getElementById('hamburgerMenu');
  const dropdownContent = document.getElementById('dropdownContent');
  const resetBtn = document.getElementById('resetBtn');

  hamburgerMenu.addEventListener('click', () => {
    dropdownContent.classList.toggle('show');
  });

  // Cierra el menú si se hace clic fuera de él
  window.addEventListener('click', (e) => {
    if (!e.target.closest('#hamburgerMenu') && !e.target.closest('#dropdownContent')) {
      dropdownContent.classList.remove('show');
    }
  });

  resetBtn.addEventListener('click', () => {
    resetChat();
    dropdownContent.classList.remove('show');
  });

  // Envío de mensaje
  const sendBtn = document.getElementById('sendBtn');
  const userInput = document.getElementById('userInput');

  sendBtn.addEventListener('click', async () => {
    const text = userInput.value.trim();
    if (text !== '') {
      addMessage(text, 'user');
      userInput.value = '';

      // Indicador "Thinking..."
      const chatbotBody = document.getElementById('chatbotBody');
      const thinkingWrapper = document.createElement('div');
      thinkingWrapper.classList.add('message-wrapper');
      const thinkingMsg = document.createElement('div');
      thinkingMsg.textContent = 'Thinking...';
      thinkingMsg.classList.add('bot-message');
      thinkingWrapper.appendChild(thinkingMsg);
      const timestamp = document.createElement('div');
      timestamp.classList.add('timestamp');
      const now = new Date();
      timestamp.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      thinkingWrapper.appendChild(timestamp);
      chatbotBody.appendChild(thinkingWrapper);
      chatbotBody.scrollTop = chatbotBody.scrollHeight;

      try {
        const response = await fetch("https://t4fuo3x065.execute-api.sa-east-1.amazonaws.com/dev/ask", {
          method: "POST",
          headers: {
            "x-api-key": "jpLK2lBdPXazhDz6K0yvG5Pef2w1ZMYr2OGMHElh",
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          mode: 'cors',
          body: JSON.stringify({
            shop: "quickstart-5000816f.myshopify.com",
            question: text,
            user: getUserId()
          }),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        chatbotBody.removeChild(thinkingWrapper);
        addMessage(data.response, 'bot');
        setConversationId(data.conversation_id);
      } catch (error) {
        chatbotBody.removeChild(thinkingWrapper);
        addMessage(error.message === 'Failed to fetch'
          ? 'No hay conexión a internet. Por favor, verifica tu conexión.'
          : `Lo siento, hubo un error: ${error.message}`, 'bot');
        console.error('Chat error:', error);
      }
    }
  });

  // Enviar mensaje con la tecla Enter
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendBtn.click();
  });

  // Inicializar el chat con historial al cargar la página
  initializeChat();
});
