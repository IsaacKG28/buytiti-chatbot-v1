<?php
/**
 * Plugin Name: Buytiti Chatbot V1
 * Plugin URI: buytiti.com
 * Description: Este es un chatbot sencillo creado con intenciones y respuestas.
 * Version: 1.0
 * Author: Fernando Isaac Gonzalez Medina 
 * Author URI:
 */

function buytiti_chatbot_scripts() {
    wp_enqueue_style( 'buytiti-chatbot-styles', plugin_dir_url( __FILE__ ) . 'buytiti-chatbot-styles.css' );
    wp_enqueue_script( 'buytiti-chatbot-script', plugin_dir_url( __FILE__ ) . 'buytiti-chatbotscript.js', array(), '1.0.0', true );

    // Pasa el estado de inicio de sesión del usuario a JavaScript
    wp_localize_script( 'buytiti-chatbot-script', 'buytiti_chatbot_data', array(
        'is_user_logged_in' => is_user_logged_in()
    ) );
}
add_action( 'wp_enqueue_scripts', 'buytiti_chatbot_scripts' );

// Añade las nuevas funciones aquí
function validar_numero_pedido() {
    $numeroPedido = $_POST['numeroPedido'];
    $pedido = wc_get_order($numeroPedido);
    if ($pedido) {
        // El pedido existe
        echo json_encode(array('esValido' => true));
    } else {
        // El pedido no existe
        echo json_encode(array('esValido' => false));
    }
    wp_die(); // Asegúrate de terminar correctamente la solicitud AJAX
}
add_action('wp_ajax_validar_numero_pedido', 'validar_numero_pedido');

function obtener_estado_pedido() {
    $numeroPedido = $_POST['numeroPedido'];
    $pedido = wc_get_order($numeroPedido);
    if ($pedido) {
        // El pedido existe, obtén el estado
        $estadoPedido = $pedido->get_status();
        echo json_encode(array('estadoPedido' => $estadoPedido));
    } else {
        // El pedido no existe
        echo json_encode(array('error' => 'El pedido no existe'));
    }
    wp_die(); // Asegúrate de terminar correctamente la solicitud AJAX
}
add_action('wp_ajax_obtener_estado_pedido', 'obtener_estado_pedido');

function render_chatbot() {
    ?>
    <div>
        <a onClick="openForm()" class="wp-block-buytiti-chatbot-buytiti-chatbot">
            <img src="https://buytiti.com/wp-content/uploads/2024/05/TITI.png" alt="Logo de tu sitio" />
            <span class="chat-help">¿Necesitas Ayuda?</span>
        </a>
        <div class="chat-popup" id="myForm">
            <form class="form-container">
                <div class="chat-message">
                    <img class="chat-profile-pic" src="https://buytiti.com/wp-content/uploads/2024/05/TITI.png" alt="Logo de tu sitio" />
                    <p class="chat-title">Hola, Soy Titi. ¿Cómo puedo ayudarte?</p>
                </div>
                <button type="button" class="btn cancel" onClick="closeForm()">X</button>
                <div id="chatLog"></div>
            </form>
            <div class="input-container">
                <input type="text" id="userInput" placeholder="Escribe tu mensaje aquí..." />
                <button type="button" id="sendButton" onClick="saveMessage()">
                <img src="https://buytiti.com/wp-content/uploads/2024/05/send-icon.png" alt="Enviar" />
                </button>
            </div>
        </div>
    </div>
    <?php
}
add_shortcode('buytiti_chatbot', 'render_chatbot');

?>