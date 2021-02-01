import "./style/index.less"

class Food {
    element: HTMLElement;
    // 定义一个属性表示事物对应的元素
    constructor() {
        // 获取页面中的food元素并将其赋值给element
        // !表示不可能为空，可以不用管
        this.element = document.getElementById("food")!;
    }

    // 定义一个获取食物X轴坐标的方法
    get x() {
        return this.element.offsetLeft;
    }
    // 定义一个获取食物Y轴坐标的方法
    get y() {
        return this.element.offsetTop;
    }

    // 修改食物位置的方法
    change() {
        // 生成一个随机位置，食物最小位置是0，最大是290
        let top = Math.round(Math.random() * 29) * 10;
        let left = Math.round(Math.random() * 29) * 10;
        this.element.style.top = top + "px"
        this.element.style.left = left + "px"
    }
}

// const food1 = new Food()
// console.log(food1.x, food1.y)
// food1.change()
// console.log(food1.x, food1.y)

// 积分牌的类
class ScorePanel {
    score = 0;
    level = 1;
    // 分数和等级所在的元素，在构造函数中初始化
    scoreEle: HTMLElement;
    levelEle: HTMLElement;
    constructor() {
        this.scoreEle = document.getElementById("score")!;
        this.levelEle = document.getElementById("level")!;
    }

    // 设置一个加分的方法
    addScore() {
        this.scoreEle.innerHTML = ++this.score + ''
    }

    // 设置一个升级的方法
    addLevel() {
        this.levelEle.innerHTML = ++this.level + ''
    }
}

const scorePanel = new ScorePanel()
scorePanel.addScore()