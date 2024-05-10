document.addEventListener("DOMContentLoaded", function() {
    var respuestas = {
        "problema_carrito": "Entiendo 😕. Por favor lee las siguientes opciones y elige la que más se adecua a lo que estás pasando;\n 1.No puedo comprar.\n 2.Problema con artículos dentro del carrito.\n 3.Otro.",
        "no_puedo_comprar": "Lo siento por los problemas que estás experimentando. Aquí hay algunas cosas que podrías intentar:\n1. Verifica que tu navegador esté actualizado.\nSi ninguno de estos consejos ayuda, por favor proporciona más detalles sobre el problema que estás experimentando.",
        "problema_con_articulos_dentro_del_carrito" : "Lamento escuchar que estás teniendo problemas con los artículos dentro de tu carrito. Por favor lee las siguientes opciones y elige la que más se adecua a tu problema:",
        "otro" : "Lo siento, ¿podrías explicarme detalladamente que otro problema estás experimentando?",
        "horario" : "Claro, el horario de atención que tenemos es \n De 9:00 a.m a 6:00 p.m de lunes a viernes \n 9:00 a.m a 3:00 p.m Sábados",
        "problema_articulos": "Entiendo que estés teniendo problemas con tus artículos. Por favor lee las siguientes opciones y elige la que más se adecua a tu problema;\n 1.Hay artículos publicados sin stock.\n 2.No puedo agregar mi artículo al carrito.\n 3.Problema con los descuentos de mi artículo.\n 4.otro",
        "articulo_sin_stock": "Entiendo, podrías por favor proporcionarme el SKU de el o los artículos en cuestión para poder verificarlos en sistema",
        "acerca_de_mi_pedido" : "Claro, ¿qué deseas saber acerca de tu pedido: \n 1-El status de tu pedido. \n 2- Tengo un problema con mi pedido. \n 3. Otro",
        "solicitar_numero_pedido": "Por favor, proporciona el número de tu pedido.",
        "status_de_mi_pedido" : function() {
            if (buytiti_chatbot_data.is_user_logged_in) {
                // Si el usuario está logueado, devuelve el status del pedido
                return "El status de tu pedido es: ";
            } else {
                // Si el usuario no está logueado, pide que inicie sesión
                return "Para conocer el status de tu pedido, es necesario que <a href='https://buytiti.com/login/?redirect_to=https%3A%2F%2Fbuytiti.com'>inicies sesión</a>";
            }
        }        
    };
    var contadorRespuestas = 0;
    var estado = 'inicial'; // estado inicial para poder generar inteciones padress
    function obtenerIntencion(mensaje) {
        // Aquí es donde analizarías el mensaje para determinar la intención.
        // usar una biblioteca de NLP o un servicio de NLP.
        var mensajeEnMinusculas = mensaje.toLowerCase();
        if ((mensajeEnMinusculas.includes("status") || mensajeEnMinusculas.includes("estado")) && mensajeEnMinusculas.includes("pedido")) {
            if (buytiti_chatbot_data.is_user_logged_in) {
                // Si el usuario ha iniciado sesión, cambia el estado a "esperando_numero_pedido"
                estado = "esperando_numero_pedido";
                return "solicitar_numero_pedido";
            } else {
                // Si el usuario no ha iniciado sesión, pide que inicie sesión
                return "status_de_mi_pedido";
            }
        } if (estado === "esperando_numero_pedido") {
            // Si el estado es "esperando_numero_pedido", trata el mensaje como un número de pedido
            validarNumeroPedido(mensaje);
            return;
        }
        else if (estado === 'inicial' && mensajeEnMinusculas.includes("carrito")) {
            estado = 'problema_carrito'; // Cambiar el estado
            return "problema_carrito";
        } else if (estado === 'problema_carrito' && (mensajeEnMinusculas.includes("1") || mensajeEnMinusculas.includes("opción 1") || mensajeEnMinusculas.includes("primera opción") || mensajeEnMinusculas.includes("no puedo comprar"))) {
            return "no_puedo_comprar";
        } else if (estado === 'inicial' && mensajeEnMinusculas.includes("no puedo comprar")) {
            return "no_puedo_comprar";
        } else if (estado === 'problema_carrito' && (mensajeEnMinusculas.includes("2") || mensajeEnMinusculas.includes("opción 2") || mensajeEnMinusculas.includes("segunda opción") || mensajeEnMinusculas.includes("problema con articulos dentro del carrito"))){
            return "problema_con_articulos_dentro_del_carrito";
        } else if (estado === 'problema_carrito' && (mensajeEnMinusculas.includes("3") || mensajeEnMinusculas.includes("opción 3") || mensajeEnMinusculas.includes("tercera opción") || mensajeEnMinusculas.includes("otro"))){ 
            return "otro";
        } else if (estado === 'inicial' && mensajeEnMinusculas.includes("horario")){
            return "horario";
        } else if (estado === 'inicial' && mensajeEnMinusculas.includes("articulo")) {
            estado = 'problema_articulos'; // Cambia el estado
            return "problema_articulos";
        } else if (estado === 'problema_articulos' && (mensajeEnMinusculas.includes("1") || mensajeEnMinusculas.includes("opción 1") || mensajeEnMinusculas.includes("primera opción") || mensajeEnMinusculas.includes("El artículo que quiero comprar no tiene stock"))){
            return "articulo_sin_stock";
        } else if (estado === 'inicial' && (mensajeEnMinusculas.includes("1") || mensajeEnMinusculas.includes("opción 1") || mensajeEnMinusculas.includes("primera opción") || mensajeEnMinusculas.includes("Problema con mi carrito"))){
            estado = 'problema_carrito'; // Cambia el estado a 'problema_carrito'
            return "problema_carrito";
        } else if (estado === 'inicial' && (mensajeEnMinusculas.includes("2") || mensajeEnMinusculas.includes("opción 2") || mensajeEnMinusculas.includes("segunda opción") || mensajeEnMinusculas.includes("Problema con artículos"))){
            estado = 'problema_articulos'; // Cambia el estado a 'problema_carrito'
            return "problema_articulos";
        } else if (estado === 'inicial' && (mensajeEnMinusculas.includes("3") || mensajeEnMinusculas.includes("opción 3") || mensajeEnMinusculas.includes("tercera opción") || mensajeEnMinusculas.includes("horario"))){
            estado = 'horario'; // Cambia el estado a 'problema_carrito'
            return "horario";
        } else if (estado === 'inicial' && mensajeEnMinusculas.includes("status") && mensajeEnMinusculas.includes("pedido")) {
            return "status_de_mi_pedido";
        } else if (estado === 'inicial' && mensajeEnMinusculas.includes("pedido")) {
            estado = 'acerca_de_mi_pedido';
            return "acerca_de_mi_pedido";
        } else if (estado === 'acerca_de_mi_pedido' && (mensajeEnMinusculas.includes("1") || mensajeEnMinusculas.includes("opción 1") || mensajeEnMinusculas.includes("primera opción") || mensajeEnMinusculas.includes("Status de mi pedido"))){
            return "status_de_mi_pedido"
        }
    }
    function validarNumeroPedido(numeroPedido) {
        // Aquí harías una solicitud AJAX a tu servidor para validar el número de pedido
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://buytiti.com/wp-admin/admin-ajax.php?action=validar_numero_pedido", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                // Cuando recibes la respuesta del servidor, verifica si el número de pedido es válido
                var esValido = JSON.parse(this.responseText).esValido;
                if (esValido) {
                    // Si el número de pedido es válido, solicita el estado del pedido
                    obtenerEstadoPedido(numeroPedido);
                } else {
                    // Si el número de pedido no es válido, informa al usuario
                    responder("Lo siento, ese número de pedido no es válido. Por favor, verifica e intenta de nuevo.");
                }
            }
        }
        xhr.send("numeroPedido=" + encodeURIComponent(numeroPedido));
    }

    function obtenerEstadoPedido(numeroPedido) {
        // Aquí harías una solicitud AJAX a tu servidor para obtener el estado del pedido
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://buytiti.com/wp-admin/admin-ajax.php?action=obtener_estado_pedido", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                // Cuando recibes la respuesta del servidor, muestra el estado del pedido al usuario
                var estadoPedido = JSON.parse(this.responseText).estadoPedido;
                responder("El estado de tu pedido es: " + estadoPedido);
            }
        }
        xhr.send("numeroPedido=" + encodeURIComponent(numeroPedido));
    }
    function responder(mensaje) {
        var intencion = obtenerIntencion(mensaje);
        var respuesta;
        var usarHTML = false; // Añade una variable para determinar si debes usar innerHTML
        if (intencion !== undefined) {
            respuesta = respuestas[intencion];
            if (typeof respuesta === "function") {
                // Si la respuesta es una función, la ejecuta para obtener la respuesta
                respuesta = respuesta();
            }
            if (intencion === "status_de_mi_pedido") {
                usarHTML = true; // Usa innerHTML para la intención "status_de_mi_pedido"
            }
        }
        if (!respuesta) {
            contadorRespuestas++;
            respuesta = "Lo siento, no he podido entender tu problema, podrías leer las siguientes opciones y seleccionar la que más se adecua a tu duda: \n 1.Problema con mi carrito \n 2.Problema con artículos \n 3.Horario";
            if (contadorRespuestas > 2) {
                respuesta = "Lo siento. ¿Podrías proporcionarme tu problema de manera más específica? O ";
                respuesta += "<a href='https://wa.me/1234567890'>comunícate con un asesor</a> para una mejor atención.";
                usarHTML = true;
            }
        }
        var respuestaContainer = document.createElement('div');
        respuestaContainer.className = 'chatbot-response';
        var chatbotIcon = document.createElement('img');
        chatbotIcon.src = 'https://buytiti.com/wp-content/uploads/2024/05/TITI.png';
        chatbotIcon.alt = 'Logo de tu sitio';
        chatbotIcon.className = 'chatbot-icon chat-profile-pic';
        
        var respuestaText = document.createElement('p');
        if (usarHTML) {
            respuestaText.innerHTML = respuesta; // Usa innerHTML si usarHTML es true
        } else {
            respuestaText.innerText = respuesta; // Usa innerText si usarHTML es false
        }
        respuestaContainer.appendChild(chatbotIcon);
        respuestaContainer.appendChild(respuestaText);
        // Añade la respuesta del chatbot al chatLog
        var chatLog = document.getElementById("chatLog");
        chatLog.appendChild(respuestaContainer);
        chatLog.appendChild(respuestaContainer);
        document.querySelector('.chat-popup').scrollTop = document.querySelector('.chat-popup').scrollHeight;
    }
    

    function openForm() {
        document.getElementById("myForm").style.display = "block";
    }

    function closeForm() {
        document.getElementById("myForm").style.display = "none";
    }
    document.getElementById("userInput").addEventListener("input", function() {
        var input = document.getElementById("userInput");
        var sendButton = document.getElementById("sendButton");
        if (input.value.trim() === "") {
            // El campo de entrada de texto está vacío
            // Cambia el color de fondo del botón de envío a su color original
            sendButton.style.backgroundColor = "transparent";
        } else {
            // El campo de entrada de texto no está vacío
            // Cambia el color de fondo del botón de envío a verde
            sendButton.style.backgroundColor = "#9cff9c";
        }
    });
    
    // Cierra la ventana de chat al cargar la página
    closeForm();

    function saveMessage() {
        var input = document.getElementById("userInput");
        var message = input.value;
        if (message.trim() === "") {
            // El mensaje está vacío o solo contiene espacios en blanco
            // No hagas nada y retorna de la función
            return;
        }
        input.value = "";
        var chatLog = document.getElementById("chatLog");
        var messageContainer = document.createElement('div');
        messageContainer.className = 'user-message';
        var userIcon = document.createElement('img');
        userIcon.src = 'https://buytiti.com/wp-content/uploads/2024/05/usuario.png';
        userIcon.alt = 'Icono de usuario';
        userIcon.className = 'user-icon chat-profile-pic';
    
        var messageText = document.createElement('p');
        messageText.innerText = message;
        messageText.className = 'user-message-text';
    
        messageContainer.appendChild(userIcon);
        messageContainer.appendChild(messageText);
        chatLog.appendChild(messageContainer);
        responder(message);
    }

    document.getElementById("userInput").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            saveMessage();
        }
    });

    window.openForm = openForm;
    window.closeForm = closeForm;
    document.getElementById("sendButton").addEventListener("click", saveMessage);
});