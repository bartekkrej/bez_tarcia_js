const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 600;

GEO_DX = canvas.width / 2;
GEO_DY = canvas.height / 2;

const GEO_D = 0.1;
EN = 6;

const rozmPkt = 10;

ctx.fillStyle = "#ffff";



function x2ekr(l) {
    return Math.round(l * GEO_D + GEO_DX)
}

function y2ekr(l) {
    return Math.round(l * GEO_D + GEO_DY)
}

class Form {

    constructor() {
        this.poz = {
            x: 100,
            y: 100,
        }
    }


    putTlo() {
        let ax = x2ekr(this.poz.x);
        let ay = y2ekr(this.poz.y);

        let dx = (canvas.width / EN);
        let dy = (canvas.height / EN);

        ax = ax % dx;
        ay = ay % dy;

        for (let i = 0; i < EN; i++) {
            let by = ay;
            for (let j = 0; j < EN; j++) {
                ctx.beginPath();
                ctx.arc(ax, by, 5, 0, 2 * Math.PI);
                ctx.fill();

                by += dy;
            }
            ax = ax + dx;
        }
    }
}



form = new Form()
form.putTlo()

