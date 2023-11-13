const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d');
ctx.fillStyle = "white";

canvas.width = 600;
canvas.height = 600;

GEO_DX = canvas.width / 2;
GEO_DY = canvas.height / 2;

const GEO_D = 0.1;
EN = 6;

const rozmPkt = 10;

function x2ekr(l) {
    return Math.round(l * GEO_D + GEO_DX)
}

function y2ekr(l) {
    return Math.round(l * GEO_D + GEO_DY)
}

class Vec {
    // constructor(x, y){
    //     this.x = x
    //     this.y = y
    //     this.val = this.getValue()
    //     this.arg = this.getArg()
    // }
    // constructor(x, y, arg, val){
    //     this.x = x
    //     this.y = y
    //     this.val = val
    //     this.arg = arg
    // }
    constructor() {
        this.x = 0
        this.y = 0
        this.val = 0
        this.arg = 0
    }

    static fromArgValue(arg, val) {
        let res = new Vec()
        res.arg = arg
        res.val = val
        res.x = res.val * Math.cos(arg)
        res.y = val * Math.sin(arg)
        return res;
    }

    add(other) {
        this.x += other.x
        this.y += other.y
        updateArgVal()
    }

    getValue() {
        return Math.sqrt(this.x * this.x + this.y + this.y)
    }

    getArg() {
        return Math.atan2(this.y, this.x)
    }

    updateArgVal() {
        this.arg = this.getArg()
        this.val = this.getValue()
    }
}


class Form {

    constructor() {
        this.poz = new Vec()
        this.pr = new Vec()
        this.przysp = new Vec()

    }


    putTlo() {


        ctx.fillStyle = "blue";
        ctx.fillRect(0, 0, canvas.width, canvas.height);


        ctx.fillStyle = "white";

        let ax = x2ekr(this.poz.x);
        let ay = y2ekr(this.poz.y);

        let dx = (canvas.width / EN);
        let dy = (canvas.height / EN);

        ax = ax % dx;
        ay = ay % dy;

        for (let i = 0; i <= EN; i++) {
            let by = ay;
            for (let j = 0; j <= EN; j++) {
                ctx.beginPath();
                ctx.arc(ax, by, 5, 0, 2 * Math.PI);
                ctx.fill();

                by += dy;
            }
            ax = ax + dx;
        }
    }

    iter() {
        
        this.putTlo()

        this.poz.x = this.poz.x - this.pr.x;
        this.poz.y = this.poz.y - this.pr.y;
        this.pr.x = this.pr.x + this.przysp.x;
        this.pr.y = this.pr.y + this.przysp.y;



    }


}



let form = new Form()



window.onload = function () {
    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);
    setInterval(update, 10);
}

function keyDown(e) {
    if (e.code == "ArrowUp") {
        form.przysp = Vec.fromArgValue(form.przysp.arg, 1)
    }
    if (e.code == "ArrowDown") {
        form.przysp = Vec.fromArgValue(form.przysp.arg, -1)
    }
    if (e.code == "ArrowLeft") {
        form.przysp = Vec.fromArgValue(form.przysp.arg - Math.PI / 20, form.przysp.val)
    }
    if (e.code == "ArrowRight") {
        form.przysp = Vec.fromArgValue(form.przysp.arg + Math.PI / 20, form.przysp.val)
    }

    // console.log(form.przysp)
    // console.log(form.pr)
}

function keyUp(e) {
    if (e.code == "ArrowUp" || e.code == "ArrowDown") {
        form.przysp = Vec.fromArgValue(form.przysp.arg, 0.0)
    }

}

function update() {
    form.iter()
}

