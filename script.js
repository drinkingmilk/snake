const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scale = 20;  // Size of each grid square
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let food;
let score = 0;

document.addEventListener('keydown', changeDirection);

function startGame() {
    snake = new Snake();
    food = new Food();
    score = 0;
    window.setInterval(update, 200);  // Update every 300ms
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.move();
    snake.draw();
    food.draw();

    if (snake.collidesWithWall() || snake.collidesWithSelf()) {
        alert('Game Over! Final Score: ' + score);
        startGame();
    }

    if (snake.eatsFood(food)) {
        score++;
        food = new Food();  // Generate a new food item
        document.getElementById('score').innerText = 'Score: ' + score;
    }
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    if (keyPressed === 37 && snake.direction !== 'right') {
        snake.setDirection('left');
    } else if (keyPressed === 38 && snake.direction !== 'down') {
        snake.setDirection('up');
    } else if (keyPressed === 39 && snake.direction !== 'left') {
        snake.setDirection('right');
    } else if (keyPressed === 40 && snake.direction !== 'up') {
        snake.setDirection('down');
    }
}

function Snake() {
    this.snakeArray = [{x: 5, y: 5}];
    this.direction = 'right';

    this.draw = function() {
        ctx.fillStyle = '#00FF00';
        this.snakeArray.forEach(segment => {
            ctx.fillRect(segment.x * scale, segment.y * scale, scale, scale);
        });
    };

    this.move = function() {
        const head = { ...this.snakeArray[0] };

        if (this.direction === 'left') head.x -= 1;
        if (this.direction === 'up') head.y -= 1;
        if (this.direction === 'right') head.x += 1;
        if (this.direction === 'down') head.y += 1;

        this.snakeArray.unshift(head);
        this.snakeArray.pop();
    };

    this.setDirection = function(newDirection) {
        this.direction = newDirection;
    };

    this.collidesWithWall = function() {
        const head = this.snakeArray[0];
        return head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows;
    };

    this.collidesWithSelf = function() {
        const head = this.snakeArray[0];
        return this.snakeArray.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
    };

    this.eatsFood = function(food) {
        const head = this.snakeArray[0];
        return head.x === food.x && head.y === food.y;
    };
}

function Food() {
    this.x = Math.floor(Math.random() * columns);
    this.y = Math.floor(Math.random() * rows);

    this.draw = function() {
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.x * scale, this.y * scale, scale, scale);
    };
}

// Start the game when the page loads
startGame();
