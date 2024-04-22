const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const bola = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    color: "GREEN"
};

const usuario = {
    x: 0,
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    color: "WHITE"
};

const computadora = {
    x: canvas.width - 10,
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    color: "WHITE"
};

// Está función lo que hara es dibujar los rectángulos (paletas)
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

// La función "drawBall" lo que hara es dibuja la pelota
function drawBall(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
}

// La función "DraText" lo que hara es dibujar el texto que en este contexto sera el de puntaje
function drawText(text, x, y) {
    ctx.fillStyle = "WHITE";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

// está función sera la actualización y lógica del juego
function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Creación simple de una IA para controlar la paleta del computador
    com.y += ((ball.y - (com.y + com.height / 2))) * 0.1;

    // Colisión con las paredes superior e inferior de la pantalla
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < canvas.width / 2) ? usuario : computadora;

    // Colisión con los rectangulos (paletas)
    if (collision(ball, player)) {
        // Cambiar dirección de la pelota
        let collidePoint = (ball.y - (player.y + player.height / 2));
        collidePoint = collidePoint / (player.height / 2);

        let angleRad = (Math.PI / 4) * collidePoint;

        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // Aumentar la velocidad de la pelota cada vez que golpea la paleta
        ball.speed += 0.1;
    }

    // Actualización del puntaje
    if(ball.x - ball.radius < 0){
        com.score++;
        resetBall();
    } else if(ball.x + ball.radius > canvas.width){
        user.score++;
        resetBall();
        alert("Player 1 ha ganado");
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);
    drawBall(ball.x, ball.y, ball.radius, ball.color);
    drawText(user.score, canvas.width / 4, canvas.height / 5);
    drawText(com.score, 3 * canvas.width / 4, canvas.height / 5);
}

// Colisión con las paletas
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return b.right > p.left && b.top < p.bottom && b.left < p.right && b.bottom > p.top;
}

// Función que hara resetear la pelota al centro después de que un jugador anota
function resetBall(){
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 7;
    ball.velocityX = -ball.velocityX;
}

// Llamar a la función update cada 16ms
let framePerSecond = 60;
setInterval(update, 1000/framePerSecond);