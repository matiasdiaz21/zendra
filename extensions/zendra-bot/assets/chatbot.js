document.addEventListener("DOMContentLoaded", function () {
  // Obtener elementos existentes
  const chatbotToggle = document.getElementById("chatbot-toggle");
  const chatbotWindow = document.getElementById("chatbot-window");
  const chatbotBody = document.getElementById("chatbotBody");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");

  // Variables y funciones de utilidad
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function setConversationId(conversationId) {
    localStorage.setItem('zendra_chat_conversation_id', conversationId);
  }

  function getConversationId() {
    return localStorage.getItem('zendra_chat_conversation_id');
  }

  const getUserId = () => {
    let userId = localStorage.getItem('zendra_chat_user_id');
    if (!userId) {
      userId = generateUUID();
      localStorage.setItem('zendra_chat_user_id', userId);
    }
    return userId;
  };

  // Cargar el historial de mensajes
  async function loadChatHistory(userId) {
    const conversationId = getConversationId();
    const welcomeMessage = {
      role: 'bot',
      content: '¡Hola! Bienvenido a nuestra tienda. Soy un asistente virtual y estoy aquí para ayudarte. ¿En qué puedo asistirte hoy? Puedo ayudarte con información sobre productos, estado de pedidos, políticas de la tienda o cualquier otra consulta que tengas.',
      created_at: new Date().toISOString()
    };

    // Verificar si ya se mostró el mensaje de bienvenida
    if (!localStorage.getItem('welcome_message_shown')) {
      localStorage.setItem('welcome_message_shown', 'true');
      return [welcomeMessage];
    }
    
    // Si ya se mostró el mensaje de bienvenida, cargar el historial
    if (conversationId != 'undefined' && conversationId != null && conversationId != "null") {
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

        if (data.data && data.data.length > 0) {
          const messages = [];
          data.data.forEach(item => {
            // Agregar mensaje del usuario
            messages.push({
              role: 'user',
              content: item.query,
              created_at: new Date(item.created_at * 1000).toISOString()
            });
            // Agregar respuesta del bot usando agent_thoughts
            if (item.agent_thoughts && item.agent_thoughts.length > 0) {
              messages.push({
                role: 'bot',
                content: item.agent_thoughts[0].thought,
                created_at: new Date(item.agent_thoughts[0].created_at * 1000).toISOString()
              });
            }
          });
          return messages;
        }
        
        return [welcomeMessage];
      } catch (error) {
        console.error('Error cargando el historial:', error);
        return [welcomeMessage];
      }
    }
    
    return [welcomeMessage];
  }

  // Agregar mensaje al chat
  function addMessage(text, sender = 'bot', timestamp = null) {

    console.log(text);
    console.log(sender);
    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper');
    
    const msg = document.createElement('div');
    msg.textContent = text;
    msg.classList.add(sender === 'bot' ? 'bot-message' : 'user-message');
    wrapper.appendChild(msg);

    const time = document.createElement('div');
    time.classList.add('timestamp');
    time.textContent = timestamp || new Date().toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    wrapper.appendChild(time);

    chatbotBody.appendChild(wrapper);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  }

  // Mostrar indicador de "pensando"
  function showThinking() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper');
    wrapper.id = 'thinking-indicator';
    
    const msg = document.createElement('div');
    msg.classList.add('bot-message', 'thinking');
    msg.innerHTML = '<span></span><span></span><span></span>';
    wrapper.appendChild(msg);

    chatbotBody.appendChild(wrapper);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  }

  // Ocultar indicador de "pensando"
  function hideThinking() {
    const indicator = document.getElementById('thinking-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  // Mostrar indicador de "cargando historial"
  function showLoading() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper');
    wrapper.id = 'loading-indicator';
    
    const msg = document.createElement('div');
    msg.classList.add('bot-message', 'thinking');
    msg.innerHTML = '<span></span><span></span><span></span>';
    
    const loadingText = document.createElement('div');
    loadingText.classList.add('loading-text');
    loadingText.textContent = 'Cargando historial...';
    
    wrapper.appendChild(loadingText);
    wrapper.appendChild(msg);
    
    chatbotBody.appendChild(wrapper);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  }

  // Ocultar indicador de "cargando historial"
  function hideLoading() {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  // Inicializar el chat
  async function initializeChat() {
    // Limpiar el contenido del chat
    chatbotBody.innerHTML = '';
    
    // Mostrar loading
    showLoading();
    
    try {
      const userId = getUserId();
      const messages = await loadChatHistory(userId);

      // Ocultar loading antes de mostrar los mensajes
      hideLoading();

      console.log(messages);
      messages.forEach(message => {
        addMessage(message.content, message.role, new Date(message.created_at).toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }));
      });
    } catch (error) {
      hideLoading();
      addMessage('Lo siento, hubo un error al cargar el historial.', 'bot');
      console.error('Error:', error);
    }
  }

  // Event Listeners
  chatbotToggle.addEventListener('click', () => {
    chatbotWindow.classList.toggle('visible');
    document.body.classList.toggle('chat-open');
    if (chatbotWindow.classList.contains('visible')) {
      initializeChat();
    }
  });

  // Enviar mensaje
  async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    userInput.value = '';
    showThinking();

    try {
      const body = {
        shop: "quickstart-5000816f.myshopify.com",
        question: text,
        user: getUserId()
      }

      const conversationId = getConversationId();
      if (conversationId != 'undefined' && conversationId != null && conversationId != "null") {
        body.conversation_id = conversationId;
      }

      const response = await fetch("https://t4fuo3x065.execute-api.sa-east-1.amazonaws.com/dev/ask", {
        method: "POST",
        headers: {
          "x-api-key": "jpLK2lBdPXazhDz6K0yvG5Pef2w1ZMYr2OGMHElh",
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      hideThinking();

      // Usar agent_thoughts para la respuesta del bot
      if (data.agent_thoughts && data.agent_thoughts.length > 0) {
        addMessage(data.agent_thoughts[0].thought, 'bot');
      } else {
        addMessage(data.response, 'user');
      }

      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }
    } catch (error) {
      hideThinking();
      addMessage('Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.', 'bot');
      console.error('Error:', error);
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
});
