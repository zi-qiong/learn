import Snake from './Snake'
import Food from './Food'
import ScorePanel from './ScorePanel'

class GameControl {
    // 定义三个属性
    // 蛇
    snake: Snake;
    // 食物
    food: Food;
    // 记分牌
    scorePanel: ScorePanel;

    // 创建一个属性来存储蛇移动的方向（也就是按键的方向）
    direction: string = '';

    constructor() {
        this.snake = new Snake()
        this.food = new Food()
        this.scorePanel = new ScorePanel()

        this.init()
    }
    // 游戏的初始化方法，调用后有戏开始
    init() {
        // 绑定键盘按键按下的事件 
        // 注意this的绑定
        document.addEventListener('keydown', this.keydownHandler.bind(this));
        // 调用run方法，使蛇移动
        this.run();
    }

    // 创建一个键盘按下的响应函数
    keydownHandler(event: KeyboardEvent) {
        console.log(this)
        this.direction = event.key
        /* 
            event.key:
            ArrowUp
            ArrowDown
            ArrowLeft
            ArrowRight
         */
    }

    // 创建一个蛇移动的方法
    run() {
        /* 根据方向来使蛇的位置改变
        * 向上 top 减少
        * 向下 top 增加
        * 向左 left 减少
        * 向右 left 增加
         */
        let X = this.snake.X;
        let Y  = this.snake.Y;
        // 根据按键的方向来修改X值和Y值
        switch(this.direction) {
            case "ArrowUp":
            case "Up":
                Y -= 10;
                break;
            case "ArrowDown":
            case "Down":
                Y += 10;
                break;
            case "ArrowLeft":
            case "Left":
                X -= 10;
                break;
            case "ArrowRight":
            case "Right":
                X += 10;
                break;
        }

        // 修改蛇的X和Y
        this.snake.X = X;
        this.snake.Y = Y;
        setTimeout(this.run.bind(this), 300)
    }
}

export default GameControl;